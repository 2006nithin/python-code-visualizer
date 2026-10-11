import test from 'node:test';
import assert from 'node:assert/strict';

import { createConceptQuiz, summarizeComparison } from '../src/learningFeatures.js';

test('concept practice creates at least five unique questions for a small concept set', () => {
  const questions = createConceptQuiz({ concepts: ['variables'] });

  assert.equal(questions.length, 5);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, questions.length);
  assert.ok(questions.slice(0, 2).every((question) => question.topic === 'Variables'));
  assert.ok(questions.every((question) => question.options.includes(question.answer)));
});

test('concept practice caps a broad set at ten unique questions', () => {
  const concepts = [
    'variables', 'data-types', 'conditions', 'loops', 'functions', 'recursion',
    'lists', 'dictionaries', 'tuples', 'sets', 'sorting', 'searching',
  ];
  const questions = createConceptQuiz({ concepts });

  assert.equal(questions.length, 10);
  assert.equal(new Set(questions.map((question) => question.prompt)).size, questions.length);
});

test('concept practice includes a question using the analyzed loop details', () => {
  const questions = createConceptQuiz({
    concepts: ['loops'],
    loop_details: [{ iteration_count: 3, header: 'for value in [1, 2, 3]' }],
  });

  assert.equal(questions.length, 5);
  assert.equal(questions[0].answer, '3');
  assert.match(questions[0].prompt, /for value in/);
});

test('comparison summary identifies changed final variables and trace outcomes', () => {
  const summary = summarizeComparison({
    left: { output: '10\n', error: null, final_variables: { total: 10, tax: 1 } },
    right: { output: '11\n', error: null, final_variables: { total: 11, discount: 2 } },
    summary: { equal_output: false, equal_final_variables: false, left_steps: 4, right_steps: 5 },
  });

  assert.deepEqual(summary.changedVariables, ['total', 'tax', 'discount']);
  assert.equal(summary.outputsMatch, false);
  assert.equal(summary.leftSteps, 4);
  assert.equal(summary.rightSteps, 5);
});
