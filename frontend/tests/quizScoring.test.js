import test from 'node:test';
import assert from 'node:assert/strict';

import { gateQuestions, gateSubjects } from '../src/learningData.js';
import { buildGateQuiz, calculateQuizResults, isQuizAnswerCorrect, submitQuizAnswer } from '../src/quizScoring.js';

function makeQuestions(count) {
  return Array.from({ length: count }, (_, index) => ({
    question: `Question ${index + 1}`,
    topic: `Topic ${(index % 3) + 1}`,
    answer: 'correct',
    explanation: `Explanation ${index + 1}`,
    options: ['correct', 'incorrect'],
    sourceType: index % 2 ? 'original-practice' : 'verified-pyq',
  }));
}

test('scores 5, 10, and 15 question attempts from submitted answers', () => {
  for (const count of [5, 10, 15]) {
    const questions = makeQuestions(count);
    let answers = {};
    for (let index = 0; index < count; index += 1) {
      answers = submitQuizAnswer(answers, index, index < Math.floor(count * 0.7) ? 'correct' : 'incorrect');
    }

    const result = calculateQuizResults(questions, answers);
    const expectedCorrect = Math.floor(count * 0.7);

    assert.equal(result.total, count);
    assert.equal(result.correct, expectedCorrect);
    assert.equal(result.incorrect, count - expectedCorrect);
    assert.equal(result.unanswered, 0);
    assert.equal(result.percent, Math.round((expectedCorrect / count) * 100));
  }
});

test('counts unanswered questions and prevents an answer from being submitted twice', () => {
  const questions = makeQuestions(5);
  let answers = submitQuizAnswer({}, 0, 'correct');
  const firstSubmission = answers;
  const repeatedSubmission = submitQuizAnswer(answers, 0, 'incorrect');
  assert.equal(repeatedSubmission, firstSubmission);
  answers = repeatedSubmission;
  answers = submitQuizAnswer(answers, 2, 'incorrect');
  const result = calculateQuizResults(questions, answers);

  assert.equal(result.correct, 1);
  assert.equal(result.incorrect, 1);
  assert.equal(result.unanswered, 3);
  assert.equal(result.attempted, 2);
});

test('reports the requested 7 of 10 and 12 of 15 score examples', () => {
  for (const [count, correctCount, percent] of [[10, 7, 70], [15, 12, 80]]) {
    const questions = makeQuestions(count);
    const answers = Object.fromEntries(questions.map((_, index) => [
      index,
      index < correctCount ? 'correct' : 'incorrect',
    ]));
    const result = calculateQuizResults(questions, answers);

    assert.equal(result.correct, correctCount);
    assert.equal(result.total, count);
    assert.equal(result.percent, percent);
  }
});

test('a fresh retake starts unanswered without mutating a previous result', () => {
  const questions = makeQuestions(5);
  const firstAnswers = Object.fromEntries(questions.map((_, index) => [index, 'correct']));
  const previousResult = calculateQuizResults(questions, firstAnswers);
  const retakeResult = calculateQuizResults(questions, {});

  assert.equal(previousResult.correct, 5);
  assert.equal(retakeResult.correct, 0);
  assert.equal(retakeResult.unanswered, 5);
});

test('validates numerical answers with tolerance and multiple-select answers exactly', () => {
  const questions = [
    { type: 'numeric', answer: 3.14, tolerance: 0.01 },
    { type: 'multiple-select', answer: ['A', 'C'] },
    { type: 'multiple-select', answer: ['B', 'D'] },
  ];
  const result = calculateQuizResults(questions, {
    0: '3.145',
    1: ['C', 'A', 'A'],
    2: ['B'],
  });

  assert.equal(result.correct, 2);
  assert.equal(result.incorrect, 1);
  assert.equal(isQuizAnswerCorrect({ type: 'numeric', answer: 0 }, null), false);
});

test('builds GATE practice sessions with 5, 10, and 15 unique syllabus-tagged questions', () => {
  for (const count of [5, 10, 15]) {
    const questions = buildGateQuiz(gateQuestions, gateSubjects, 'All GATE CS subjects', 'All', count);

    assert.equal(questions.length, count);
    assert.equal(new Set(questions.map((question) => question.quizId)).size, count);
    assert.ok(questions.every((question) => question.syllabus && question.explanation));
    assert.ok(questions.every((question) => question.source === 'Original practice' && question.topic.includes(question.subject)));
  }
});

test('preserves focused subject and difficulty filters in GATE sessions', () => {
  const questions = buildGateQuiz(
    gateQuestions,
    gateSubjects,
    'Algorithms',
    'Hard',
    15,
  );

  assert.equal(questions.length, 2);
  assert.ok(questions.every((question) => question.subject === 'Algorithms' && question.difficulty === 'Hard'));
});

test('separates verified PYQ and original practice performance using question metadata', () => {
  const questions = [
    { question: 'PYQ', answer: 'A', verifiedPyq: true, subject: 'Algorithms' },
    { question: 'Practice', answer: 'B', sourceType: 'original-practice', subject: 'Algorithms' },
  ];
  const result = calculateQuizResults(questions, { 0: 'A', 1: 'A' });

  assert.deepEqual(result.sourcePerformance.map(({ name, total, correct }) => ({ name, total, correct })), [
    { name: 'verified-pyq', total: 1, correct: 1 },
    { name: 'original-practice', total: 1, correct: 0 },
  ]);
});
