import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gateQuestions, gateSubjects, resourceCatalog } from './learningData';
import { createConceptQuiz, summarizeComparison } from './learningFeatures';
import { buildGateQuiz, calculateQuizResults, getQuizFeedback, isQuizAnswerCorrect, submitQuizAnswer } from './quizScoring';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '');
const getApiErrorMessage = (error, fallback) => {
  if (error instanceof TypeError) {
    return `Cannot reach the Python API at ${API_BASE}. Start the backend in a separate terminal from the project folder (see README → Quick Start), then retry.`;
  }
  return error instanceof Error ? error.message : fallback;
};
const CodeEditor = lazy(() => import('./CodeEditor'));

function readQuizHistory(key) {
  try {
    const history = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

const examples = {
  starter: {
    label: 'Shop total',
    description: 'A simple purchase calculation in a real checkout flow.',
    code: `items = [30, 45, 25]
subtotal = sum(items)
vat = subtotal * 0.1
final_total = subtotal + vat
print(final_total)`,
  },
  loop: {
    label: 'Student marks',
    description: 'Loop over marks and calculate the average score.',
    code: `marks = [80, 90, 70, 85]
sum_marks = 0
for score in marks:
    sum_marks += score
average = sum_marks / len(marks)
print(round(average, 2))`,
  },
  function: {
    label: 'ATM withdrawal',
    description: 'A function simulates a bank withdrawal with a balance check.',
    code: `def withdraw(balance, amount):
    if amount <= balance:
        return balance - amount
    return 'Insufficient funds'

balance = 500
print(withdraw(balance, 240))`,
  },
  flow: {
    label: 'Attendance check',
    description: 'Conditional logic decides whether a class is considered attended.',
    code: `present = 17
total_classes = 20
attendance = (present / total_classes) * 100
if attendance >= 75:
    status = 'Eligible'
else:
    status = 'Warning'
print(status)`,
  },
};

const initialTrace = { status: 'idle', steps: [], output: '', final_variables: {}, error: null };

function renderValue(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return `[${value.map(renderValue).join(', ')}]`;
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
}

function renderDiagramNodes(nodes = [], currentLine, onSelectLine, prefix = 'node') {
  return nodes.map((node, index) => {
    const active = currentLine >= node.line && currentLine <= (node.end_line || node.line);
    return (
      <div className={`diagram-node-wrap ${active ? 'is-active' : ''}`} key={`${prefix}-${node.line}-${index}`}>
        <button className={`diagram-node kind-${node.kind}`} onClick={() => onSelectLine(node.line)}>
          <span className="diagram-kind">{node.kind}</span>
          <code>{node.label}</code>
          <small>line {node.line}{node.recursive ? ' · recursive' : ''}</small>
          {node.phases && <span className="diagram-phases">{node.phases.join(' → ')}</span>}
        </button>
        {node.branches && (
          <div className="diagram-branches">
            {node.branches.map((branch) => {
              const branchIsActive = branch.nodes.some((branchNode) => currentLine >= branchNode.line && currentLine <= (branchNode.end_line || branchNode.line));
              return (
              <div className={`diagram-branch ${branchIsActive ? 'branch-active' : ''}`} key={`${node.line}-${branch.label}`}>
                <strong>{branch.label}</strong>
                {branch.nodes.length ? renderDiagramNodes(branch.nodes, currentLine, onSelectLine, `${prefix}-${branch.label}`) : <span className="empty-state">No statements</span>}
              </div>
              );
            })}
          </div>
        )}
        {node.children?.length > 0 && (
          <div className="diagram-children">
            {renderDiagramNodes(node.children, currentLine, onSelectLine, `${prefix}-child`)}
          </div>
        )}
      </div>
    );
  });
}

function QuizResults({
  title,
  result,
  showReview,
  onToggleReview,
  onRetake,
  onRetryIncorrect,
  history,
  onClearHistory,
}) {
  const correctTopics = result.topicPerformance.filter((topic) => topic.correct > 0);
  const improvementTopics = result.topicPerformance.filter((topic) => topic.incorrect > 0 || topic.unanswered > 0);

  return (
    <section className="quiz-results result-panel" aria-live="polite">
      <div className="result-heading">
        <div>
          <span className="section-kicker">{title} results</span>
          <h3>{result.correct}/{result.total} ({result.percent}%)</h3>
        </div>
        <div className="result-meter" role="img" aria-label={`${result.percent}% accuracy`}>
          <span style={{ width: `${result.percent}%` }} />
        </div>
      </div>
      <p className="result-encouragement">{getQuizFeedback(result.percent)}</p>
      <div className="result-stat-grid">
        <div><strong>{result.total}</strong><span>Total questions</span></div>
        <div><strong>{result.attempted}/{result.total}</strong><span>Attempted</span></div>
        <div><strong>{result.correct}</strong><span>Correct</span></div>
        <div><strong>{result.incorrect}</strong><span>Incorrect</span></div>
        <div><strong>{result.unanswered}</strong><span>Unanswered</span></div>
        <div><strong>{result.percent}%</strong><span>Accuracy</span></div>
      </div>

      {title === 'Concept Analysis Quiz' ? (
        <div className="topic-results">
          <div>
            <strong>Concepts answered correctly</strong>
            <span>{correctTopics.map((topic) => topic.name).join(', ') || 'Keep practicing these concepts.'}</span>
          </div>
          <div>
            <strong>Concepts to improve</strong>
            <span>{improvementTopics.map((topic) => topic.name).join(', ') || 'None — all questions were answered correctly.'}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="topic-performance-list">
            <strong>Topic-wise performance</strong>
            {result.topicPerformance.map((topic) => (
              <div className="topic-performance-row" key={topic.name}>
                <span>{topic.name}</span>
                <span>{topic.correct}/{topic.total} correct · {topic.percent}%</span>
              </div>
            ))}
          </div>
          <div className="topic-performance-list source-performance-list">
            <strong>Question source performance</strong>
            {result.sourcePerformance.map((source) => (
              <div className="topic-performance-row" key={source.name}>
                <span>{source.name === 'verified-pyq' ? 'Verified GATE PYQs' : 'Original GATE-style practice'}</span>
                <span>{source.correct}/{source.total} correct · {source.percent}%</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="result-actions">
        <button className="secondary" onClick={onToggleReview}>{showReview ? 'Hide answer review' : 'Review answers'}</button>
        {onRetryIncorrect && <button className="secondary" onClick={onRetryIncorrect} disabled={!result.incorrect}>Retry incorrect questions</button>}
        <button className="primary" onClick={onRetake}>{title === 'Concept Analysis Quiz' ? 'Retake quiz' : 'Restart quiz'}</button>
      </div>

      {showReview && (
        <div className="answer-review">
          {result.reviews.map((review) => (
            <article className={`answer-review-item ${review.correct ? 'answer-correct' : review.answered ? 'answer-incorrect' : 'answer-unanswered'}`} key={review.index}>
              <div className="answer-review-heading">
                <strong>Question {review.index + 1} · {review.topic}</strong>
                <span>{review.correct ? 'Correct' : review.answered ? 'Incorrect' : 'Unanswered'}</span>
              </div>
              <p>{review.question.prompt || review.question.question}</p>
              <span>Your answer: {review.answered ? renderValue(review.response) : 'Not answered'}</span>
              <span>Correct answer: {renderValue(review.question.answer)}</span>
              <small>{review.question.explanation}</small>
            </article>
          ))}
        </div>
      )}

      {history.length > 1 && (
        <details className="previous-results">
          <summary>Previous attempts ({history.length - 1})</summary>
          <div>
            {history.slice(1).map((attempt, index) => (
              <span key={`${attempt.completedAt}-${index}`}>
                {new Date(attempt.completedAt).toLocaleString()}: {attempt.correct}/{attempt.total} ({attempt.percent}%)
              </span>
            ))}
          </div>
        </details>
      )}
      {history.length > 0 && <button className="text-button clear-results" onClick={onClearHistory}>Clear saved results</button>}
    </section>
  );
}

function QuizAnswerOptions({ question, selection, onSelect, disabled }) {
  if (question.type === 'numeric') {
    return (
      <label className="numeric-answer-input">
        Numerical answer
        <input
          type="number"
          step="any"
          value={selection ?? ''}
          onChange={(event) => onSelect(event.target.value === '' ? null : event.target.value)}
          disabled={disabled}
        />
      </label>
    );
  }

  if (question.type === 'multiple-select' || question.type === 'msq') {
    const selectedOptions = Array.isArray(selection) ? selection : [];
    return (
      <div className="quiz-options multi-select-options">
        {(question.options || []).map((option) => {
          const checked = selectedOptions.includes(option);
          const correct = Array.isArray(question.answer)
            ? question.answer.includes(option)
            : option === question.answer;
          return (
            <label className={`multi-select-option ${checked ? 'selected' : ''} ${disabled && correct ? 'correct' : ''} ${disabled && checked && !correct ? 'wrong' : ''}`} key={option}>
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => {
                  const nextOptions = checked
                    ? selectedOptions.filter((item) => item !== option)
                    : [...selectedOptions, option];
                  onSelect(nextOptions.length ? nextOptions : null);
                }}
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <div className="quiz-options" role="group" aria-label="Answer choices">
      {(question.options || []).map((option) => {
        const correct = Array.isArray(question.answer)
          ? question.answer.includes(option)
          : option === question.answer;
        const selected = selection === option;
        const className = [
          'quiz-option',
          selected && 'selected',
          disabled && correct && 'correct',
          disabled && selected && !correct && 'wrong',
        ].filter(Boolean).join(' ');
        return (
          <button key={option} className={className} onClick={() => onSelect(option)} disabled={disabled}>
            {option}
          </button>
        );
      })}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('python-visualizer-theme');
    return ['light', 'dark'].includes(savedTheme) ? savedTheme : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });
  const [selectedExample, setSelectedExample] = useState('starter');
  const [isCustomCode, setIsCustomCode] = useState(false);
  const [code, setCode] = useState(examples.starter.code);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [traceResult, setTraceResult] = useState(initialTrace);
  const [currentStep, setCurrentStep] = useState(-1);
  const [status, setStatus] = useState('Ready to run');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(600);
  const [timeoutSeconds, setTimeoutSeconds] = useState(5);
  const [baselineCode, setBaselineCode] = useState(examples.starter.code);
  const [comparison, setComparison] = useState(null);
  const [comparisonError, setComparisonError] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [conceptQuizComplete, setConceptQuizComplete] = useState(false);
  const [conceptResult, setConceptResult] = useState(null);
  const [showConceptReview, setShowConceptReview] = useState(false);
  const [conceptHistory, setConceptHistory] = useState(() => readQuizHistory('python-visualizer-concept-results'));
  const [gateSubject, setGateSubject] = useState('All GATE CS subjects');
  const [gateDifficulty, setGateDifficulty] = useState('All');
  const [gateQuestionCount, setGateQuestionCount] = useState(15);
  const [gateSessionQuestions, setGateSessionQuestions] = useState(() => buildGateQuiz(gateQuestions, gateSubjects, 'All GATE CS subjects', 'All', 15));
  const [gateQuestionIndex, setGateQuestionIndex] = useState(0);
  const [gateAnswers, setGateAnswers] = useState({});
  const [gateSelection, setGateSelection] = useState(null);
  const [gateQuizComplete, setGateQuizComplete] = useState(false);
  const [gateResult, setGateResult] = useState(null);
  const [showGateReview, setShowGateReview] = useState(false);
  const [gateHistory, setGateHistory] = useState(() => readQuizHistory('python-visualizer-gate-results'));
  const timerRef = useRef(null);
  const analysisTimerRef = useRef(null);
  const conceptCompletedRef = useRef(false);
  const gateCompletedRef = useRef(false);

  const quizQuestions = analysis ? createConceptQuiz(analysis) : [];
  const quiz = quizQuestions[quizIndex];
  const comparisonSummary = comparison ? summarizeComparison(comparison) : null;
  const gateQuestion = gateSessionQuestions[gateQuestionIndex];
  const conceptProgress = calculateQuizResults(quizQuestions, quizAnswers);
  const gateProgress = calculateQuizResults(gateSessionQuestions, gateAnswers);
  const availableGateQuestions = buildGateQuiz(gateQuestions, gateSubjects, gateSubject, gateDifficulty, Number.MAX_SAFE_INTEGER).length;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!isPlaying || !traceResult.steps.length) return undefined;
    timerRef.current = setInterval(() => {
      setCurrentStep((previous) => {
        if (previous >= traceResult.steps.length - 1) {
          setIsPlaying(false);
          return previous;
        }
        return previous + 1;
      });
    }, playSpeed);
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playSpeed, traceResult.steps.length]);

  useEffect(() => {
    clearTimeout(analysisTimerRef.current);
    setQuizAnswers({});
    setQuizSelection(null);
    setQuizIndex(0);
    setConceptQuizComplete(false);
    setConceptResult(null);
    setShowConceptReview(false);
    conceptCompletedRef.current = false;
    setAnalysis(null);
    if (!API_BASE) {
      setAnalysisError('Execution API is not configured for this deployment.');
      setIsAnalyzing(false);
      return undefined;
    }
    if (!code.trim()) {
      setAnalysis(null);
      setAnalysisError('Enter Python code to analyze concepts and build its diagram.');
      setIsAnalyzing(false);
      return undefined;
    }

    const controller = new AbortController();
    analysisTimerRef.current = setTimeout(async () => {
      setIsAnalyzing(true);
      try {
        const response = await fetch(`${API_BASE}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Could not analyze this code.');
        setAnalysis(data);
        setAnalysisError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setAnalysis(null);
          setAnalysisError(getApiErrorMessage(error, 'Analysis service is unavailable.'));
        }
      } finally {
        if (!controller.signal.aborted) setIsAnalyzing(false);
      }
    }, 300);

    return () => {
      clearTimeout(analysisTimerRef.current);
      controller.abort();
    };
  }, [code]);

  useEffect(() => {
    if (!API_BASE) {
      setComparison(null);
      setComparisonError('Connect a secured API service to compare code.');
      setIsComparing(false);
      return undefined;
    }
    if (!baselineCode.trim() || !code.trim() || baselineCode === code) {
      setComparison(null);
      setComparisonError('');
      setIsComparing(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsComparing(true);
      setComparisonError('');
      try {
        const response = await fetch(`${API_BASE}/compare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ left_code: baselineCode, right_code: code, timeout_seconds: timeoutSeconds }),
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Could not compare these code versions.');
        setComparison(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setComparison(null);
          setComparisonError(getApiErrorMessage(error, 'Comparison service is unavailable.'));
        }
      } finally {
        if (!controller.signal.aborted) setIsComparing(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [baselineCode, code, timeoutSeconds]);

  useEffect(() => {
    setQuizIndex(0);
    setQuizAnswers({});
    setQuizSelection(null);
    setConceptQuizComplete(false);
    setConceptResult(null);
    setShowConceptReview(false);
    conceptCompletedRef.current = false;
  }, [analysis]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(analysisTimerRef.current);
    };
  }, []);

  const activeStep = currentStep >= 0 && traceResult.steps.length > 0 ? traceResult.steps[currentStep] : null;
  const allCurrentVariables = activeStep ? { ...activeStep.globals, ...activeStep.locals } : traceResult.final_variables;
  const variablesToDisplay = Object.fromEntries(Object.entries(allCurrentVariables || {}).filter(([name]) => !analysis?.variables || analysis.variables.includes(name)));
  const stepCountLabel = traceResult.steps.length ? `Step ${currentStep + 1} of ${traceResult.steps.length}` : 'Step 0 of 0';
  const currentLine = activeStep?.line || 0;
  const learningResources = [...new Set((analysis?.concepts || []).flatMap((concept) => resourceCatalog[concept] || []))];

  const stopPlayback = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
  };

  const handleExampleChange = (event) => {
    const key = event.target.value;
    setSelectedExample(key);
    setIsCustomCode(false);
    setAnalysisError('');
    setCode(examples[key].code);
    setBaselineCode(examples[key].code);
    setStatus('Example loaded');
    stopPlayback();
    setCurrentStep(-1);
    setTraceResult(initialTrace);
  };

  const handleCodeChange = (value) => {
    setCode(value);
    setAnalysis(null);
    setAnalysisError('');
    setIsCustomCode(value !== examples[selectedExample].code);
    setTraceResult(initialTrace);
    setCurrentStep(-1);
    setStatus('Code changed · analysis updating');
    stopPlayback();
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('python-visualizer-theme', nextTheme);
    setTheme(nextTheme);
  };

  const handleRun = async () => {
    if (!API_BASE) {
      setStatus('Execution API is not configured for this deployment.');
      setTraceResult({ ...initialTrace, error: 'Connect a secured API service to enable code execution.' });
      return;
    }
    if (!code.trim()) {
      setStatus('Enter Python code before running.');
      setTraceResult({ ...initialTrace, error: 'Code cannot be empty.' });
      return;
    }
    stopPlayback();
    setStatus('Running code…');
    try {
      const response = await fetch(`${API_BASE}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, timeout_seconds: timeoutSeconds }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Execution failed');
      }

      setTraceResult(data);
      const hasSteps = Array.isArray(data.steps) && data.steps.length > 0;
      setCurrentStep(hasSteps ? 0 : -1);
      setStatus(data.error ? 'Execution finished with an error' : 'Execution complete');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Execution service is unavailable.');
      setStatus(message);
      setTraceResult({ ...initialTrace, error: message });
      setCurrentStep(-1);
    }
  };

  const moveStep = (direction) => {
    if (!traceResult.steps.length) return;
    setCurrentStep((prev) => {
      const next = prev + direction;
      if (next < 0 || next >= traceResult.steps.length) return prev;
      return next;
    });
  };

  const handlePlay = () => {
    if (!traceResult.steps.length) return;
    setIsPlaying(true);
  };

  const handlePause = () => {
    stopPlayback();
  };

  const handleReset = () => {
    stopPlayback();
    setCurrentStep(-1);
    setTraceResult(initialTrace);
    setStatus('Ready to run');
  };

  const handleRestart = () => {
    stopPlayback();
    if (traceResult.steps.length) {
      setCurrentStep(0);
      setStatus('Execution restarted at step 1.');
    } else {
      handleRun();
    }
  };

  const handleSetBaseline = () => {
    setBaselineCode(code);
    setComparison(null);
    setComparisonError('');
  };

  const finishConceptQuiz = (answers) => {
    if (conceptCompletedRef.current) return;
    conceptCompletedRef.current = true;
    const result = calculateQuizResults(quizQuestions, answers);
    setConceptResult(result);
    setConceptQuizComplete(true);
    const historyEntry = { ...result, completedAt: new Date().toISOString() };
    const nextHistory = [historyEntry, ...conceptHistory].slice(0, 20);
    window.localStorage.setItem('python-visualizer-concept-results', JSON.stringify(nextHistory));
    setConceptHistory(nextHistory);
  };

  const advanceConceptQuiz = () => {
    if (conceptQuizComplete || !quiz) return;
    if (quizSelection !== null && !Object.hasOwn(quizAnswers, quizIndex)) {
      setQuizAnswers((answers) => submitQuizAnswer(answers, quizIndex, quizSelection));
      return;
    }
    if (quizIndex === quizQuestions.length - 1) {
      finishConceptQuiz(quizAnswers);
      return;
    }
    setQuizIndex((index) => index + 1);
    setQuizSelection(null);
  };

  const startConceptQuiz = () => {
    conceptCompletedRef.current = false;
    setQuizAnswers({});
    setQuizSelection(null);
    setQuizIndex(0);
    setConceptQuizComplete(false);
    setConceptResult(null);
    setShowConceptReview(false);
  };

  const finishGateQuiz = (answers) => {
    if (gateCompletedRef.current) return;
    gateCompletedRef.current = true;
    const result = calculateQuizResults(gateSessionQuestions, answers);
    setGateResult(result);
    setGateQuizComplete(true);
    const historyEntry = { ...result, completedAt: new Date().toISOString() };
    const nextHistory = [historyEntry, ...gateHistory].slice(0, 20);
    window.localStorage.setItem('python-visualizer-gate-results', JSON.stringify(nextHistory));
    setGateHistory(nextHistory);
  };

  const resetGateAttempt = (questions) => {
    gateCompletedRef.current = false;
    setGateSessionQuestions(questions);
    setGateQuestionIndex(0);
    setGateAnswers({});
    setGateSelection(null);
    setGateQuizComplete(false);
    setGateResult(null);
    setShowGateReview(false);
  };

  const restartGateQuiz = () => {
    resetGateAttempt(buildGateQuiz(gateQuestions, gateSubjects, gateSubject, gateDifficulty, gateQuestionCount));
  };

  const advanceGateQuiz = () => {
    if (gateQuizComplete || !gateQuestion) return;
    if (gateSelection !== null && !Object.hasOwn(gateAnswers, gateQuestionIndex)) {
      setGateAnswers((answers) => submitQuizAnswer(answers, gateQuestionIndex, gateSelection));
      return;
    }
    if (gateQuestionIndex === gateSessionQuestions.length - 1) {
      finishGateQuiz(gateAnswers);
      return;
    }
    setGateQuestionIndex((index) => index + 1);
    setGateSelection(null);
  };

  const changeGateSubject = (event) => {
    const subject = event.target.value;
    setGateSubject(subject);
    resetGateAttempt(buildGateQuiz(gateQuestions, gateSubjects, subject, gateDifficulty, gateQuestionCount));
  };

  const changeGateDifficulty = (event) => {
    const difficulty = event.target.value;
    setGateDifficulty(difficulty);
    resetGateAttempt(buildGateQuiz(gateQuestions, gateSubjects, gateSubject, difficulty, gateQuestionCount));
  };

  const changeGateQuestionCount = (event) => {
    const count = Number(event.target.value);
    setGateQuestionCount(count);
    resetGateAttempt(buildGateQuiz(gateQuestions, gateSubjects, gateSubject, gateDifficulty, count));
  };

  const retryIncorrectGateQuestions = () => {
    const incorrect = gateResult?.reviews.filter((review) => review.answered && !review.correct).map((review) => review.question) || [];
    if (incorrect.length) resetGateAttempt(incorrect);
  };

  const clearConceptHistory = () => {
    window.localStorage.removeItem('python-visualizer-concept-results');
    setConceptHistory([]);
  };

  const clearGateHistory = () => {
    window.localStorage.removeItem('python-visualizer-gate-results');
    setGateHistory([]);
  };

  const selectDiagramLine = (line) => {
    const index = traceResult.steps.findIndex((step) => step.line === line);
    if (index >= 0) setCurrentStep(index);
    else setStatus(`Diagram node maps to source line ${line}; run the code to inspect its trace.`);
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">Py</div>
          <div>
            <h1>Python Code Visualizer</h1>
            <p>Learn by watching execution flow</p>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="language-badge">Python 3</span>
          <details className="settings-menu">
            <summary>Settings</summary>
            <label>Execution timeout
              <select value={timeoutSeconds} onChange={(event) => setTimeoutSeconds(Number(event.target.value))}>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={20}>20 seconds</option>
              </select>
            </label>
          </details>
          <button className="theme-toggle" onClick={handleThemeToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      {!API_BASE && (
        <div className="policy-warning deployment-warning">
          Frontend-only deployment: code analysis, execution, and comparison need a separately secured API. No code is sent to a visitor's computer.
        </div>
      )}

      <main className="layout">
        <section className="editor-panel panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="dot dot-purple" />
              <strong>Code editor</strong>
            </div>
            <select value={isCustomCode ? 'custom' : selectedExample} onChange={handleExampleChange}>
              {isCustomCode && <option value="custom" disabled>Custom code</option>}
              {Object.entries(examples).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          {!isCustomCode && <div className="example-description">
            <strong>{examples[selectedExample].label}</strong>
            <span>{examples[selectedExample].description}</span>
          </div>}

          <Suspense fallback={<div className="editor-loading">Loading Python editor…</div>}>
            <CodeEditor code={code} onChange={handleCodeChange} theme={theme} activeLine={currentLine} />
          </Suspense>

          <div className="analysis-status" aria-live="polite">
            <span className={isAnalyzing ? 'status-pulse' : ''}>{isAnalyzing ? 'Analyzing code…' : analysisError || (analysis ? `${analysis.concepts.length} concepts detected` : 'Waiting for analysis…')}</span>
            {analysis?.concepts?.map((concept) => <span className="concept-chip" key={concept}>{concept}</span>)}
          </div>
          {analysis?.unsupported_constructs?.map((warning) => <div className="policy-warning" key={warning}>{warning} Static analysis is available; execution remains restricted.</div>)}

          <div className="toolbar">
            <button className="primary" onClick={handleRun}>Run &amp; Visualize</button>
            <button className="secondary" onClick={handleReset}>Reset</button>
            <span className="status-pill">{status}</span>
          </div>

          <div className="step-toolbar">
            <button onClick={() => moveStep(-1)} disabled={currentStep <= 0 || !traceResult.steps.length}>Previous</button>
            <button onClick={() => moveStep(1)} disabled={currentStep >= traceResult.steps.length - 1 || !traceResult.steps.length}>Next</button>
            <button onClick={handlePlay} disabled={!traceResult.steps.length || isPlaying}>Play</button>
            <button onClick={handlePause} disabled={!isPlaying}>Pause</button>
            <button onClick={handleRestart}>{traceResult.steps.length ? 'Restart trace' : 'Run from start'}</button>
            <label className="speed-control">Speed
              <select value={playSpeed} onChange={(event) => setPlaySpeed(Number(event.target.value))}>
                <option value={1200}>0.5×</option>
                <option value={600}>1×</option>
                <option value={300}>2×</option>
                <option value={120}>5×</option>
              </select>
            </label>
          </div>

          <div className="status-line">
            <span>{stepCountLabel}</span>
            <span>{currentLine ? `Current line ${currentLine}` : 'No active line'}</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: traceResult.steps.length ? `${((currentStep + 1) / traceResult.steps.length) * 100}%` : '0%' }}
              />
            </div>
          </div>

          <div className="explanation-box">
            <h3>Execution explanation</h3>
            <p>
              {activeStep ? activeStep.explanation : 'Press Run & Visualize to trace how the code is executed step by step.'}
            </p>
            {activeStep?.event_type === 'return' && <div className="return-value">Return value <code>{renderValue(activeStep.return_value)}</code></div>}
          </div>
        </section>

        <aside className="side-panel">
          <div className="panel diagram-panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <span className="dot dot-green" />
                <strong>Variable inspector</strong>
              </div>
            </div>

            <div className="variable-list">
              {Object.keys(variablesToDisplay || {}).length ? (
                Object.entries(variablesToDisplay).map(([key, value]) => (
                  <div key={key} className={`variable-item ${activeStep?.changed_variables?.some((item) => item.name === key) ? 'variable-changed' : ''}`}>
                    <span className="variable-key">{key}</span>
                    <span className="variable-value">{renderValue(value)}</span>
                    <span className="variable-type">{activeStep?.variable_types?.[key] || (value === null ? 'NoneType' : Array.isArray(value) ? 'list' : typeof value === 'object' ? 'dict' : typeof value)}</span>
                    {activeStep?.changed_variables?.some((item) => item.name === key) && (
                      <small className="change-note">Changed after line {activeStep.previous_line ?? activeStep.line} · {renderValue(activeStep.changed_variables.find((item) => item.name === key).before)} → {renderValue(value)}</small>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No variables in the current step.</div>
              )}
            </div>
            <div className="memory-map">
              {Object.entries(variablesToDisplay || {}).flatMap(([name, value]) => {
                if (Array.isArray(value)) {
                  return [(
                    <div className="memory-collection" key={`${name}-list`}>
                      <strong>{name} <span>list memory</span></strong>
                      <div className="memory-cells">
                        {value.map((item, index) => <div className="memory-cell" key={`${name}-${index}`}><small>[{index}]</small><code>{renderValue(item)}</code></div>)}
                      </div>
                    </div>
                  )];
                }
                if ((activeStep?.variable_types?.[name] === 'dict' || value && typeof value === 'object' && !Array.isArray(value)) && value && typeof value === 'object') {
                  return [(
                    <div className="memory-collection" key={`${name}-dict`}>
                      <strong>{name} <span>dictionary memory</span></strong>
                      <div className="memory-cells">
                        {Object.entries(value).map(([key, item]) => <div className="memory-cell" key={`${name}-${key}`}><small>{key}</small><code>{renderValue(item)}</code></div>)}
                      </div>
                    </div>
                  )];
                }
                return [];
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <span className="dot dot-blue" />
                <strong>Program output</strong>
              </div>
            </div>
            <pre className="console-output">{traceResult.output || 'No output yet.'}</pre>
            {traceResult.error && <div className="error-panel"><strong>Execution error</strong><span>{traceResult.error}</span></div>}
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title-group">
                <span className="dot dot-orange" />
                <strong>Call stack</strong>
              </div>
            </div>
            <div className="stack-list">
              {activeStep && activeStep.stack ? (
                activeStep.stack.map((frame, index) => (
                  <div key={`${frame}-${index}`} className="stack-frame">{frame}</div>
                ))
              ) : (
                <div className="empty-state">Global scope</div>
              )}
            </div>
          </div>
        </aside>
      </main>

      <section className="learning-grid">
        <div className="panel visual-diagram-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Live AST map</span>
              <h2>Visual diagram</h2>
            </div>
            <span className="chip">{currentLine ? `Line ${currentLine} active` : 'Waiting for trace'}</span>
          </div>
          {analysisError ? (
            <div className="empty-state error-copy">{analysisError}</div>
          ) : analysis?.diagram?.length ? (
            <div className="diagram-flow">
              {renderDiagramNodes(analysis.diagram, currentLine, selectDiagramLine)}
            </div>
          ) : (
            <div className="empty-state">Enter valid Python code to build its control-flow diagram.</div>
          )}
        </div>

        <div className="panel real-world-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">AST-matched context</span>
              <h2>Real-world application</h2>
            </div>
          </div>
          {analysis?.real_world_examples?.length ? (
            <div className="scenario-list">
              {analysis.real_world_examples.map((scenario) => (
                <article className="scenario-item" key={scenario.concept}>
                  <div className="scenario-title-row">
                    <h3>{scenario.title}</h3>
                    <span className="concept-chip">{scenario.concept}</span>
                  </div>
                  <p>{scenario.mapping}</p>
                  <dl className="scenario-details">
                    <div><dt>Code variables</dt><dd>{scenario.variables.length ? scenario.variables.join(', ') : 'None detected'}</dd></div>
                    <div><dt>Input / state</dt><dd>{scenario.variables.map((name) => `${name}${Object.hasOwn(variablesToDisplay, name) ? ` = ${renderValue(variablesToDisplay[name])}` : ''}`).join(' · ') || 'Run code to inspect its actual state.'}</dd></div>
                    <div><dt>Execution</dt><dd>Follow the active line; the trace records actual assignments, branches, and calls.</dd></div>
                    <div><dt>Actual output</dt><dd>{traceResult.output ? traceResult.output.trim() : 'Run this code to see its real output.'}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">A scenario appears when the analyzer detects a supported Python concept.</div>
          )}
        </div>

        <div className="panel resources-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Based on detected concepts</span>
              <h2>Learn more</h2>
            </div>
          </div>
          {learningResources.length ? (
            <div className="resource-list">
              {learningResources.map((resource) => (
                <a className="resource-link" href={resource.url} target="_blank" rel="noreferrer" key={`${resource.title}-${resource.url}`}>
                  <span><strong>{resource.title}</strong><small>{resource.reason}</small></span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="empty-state">Edit code to receive topic-specific links. General tutorials: <a href="https://www.w3schools.com/python/" target="_blank" rel="noreferrer">W3Schools Python</a> · <a href="https://www.geeksforgeeks.org/python/python-programming-language-tutorial/" target="_blank" rel="noreferrer">GeeksforGeeks Python</a>.</div>
          )}
        </div>

        <div className="panel adaptive-quiz-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Changes with analyzed code</span>
              <h2>Concept Analysis Quiz</h2>
            </div>
            <span className="chip">
              {conceptQuizComplete
                ? `${conceptResult.correct}/${conceptResult.total} correct`
                : `${conceptProgress.correct}/${quizQuestions.length} correct · ${conceptProgress.attempted} answered`}
            </span>
          </div>
          {conceptQuizComplete && conceptResult ? (
            <QuizResults
              title="Concept Analysis Quiz"
              result={conceptResult}
              showReview={showConceptReview}
              onToggleReview={() => setShowConceptReview((visible) => !visible)}
              onRetake={startConceptQuiz}
              history={conceptHistory}
              onClearHistory={clearConceptHistory}
            />
          ) : quiz ? (
            <>
              <div className="quiz-meta">
                <span>{quiz.topic}</span>
                <span>Question {quizIndex + 1} of {quizQuestions.length}</span>
                <span>Original practice</span>
              </div>
              <p className="quiz-question">{quiz.prompt}</p>
              <QuizAnswerOptions
                question={quiz}
                selection={quizSelection}
                onSelect={setQuizSelection}
                disabled={Object.hasOwn(quizAnswers, quizIndex)}
              />
              {Object.hasOwn(quizAnswers, quizIndex) && (
                <div className={`quiz-feedback ${isQuizAnswerCorrect(quiz, quizAnswers[quizIndex]) ? 'success' : 'error'}`}>
                  {isQuizAnswerCorrect(quiz, quizAnswers[quizIndex]) ? 'Correct. ' : 'Not quite. '}{quiz.explanation}
                </div>
              )}
              <div className="quiz-navigation">
                <span>Score so far: {conceptProgress.correct}/{conceptProgress.attempted} answered</span>
                <button className="primary" onClick={advanceConceptQuiz}>
                  {Object.hasOwn(quizAnswers, quizIndex)
                    ? quizIndex === quizQuestions.length - 1 ? 'Finish quiz' : 'Next question'
                    : quizSelection !== null ? 'Submit answer' : quizIndex === quizQuestions.length - 1 ? 'Finish quiz' : 'Skip question'}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">{analysisError || (isAnalyzing ? 'Analyzing code to generate a fresh question set…' : 'Analyze valid Python code to generate 5–10 relevant questions.')}</div>
          )}
        </div>
      </section>

      <section className="panel gate-panel">
        <div className="panel-header gate-header">
          <div>
            <span className="section-kicker">Independent subject practice</span>
            <h2>GATE CS preparation</h2>
            <p>Concept-tagged practice across the GATE CS syllabus. In-app questions are original practice; use the official archive for verified past papers and keys.</p>
            <p className="marking-scheme">Scoring: 1 point per correct answer; no negative marking. Timing is not enabled.</p>
            <a className="official-source-link" href="https://gate2024.iisc.ac.in/question-papers/" target="_blank" rel="noreferrer">
              Official GATE 2024 master question papers and answer keys ↗
            </a>
          </div>
          <div className="gate-score">
            <strong>{gateQuizComplete ? `${gateResult.correct}/${gateResult.total}` : `${gateProgress.correct}/${gateSessionQuestions.length}`}</strong>
            <span>{gateQuizComplete ? 'latest quiz score' : `${gateProgress.attempted} answered · current score`}</span>
          </div>
        </div>
        <div className="gate-controls">
          <label>Subject<select value={gateSubject} onChange={changeGateSubject}><option>All GATE CS subjects</option>{gateSubjects.map((subject) => <option key={subject}>{subject}</option>)}</select></label>
          <label>Difficulty<select value={gateDifficulty} onChange={changeGateDifficulty}><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
          <label>Question count<select value={gateQuestionCount} onChange={changeGateQuestionCount}><option value={5}>5 questions</option><option value={10}>10 questions</option><option value={15}>15 questions</option></select></label>
        </div>
        {availableGateQuestions < gateQuestionCount && (
          <p className="filter-question-note">Only {availableGateQuestions} questions match these filters; the quiz score uses the available questions.</p>
        )}
        {gateQuizComplete && gateResult ? (
          <QuizResults
            title="GATE CS Quiz"
            result={gateResult}
            showReview={showGateReview}
            onToggleReview={() => setShowGateReview((visible) => !visible)}
            onRetake={restartGateQuiz}
            onRetryIncorrect={retryIncorrectGateQuestions}
            history={gateHistory}
            onClearHistory={clearGateHistory}
          />
        ) : gateQuestion ? (
          <div className="gate-question-block">
            <div className="syllabus-coverage"><strong>Syllabus coverage</strong><span>{gateQuestion.syllabus}</span></div>
            <div className="quiz-meta"><span>{gateQuestion.subject}</span><span>{gateQuestion.kind}</span><span>{gateQuestion.difficulty}</span><span>{gateQuestion.source}</span><span>Question {gateQuestionIndex + 1} of {gateSessionQuestions.length}</span></div>
            <p className="quiz-question">{gateQuestion.question}</p>
            <QuizAnswerOptions
              question={gateQuestion}
              selection={gateSelection}
              onSelect={setGateSelection}
              disabled={Object.hasOwn(gateAnswers, gateQuestionIndex)}
            />
            {Object.hasOwn(gateAnswers, gateQuestionIndex) && (
              <div className={`quiz-feedback ${isQuizAnswerCorrect(gateQuestion, gateAnswers[gateQuestionIndex]) ? 'success' : 'error'}`}>
                {isQuizAnswerCorrect(gateQuestion, gateAnswers[gateQuestionIndex]) ? 'Correct. ' : 'Not quite. '}{gateQuestion.explanation}
              </div>
            )}
            <div className="quiz-navigation">
              <span>Score so far: {gateProgress.correct}/{gateProgress.attempted} answered</span>
              <button className="primary" onClick={advanceGateQuiz}>
                {Object.hasOwn(gateAnswers, gateQuestionIndex)
                  ? gateQuestionIndex === gateSessionQuestions.length - 1 ? 'Finish quiz' : 'Next question'
                  : gateSelection !== null ? 'Submit answer' : gateQuestionIndex === gateSessionQuestions.length - 1 ? 'Finish quiz' : 'Skip question'}
              </button>
            </div>
          </div>
        ) : <div className="empty-state">No questions match the selected filters. Choose another difficulty or subject.</div>}
      </section>

      <section className="bottom-row">
        <div className="panel compare-panel">
          <div className="panel-header">
            <div>
              <span className="section-kicker">Auto-updates as you edit</span>
              <h2>What-if simulation</h2>
            </div>
            <span className="chip">{isComparing ? 'Comparing…' : baselineCode === code ? 'Baseline unchanged' : 'Live comparison'}</span>
          </div>

          <div className="compare-grid">
            <div className="what-if-version">
              <strong>Baseline</strong>
              <pre className="what-if-code">{baselineCode || 'No baseline code.'}</pre>
            </div>
            <div className="what-if-version">
              <strong>Current editor code</strong>
              <pre className="what-if-code">{code || 'No Python code.'}</pre>
            </div>
          </div>

          <div className="what-if-actions">
            <span>Edits are compared automatically against the selected example or saved baseline.</span>
            <button className="secondary" onClick={handleSetBaseline} disabled={!code.trim() || baselineCode === code}>Use current code as baseline</button>
          </div>
          {comparisonError && <div className="error-panel"><strong>Comparison unavailable</strong><span>{comparisonError}</span></div>}
          {comparisonSummary && (
            <div className="what-if-results" aria-live="polite">
              <div className="what-if-result-card">
                <strong>Program output</strong>
                <div className="what-if-output-grid">
                  <pre><b>Baseline</b>{'\n'}{comparisonSummary.leftError || comparisonSummary.leftOutput || '(no output)'}</pre>
                  <pre><b>Edited</b>{'\n'}{comparisonSummary.rightError || comparisonSummary.rightOutput || '(no output)'}</pre>
                </div>
                <span>{comparisonSummary.outputsMatch ? 'Output is unchanged.' : 'Output changed.'}</span>
              </div>
              <div className="what-if-result-card">
                <strong>Execution behavior</strong>
                <span>{comparisonSummary.leftSteps} baseline steps · {comparisonSummary.rightSteps} edited steps</span>
                <span>{comparisonSummary.variablesMatch ? 'Final variables are unchanged.' : `Changed variables: ${comparisonSummary.changedVariables.join(', ') || 'final state differs'}.`}</span>
              </div>
            </div>
          )}
          {!comparisonError && !comparisonSummary && !isComparing && baselineCode === code && (
            <div className="empty-state">Change the code in the editor to compare its output, final variables, and trace length with this baseline.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
