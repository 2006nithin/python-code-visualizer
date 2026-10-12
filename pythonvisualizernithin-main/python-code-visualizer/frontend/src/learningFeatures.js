const conceptQuestions = {
  variables: [
    { topic: 'Variables', prompt: 'What does assigning a value to a Python variable do?', options: ['Binds a name to an object', 'Creates a new data type', 'Prints the value', 'Freezes the value'], answer: 'Binds a name to an object', explanation: 'Assignment binds a name to a value; it does not print or freeze that value.' },
    { topic: 'Variables', prompt: 'After `total = total + amount`, what happens to the name `total`?', options: ['It is rebound to the sum', 'It becomes a function', 'It is deleted', 'It is automatically printed'], answer: 'It is rebound to the sum', explanation: 'Python evaluates the right-hand expression, then binds the name to the resulting value.' },
  ],
  'data-types': [
    { topic: 'Data types', prompt: 'Which built-in type represents a whole-number value such as 8?', options: ['int', 'str', 'list', 'dict'], answer: 'int', explanation: 'Whole numbers in Python use the int type.' },
    { topic: 'Data types', prompt: 'What type does a quoted value such as `"ready"` have?', options: ['str', 'bool', 'int', 'tuple'], answer: 'str', explanation: 'Text enclosed in quotes is represented by the str type.' },
  ],
  conditions: [
    { topic: 'Conditions', prompt: 'When does the body of an if statement run?', options: ['When its condition is true', 'Whenever a variable is assigned', 'Only after a loop', 'When its condition is false'], answer: 'When its condition is true', explanation: 'An if body runs when evaluating its condition produces a truthy result.' },
    { topic: 'Conditions', prompt: 'In an if/else statement, when does the else branch run?', options: ['When the if condition is false', 'Before the if condition', 'On every loop iteration', 'Only when a function returns'], answer: 'When the if condition is false', explanation: 'The else branch is selected when the associated if condition is false.' },
  ],
  loops: [
    { topic: 'Loops', prompt: 'A for loop iterates over a list of four items once. How many times does its body run?', options: ['4', '3', '1', 'It never runs'], answer: '4', explanation: 'A for loop visits each item in its iterable once.' },
    { topic: 'Loops', prompt: 'What controls whether a while loop continues?', options: ['Its condition', 'The number of functions in the file', 'The last printed value', 'The variable type'], answer: 'Its condition', explanation: 'A while loop checks its condition before each iteration and stops when it is false.' },
  ],
  functions: [
    { topic: 'Functions', prompt: 'What does return do inside a function?', options: ['Sends a value back and ends that call', 'Prints every local variable', 'Starts a loop', 'Defines a parameter'], answer: 'Sends a value back and ends that call', explanation: 'return ends the current function call and provides its result to the caller.' },
    { topic: 'Functions', prompt: 'Where is a function parameter first available?', options: ['Inside the function call', 'Only in the module importer', 'Only after printing', 'In every Python process'], answer: 'Inside the function call', explanation: 'A parameter is a local name bound when the function is called.' },
  ],
  recursion: [
    { topic: 'Recursion', prompt: 'What prevents a recursive function from calling itself forever?', options: ['A base case', 'A print statement', 'A global variable', 'A list index'], answer: 'A base case', explanation: 'A base case stops making recursive calls and lets earlier calls return.' },
    { topic: 'Recursion', prompt: 'What happens after a recursive call reaches its base case?', options: ['Calls return in reverse order', 'The program restarts', 'All local variables become global', 'The base case repeats forever'], answer: 'Calls return in reverse order', explanation: 'Each pending call resumes as the deeper call returns, unwinding the call stack.' },
  ],
  lists: [
    { topic: 'Lists', prompt: 'What is the index of the first element in a Python list?', options: ['0', '1', '-1', 'It depends on the list'], answer: '0', explanation: 'Python sequences use zero-based indexing.' },
    { topic: 'Lists', prompt: 'What does `items.append(value)` do?', options: ['Adds value to the end of the list', 'Sorts the list', 'Removes the first item', 'Returns a copy without value'], answer: 'Adds value to the end of the list', explanation: 'append mutates the list by adding one item at its end.' },
  ],
  dictionaries: [
    { topic: 'Dictionaries', prompt: 'How does Python retrieve a value from a dictionary?', options: ['By its key', 'By its insertion line number', 'By sorting all values', 'By list index only'], answer: 'By its key', explanation: 'A dictionary maps keys to values and uses a key for lookup.' },
    { topic: 'Dictionaries', prompt: 'What happens when an existing dictionary key is assigned a new value?', options: ['The value for that key is updated', 'A duplicate key is created', 'The whole dictionary is sorted', 'The key is converted to a list'], answer: 'The value for that key is updated', explanation: 'Dictionary keys are unique; assigning an existing key replaces its associated value.' },
  ],
  tuples: [
    { topic: 'Tuples', prompt: 'Which property distinguishes a tuple from a list?', options: ['A tuple is immutable', 'A tuple stores only numbers', 'A tuple is always sorted', 'A tuple uses string keys'], answer: 'A tuple is immutable', explanation: 'A tuple is an ordered collection that cannot be reassigned item by item.' },
    { topic: 'Tuples', prompt: 'How do you access an item in a tuple?', options: ['With its zero-based index', 'Only with a dictionary key', 'By calling append', 'By sorting the tuple first'], answer: 'With its zero-based index', explanation: 'Tuples are ordered sequences and support zero-based indexing.' },
  ],
  sets: [
    { topic: 'Sets', prompt: 'What is a key property of a Python set?', options: ['It stores unique elements', 'It preserves duplicate entries', 'It maps keys to values', 'It is always indexable'], answer: 'It stores unique elements', explanation: 'A set contains distinct hashable elements and does not provide positional indexing.' },
    { topic: 'Sets', prompt: 'Which operation finds elements present in either of two sets?', options: ['Union', 'Intersection', 'Indexing', 'Append'], answer: 'Union', explanation: 'The union contains elements from either input set.' },
  ],
  sorting: [
    { topic: 'Sorting', prompt: 'What is the main result of sorting a collection?', options: ['Items are arranged by an ordering rule', 'Every item is removed', 'The collection is always deduplicated', 'Execution is reversed'], answer: 'Items are arranged by an ordering rule', explanation: 'Sorting orders items; it does not inherently remove duplicates.' },
    { topic: 'Sorting', prompt: 'What does Python’s `sorted(values)` return?', options: ['A new sorted list', 'The original collection only', 'The number of items', 'A set of unique values'], answer: 'A new sorted list', explanation: 'sorted returns a new list in sorted order and leaves the input iterable unchanged.' },
  ],
  searching: [
    { topic: 'Searching', prompt: 'What precondition does binary search require for a list?', options: ['The list is sorted', 'Every element is unique', 'The list has even length', 'The list contains strings'], answer: 'The list is sorted', explanation: 'Binary search relies on ordering to discard half of the remaining search interval.' },
    { topic: 'Searching', prompt: 'What is the worst-case time complexity of checking each item in a list in order?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 'O(n)', explanation: 'A linear scan may inspect every one of the n items.' },
  ],
  exceptions: [
    { topic: 'Exceptions', prompt: 'What is the purpose of an except block?', options: ['Handle a matching exception', 'Repeat a function call', 'Create a class', 'Sort a collection'], answer: 'Handle a matching exception', explanation: 'An except block handles an exception raised in its associated try block.' },
    { topic: 'Exceptions', prompt: 'Which block runs when the associated try block completes without an exception?', options: ['else', 'except', 'raise', 'while'], answer: 'else', explanation: 'A try/else else block runs only when the try suite completes without an exception.' },
  ],
  oop: [
    { topic: 'Object-oriented programming', prompt: 'What does a class primarily define?', options: ['A blueprint for objects and their behavior', 'A loop condition', 'A sorted list', 'A module import permission'], answer: 'A blueprint for objects and their behavior', explanation: 'A class describes the data and methods that its instances can have.' },
    { topic: 'Object-oriented programming', prompt: 'What is an instance of a class?', options: ['An object created from that class', 'A Python syntax error', 'A loop iteration', 'A dictionary key'], answer: 'An object created from that class', explanation: 'Calling a class typically creates an instance, or object, of that class.' },
  ],
  generators: [
    { topic: 'Generators', prompt: 'What does yield do in a generator function?', options: ['Produces a value and suspends the function', 'Deletes the generator', 'Sorts all yielded values', 'Returns a list immediately'], answer: 'Produces a value and suspends the function', explanation: 'yield produces the next value while preserving generator state for later iteration.' },
    { topic: 'Generators', prompt: 'When does a generator expression usually produce its values?', options: ['As it is iterated', 'All at definition time', 'Only after sorting', 'When imported'], answer: 'As it is iterated', explanation: 'Generator expressions evaluate lazily as the iterator requests each value.' },
  ],
  'file-handling': [
    { topic: 'File handling', prompt: 'Why is a `with` statement commonly used when working with a file?', options: ['It ensures the file is closed when the block exits', 'It sorts file contents', 'It disables exceptions', 'It converts the file to a list'], answer: 'It ensures the file is closed when the block exits', explanation: 'A context manager handles cleanup, including closing the file when control leaves the block.' },
    { topic: 'File handling', prompt: 'What does opening a file in read mode allow?', options: ['Reading its contents', 'Deleting its parent folder', 'Executing its contents automatically', 'Sorting its bytes'], answer: 'Reading its contents', explanation: 'Read mode opens a file for retrieving data; it does not execute the data.' },
  ],
};

const generalQuestions = [
  { topic: 'Python fundamentals', prompt: 'Which built-in function displays text in the program output?', options: ['print()', 'type()', 'range()', 'len()'], answer: 'print()', explanation: 'print writes its arguments to standard output.' },
  { topic: 'Python fundamentals', prompt: 'What does `len(sequence)` return?', options: ['The number of items', 'The last item', 'The data type', 'The memory address'], answer: 'The number of items', explanation: 'len returns the number of items in a sequence or collection.' },
  { topic: 'Python fundamentals', prompt: 'Which keyword starts a function definition in Python?', options: ['def', 'class', 'yield', 'return'], answer: 'def', explanation: 'A function definition starts with the def keyword.' },
  { topic: 'Python fundamentals', prompt: 'Which value represents the Boolean result of a true condition?', options: ['True', '1.0', '"True"', 'None'], answer: 'True', explanation: 'Python represents a true Boolean value with the bool singleton True.' },
  { topic: 'Python fundamentals', prompt: 'What does `range(3)` produce when iterated?', options: ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3', '3, 2, 1'], answer: '0, 1, 2', explanation: 'range(3) starts at zero and stops before three.' },
];

export function createConceptQuiz(analysis) {
  const concepts = [...new Set(analysis?.concepts || [])].filter((concept) => conceptQuestions[concept]);
  const targetCount = Math.min(10, Math.max(5, concepts.length * 2));
  const questions = [];
  const seenPrompts = new Set();
  const knownLoop = analysis?.loop_details?.find((loop) => Number.isInteger(loop.iteration_count));

  if (knownLoop) {
    const count = knownLoop.iteration_count;
    const options = [...new Set([count, count + 1, Math.max(0, count - 1), count + 2])].slice(0, 4);
    while (options.length < 4) options.push(count + options.length + 1);
    questions.push({
      topic: 'Loop tracing',
      prompt: `How many iterations does ${knownLoop.header} execute?`,
      options: options.map(String),
      answer: String(count),
      explanation: `The statically known iterable causes the loop to run ${count} time${count === 1 ? '' : 's'}.`,
    });
    seenPrompts.add(questions[0].prompt);
  }

  for (let round = 0; round < 2; round += 1) {
    for (const concept of concepts) {
      const question = conceptQuestions[concept][round];
      if (question && !seenPrompts.has(question.prompt) && questions.length < targetCount) {
        questions.push(question);
        seenPrompts.add(question.prompt);
      }
    }
  }

  let generalIndex = 0;
  while (questions.length < targetCount) {
    const question = generalQuestions[generalIndex % generalQuestions.length];
    generalIndex += 1;
    if (!seenPrompts.has(question.prompt)) {
      questions.push(question);
      seenPrompts.add(question.prompt);
    }
  }

  return questions;
}

export function summarizeComparison(comparison) {
  const left = comparison?.left?.final_variables || {};
  const right = comparison?.right?.final_variables || {};
  const changedVariables = [...new Set([...Object.keys(left), ...Object.keys(right)])]
    .filter((name) => JSON.stringify(left[name]) !== JSON.stringify(right[name]));

  return {
    outputsMatch: comparison?.summary?.equal_output === true,
    variablesMatch: comparison?.summary?.equal_final_variables === true,
    leftOutput: comparison?.left?.output || '',
    rightOutput: comparison?.right?.output || '',
    leftError: comparison?.left?.error || '',
    rightError: comparison?.right?.error || '',
    leftSteps: comparison?.summary?.left_steps ?? 0,
    rightSteps: comparison?.summary?.right_steps ?? 0,
    changedVariables,
  };
}
