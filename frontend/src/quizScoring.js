export function isQuizAnswerCorrect(question, response) {
  if (question.type === 'numeric') {
    if (response === null || response === undefined || String(response).trim() === '') return false;
    const value = Number(response);
    if (!Number.isFinite(value)) return false;
    if (Number.isFinite(question.acceptedMin) && Number.isFinite(question.acceptedMax)) {
      return value >= question.acceptedMin && value <= question.acceptedMax;
    }
    const expected = Number(question.answer);
    return Number.isFinite(expected) && Math.abs(value - expected) <= (question.tolerance ?? 0);
  }

  if (question.type === 'multiple-select' || question.type === 'msq') {
    if (!Array.isArray(response) || !Array.isArray(question.answer)) return false;
    const selected = [...new Set(response.map(String))].sort();
    const expected = [...new Set(question.answer.map(String))].sort();
    return selected.length === expected.length && selected.every((value, index) => value === expected[index]);
  }

  return response === question.answer;
}

export function submitQuizAnswer(answers, questionIndex, response) {
  if (Object.hasOwn(answers, questionIndex)) return answers;
  return { ...answers, [questionIndex]: response };
}

export function calculateQuizResults(questions, answers) {
  const reviews = questions.map((question, index) => {
    const answered = Object.hasOwn(answers, index);
    const response = answered ? answers[index] : null;
    const correct = answered && isQuizAnswerCorrect(question, response);
    return {
      question,
      index,
      response,
      answered,
      correct,
      topic: question.topic || question.subject || 'General',
      sourceType: question.verifiedPyq === true || question.sourceType === 'verified-pyq'
        ? 'verified-pyq'
        : 'original-practice',
    };
  });
  const correct = reviews.filter((item) => item.correct).length;
  const incorrect = reviews.filter((item) => item.answered && !item.correct).length;
  const unanswered = reviews.filter((item) => !item.answered).length;

  const groupPerformance = (key) => Object.values(reviews.reduce((groups, review) => {
    const group = review[key];
    if (!groups[group]) groups[group] = { name: group, total: 0, attempted: 0, correct: 0 };
    groups[group].total += 1;
    if (review.answered) groups[group].attempted += 1;
    if (review.correct) groups[group].correct += 1;
    return groups;
  }, {})).map((group) => ({
    ...group,
    incorrect: group.attempted - group.correct,
    unanswered: group.total - group.attempted,
    percent: group.total ? Math.round((group.correct / group.total) * 100) : 0,
  }));
  const sourcePerformance = groupPerformance('sourceType');

  return {
    total: questions.length,
    attempted: correct + incorrect,
    correct,
    incorrect,
    unanswered,
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    reviews,
    topicPerformance: groupPerformance('topic'),
    sourcePerformance: ['verified-pyq', 'original-practice'].map((sourceType) => (
      sourcePerformance.find((group) => group.name === sourceType)
      || { name: sourceType, total: 0, attempted: 0, correct: 0, incorrect: 0, unanswered: 0, percent: 0 }
    )),
  };
}

export function buildGateQuiz(questionBank, subjects, selectedSubject, difficulty, count) {
  const subjectPool = selectedSubject === 'All GATE CS subjects'
    ? subjects
    : [selectedSubject];
  const pools = subjectPool.map((subject) => ({
    subject,
    questions: (questionBank[subject] || [])
      .filter((question) => difficulty === 'All' || question.difficulty === difficulty)
      .map((question, index) => ({
        ...question,
        subject,
        topic: question.topic || `${question.kind} · ${subject}`,
        source: question.verifiedPyq === true || question.sourceType === 'verified-pyq'
          ? question.source || 'Verified GATE PYQ'
          : question.source || 'Original practice',
        quizId: `${subject}:${index}`,
      })),
  }));
  const available = pools.reduce((total, pool) => total + pool.questions.length, 0);
  const quiz = [];
  let round = 0;

  while (quiz.length < Math.min(count, available)) {
    let addedInRound = false;
    for (const pool of pools) {
      const question = pool.questions[round];
      if (question) {
        quiz.push(question);
        addedInRound = true;
        if (quiz.length === Math.min(count, available)) break;
      }
    }
    if (!addedInRound) break;
    round += 1;
  }

  return quiz;
}

export function getQuizFeedback(percent) {
  if (percent >= 80) return 'Excellent work — you have a strong grasp of this material.';
  if (percent >= 60) return 'Good progress — review the missed topics to strengthen your understanding.';
  return 'Keep practicing — reviewing the explanations is a great next step.';
}
