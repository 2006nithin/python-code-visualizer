export const resourceCatalog = {
  variables: [
    { title: 'Python Variables', url: 'https://www.w3schools.com/python/python_variables.asp', reason: 'Review how names store and refer to values.' },
    { title: 'Python Reference', url: 'https://www.w3schools.com/python/python_reference.asp', reason: 'Look up Python built-ins and syntax.' },
  ],
  'data-types': [
    { title: 'Python Data Types', url: 'https://www.w3schools.com/python/python_datatypes.asp', reason: 'Identify the types represented by values in your code.' },
  ],
  conditions: [
    { title: 'Python If...Else', url: 'https://www.w3schools.com/python/python_conditions.asp', reason: 'Understand how a condition selects an execution branch.' },
  ],
  loops: [
    { title: 'Python For Loops', url: 'https://www.w3schools.com/python/python_for_loops.asp', reason: 'Study iteration and how loop variables change.' },
    { title: 'Python While Loops', url: 'https://www.w3schools.com/python/python_while_loops.asp', reason: 'Review condition-controlled repetition.' },
  ],
  functions: [
    { title: 'Python Functions', url: 'https://www.w3schools.com/python/python_functions.asp', reason: 'Review parameters, calls, local variables, and return values.' },
  ],
  recursion: [
    { title: 'Python Functions and Recursion', url: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/', reason: 'Use the function tutorial to review recursive calls and base cases.' },
  ],
  lists: [
    { title: 'Python Lists', url: 'https://www.w3schools.com/python/python_lists.asp', reason: 'Review indexed collections and list operations.' },
    { title: 'Python Data Structures', url: 'https://www.geeksforgeeks.org/python/python-data-structures/', reason: 'Compare common Python collection types.' },
  ],
  dictionaries: [
    { title: 'Python Dictionaries', url: 'https://www.w3schools.com/python/python_dictionaries.asp', reason: 'Review key-value lookup and dictionary updates.' },
    { title: 'Python Data Structures', url: 'https://www.geeksforgeeks.org/python/python-data-structures/', reason: 'Explore how dictionaries fit among Python data structures.' },
  ],
  tuples: [
    { title: 'Python Tuples', url: 'https://www.w3schools.com/python/python_tuples.asp', reason: 'Review immutable ordered collections.' },
  ],
  sets: [
    { title: 'Python Sets', url: 'https://www.w3schools.com/python/python_sets.asp', reason: 'Review unique values and set operations.' },
  ],
  sorting: [
    { title: 'Python List Sorting', url: 'https://www.w3schools.com/python/python_lists_sort.asp', reason: 'Review sorting behavior and sort keys.' },
    { title: 'Algorithms and Data Structures', url: 'https://www.geeksforgeeks.org/dsa/', reason: 'Connect sorting code to algorithm analysis.' },
  ],
  searching: [
    { title: 'Algorithms and Data Structures', url: 'https://www.geeksforgeeks.org/dsa/', reason: 'Explore search strategies and their time costs.' },
  ],
  exceptions: [
    { title: 'Python Exceptions', url: 'https://www.w3schools.com/python/python_try_except.asp', reason: 'Review how exceptions are caught and handled.' },
  ],
  oop: [
    { title: 'Python Classes and Objects', url: 'https://www.w3schools.com/python/python_classes.asp', reason: 'Review how classes define object data and behavior.' },
  ],
  'file-handling': [
    { title: 'Python File Handling', url: 'https://www.w3schools.com/python/python_file_handling.asp', reason: 'Review file operations; this visualizer blocks filesystem access during execution.' },
  ],
  generators: [
    { title: 'Python Functions and Iterators', url: 'https://www.geeksforgeeks.org/python/python-programming-language-tutorial/', reason: 'Review lazy value production and iteration.' },
  ],
};

export const gateSubjects = [
  'Programming and Data Structures',
  'Algorithms',
  'Discrete Mathematics',
  'Digital Logic',
  'Computer Organization and Architecture',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Theory of Computation',
  'Compiler Design',
  'Engineering Mathematics and General Aptitude',
];

export const gateQuestions = {
  'Programming and Data Structures': [
    { difficulty: 'Easy', kind: 'Output tracing', question: 'In a stack initially empty, perform push(4), push(7), pop(). What is the top element?', options: ['4', '7', 'Empty', 'Undefined'], answer: '4', explanation: 'The pop removes 7, leaving 4 at the top.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'A singly linked list has n nodes. What is the time complexity of accessing its k-th node from the head?', options: ['O(1)', 'O(log n)', 'O(k)', 'O(n log n)'], answer: 'O(k)', explanation: 'Following next pointers requires traversing k links in the worst case.' },
    { difficulty: 'Hard', kind: 'Output tracing', question: 'A circular queue has capacity 5 and initially front=0, rear=-1. After enqueue(A), enqueue(B), dequeue(), enqueue(C), what is at the front?', options: ['A', 'B', 'C', 'Queue is empty'], answer: 'B', explanation: 'The first dequeue removes A. Enqueueing C adds to the rear; B remains at the front.' },
    { difficulty: 'Easy', kind: 'Concept', question: 'Which data structure is most directly used to manage nested function calls?', options: ['Stack', 'Queue', 'Heap', 'Hash table'], answer: 'Stack', explanation: 'A call stack stores active function frames in last-in, first-out order.' },
    { difficulty: 'Medium', kind: 'Binary trees', question: 'In a binary search tree with distinct keys, which traversal visits keys in increasing order?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], answer: 'Inorder', explanation: 'Inorder traversal visits the left subtree, node, and right subtree; the BST ordering yields sorted keys.' },
  ],
  Algorithms: [
    { difficulty: 'Easy', kind: 'Complexity', question: 'A loop visits each of n elements once and performs constant work. What is its time complexity?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 'O(n)', explanation: 'The constant operation is repeated n times.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'What is the worst-case time complexity of binary search on a sorted array?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 'O(log n)', explanation: 'Each comparison halves the remaining search interval.' },
    { difficulty: 'Hard', kind: 'Recurrence', question: 'For T(n) = 2T(n/2) + n with T(1)=1, what is the asymptotic complexity?', options: ['Theta(n)', 'Theta(n log n)', 'Theta(n^2)', 'Theta(log n)'], answer: 'Theta(n log n)', explanation: 'At each of log n levels the combined non-recursive work is Theta(n).' },
    { difficulty: 'Medium', kind: 'Sorting', question: 'What is the expected running time of randomized quicksort on n distinct elements?', options: ['Theta(n log n)', 'Theta(n)', 'Theta(n^2)', 'Theta(log n)'], answer: 'Theta(n log n)', explanation: 'Random pivots give balanced partitions in expectation, yielding Theta(n log n) total work.' },
    { difficulty: 'Hard', kind: 'Graph algorithms', question: 'Dijkstra’s shortest-path algorithm is guaranteed to work when all edge weights are:', options: ['Non-negative', 'Strictly negative', 'Distinct', 'Integers only'], answer: 'Non-negative', explanation: 'Dijkstra finalizes a shortest tentative distance and requires non-negative edge weights.' },
  ],
  'Discrete Mathematics': [
    { difficulty: 'Easy', kind: 'Numerical', question: 'A set has 3 elements. How many subsets does it have?', options: ['3', '6', '8', '9'], answer: '8', explanation: 'A set of n elements has 2^n subsets, so 2^3 = 8.' },
    { difficulty: 'Medium', kind: 'Logic', question: 'For propositions p and q, when is p → q false?', options: ['p is false, q is false', 'p is false, q is true', 'p is true, q is false', 'p is true, q is true'], answer: 'p is true, q is false', explanation: 'An implication is false only when its premise is true and conclusion is false.' },
    { difficulty: 'Hard', kind: 'Combinatorics', question: 'How many onto functions exist from a 3-element set to a 2-element set?', options: ['2', '4', '6', '8'], answer: '6', explanation: 'There are 2^3 total functions; subtract the 2 constant functions to get 6 onto functions.' },
    { difficulty: 'Easy', kind: 'Set theory', question: 'For finite sets A and B, what is |A ∪ B|?', options: ['|A| + |B| - |A ∩ B|', '|A| × |B|', '|A| - |B|', '|A ∩ B| only'], answer: '|A| + |B| - |A ∩ B|', explanation: 'Subtract the intersection once because it is counted in both set sizes.' },
    { difficulty: 'Medium', kind: 'Relations', question: 'Which properties define an equivalence relation?', options: ['Reflexive, symmetric, transitive', 'Reflexive, antisymmetric, transitive', 'Symmetric only', 'Transitive and irreflexive'], answer: 'Reflexive, symmetric, transitive', explanation: 'An equivalence relation must satisfy reflexivity, symmetry, and transitivity.' },
  ],
  'Digital Logic': [
    { difficulty: 'Easy', kind: 'Numerical', question: 'What is the decimal value of binary 1011?', options: ['9', '10', '11', '13'], answer: '11', explanation: '1011₂ = 8 + 0 + 2 + 1 = 11.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'Which gate produces 1 only when its inputs differ?', options: ['AND', 'OR', 'XNOR', 'XOR'], answer: 'XOR', explanation: 'XOR is true for unequal binary inputs.' },
    { difficulty: 'Hard', kind: 'Numerical', question: 'A 4-bit ripple-carry adder has 2 ns carry propagation delay per stage. Ignoring sum delay, what is the worst-case carry-out delay?', options: ['2 ns', '4 ns', '6 ns', '8 ns'], answer: '8 ns', explanation: 'The carry may propagate through all four stages: 4 × 2 ns.' },
    { difficulty: 'Easy', kind: 'Boolean algebra', question: 'Using De Morgan’s law, what is NOT(A AND B)?', options: ['(NOT A) OR (NOT B)', '(NOT A) AND (NOT B)', 'A OR B', 'A AND (NOT B)'], answer: '(NOT A) OR (NOT B)', explanation: 'De Morgan’s law maps the complement of a product to the sum of the complemented terms.' },
    { difficulty: 'Medium', kind: 'Number representation', question: 'What is the 8-bit two’s-complement representation of -1?', options: ['11111111', '10000001', '00000001', '11111110'], answer: '11111111', explanation: 'Invert 00000001 to get 11111110 and add one, yielding 11111111.' },
  ],
  'Computer Organization and Architecture': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which register typically holds the address of the next instruction?', options: ['IR', 'PC', 'MAR', 'Accumulator'], answer: 'PC', explanation: 'The program counter stores the address of the next instruction to fetch.' },
    { difficulty: 'Medium', kind: 'Numerical', question: 'A cache has a hit rate of 0.9. What fraction of accesses are misses?', options: ['0.01', '0.1', '0.9', '1.9'], answer: '0.1', explanation: 'Miss rate = 1 - hit rate = 0.1.' },
    { difficulty: 'Hard', kind: 'Numerical', question: 'Cache hit time is 2 ns, miss rate is 0.1, and miss penalty is 50 ns. What is average access time using hit time + miss rate × penalty?', options: ['2 ns', '5 ns', '7 ns', '52 ns'], answer: '7 ns', explanation: 'Average time = 2 + 0.1 × 50 = 7 ns.' },
    { difficulty: 'Easy', kind: 'Performance', question: 'A processor executes 100 instructions in 50 cycles. What is its average CPI?', options: ['0.5', '2', '50', '100'], answer: '0.5', explanation: 'CPI is cycles divided by instructions: 50 / 100 = 0.5.' },
    { difficulty: 'Medium', kind: 'Cache memory', question: 'In a direct-mapped cache, a given memory block can map to how many cache lines?', options: ['Exactly one', 'Any line', 'Exactly two', 'One line per byte'], answer: 'Exactly one', explanation: 'A direct-mapped cache has one possible line for each memory block, determined by its index.' },
  ],
  'Operating Systems': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which state describes a process waiting for an I/O event?', options: ['Running', 'Ready', 'Blocked', 'Terminated'], answer: 'Blocked', explanation: 'A blocked process waits for an event such as I/O completion.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'Which condition is necessary for deadlock?', options: ['Preemption', 'Circular wait', 'Unlimited resources', 'Process termination'], answer: 'Circular wait', explanation: 'Circular wait is one of the four Coffman conditions for deadlock.' },
    { difficulty: 'Hard', kind: 'Scheduling', question: 'Processes P1(0,5) and P2(1,2) use non-preemptive FCFS, where each pair is (arrival, burst). What is P2 waiting time?', options: ['0', '1', '4', '5'], answer: '4', explanation: 'P1 runs from time 0 to 5. P2 arrives at 1 and starts at 5, so it waits 4 time units.' },
    { difficulty: 'Easy', kind: 'Synchronization', question: 'Which primitive is commonly used to enforce mutual exclusion around a critical section?', options: ['Mutex lock', 'Page table', 'Program counter', 'DNS resolver'], answer: 'Mutex lock', explanation: 'A mutex allows one thread or process at a time to enter a protected critical section.' },
    { difficulty: 'Medium', kind: 'Virtual memory', question: 'A page fault occurs when a process references a page that is:', options: ['Not currently in physical memory', 'Already in a CPU register', 'Always read-only', 'Stored in the TLB'], answer: 'Not currently in physical memory', explanation: 'The operating system handles a page fault to bring a nonresident page into memory or report an invalid access.' },
  ],
  'Database Management Systems': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which key uniquely identifies a row in a relation?', options: ['Foreign key', 'Primary key', 'Candidate attribute', 'View key'], answer: 'Primary key', explanation: 'A primary key is selected to uniquely identify each tuple.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'Which normal form removes partial dependency on part of a composite key?', options: ['1NF', '2NF', '3NF', 'BCNF only'], answer: '2NF', explanation: 'Second normal form requires no non-prime attribute to depend on only part of a candidate key.' },
    { difficulty: 'Hard', kind: 'Serializability', question: 'A schedule has conflicts T1:R(A), T2:W(A), T1:W(B), T2:R(B). What edge appears in its precedence graph?', options: ['T1->T2 only', 'T2->T1 only', 'Both directions', 'No edges'], answer: 'T1->T2 only', explanation: 'On A, T1 reads before T2 writes, giving T1->T2. On B, T1 writes before T2 reads, which gives the same direction.' },
    { difficulty: 'Easy', kind: 'SQL', question: 'Which SQL clause filters rows before grouping?', options: ['WHERE', 'HAVING', 'ORDER BY', 'COMMIT'], answer: 'WHERE', explanation: 'WHERE filters input rows before GROUP BY forms groups; HAVING filters groups.' },
    { difficulty: 'Medium', kind: 'Functional dependencies', question: 'If X → Y, which statement follows from the definition of a functional dependency?', options: ['Equal X values imply equal Y values', 'Every Y value is unique', 'X and Y must be disjoint', 'Y determines every attribute'], answer: 'Equal X values imply equal Y values', explanation: 'A functional dependency requires tuples agreeing on X to also agree on Y.' },
  ],
  'Computer Networks': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which transport protocol provides reliable, ordered byte-stream delivery?', options: ['UDP', 'IP', 'TCP', 'ARP'], answer: 'TCP', explanation: 'TCP provides connection-oriented reliable ordered delivery.' },
    { difficulty: 'Medium', kind: 'Numerical', question: 'How many usable host addresses are available in a conventional IPv4 /24 subnet?', options: ['254', '255', '256', '510'], answer: '254', explanation: 'A /24 has 256 addresses; network and broadcast addresses are not assignable to hosts.' },
    { difficulty: 'Hard', kind: 'Numerical', question: 'A 1000-byte packet traverses a 10 Mbps link. Ignoring propagation and queueing, what is its transmission delay?', options: ['0.08 ms', '0.8 ms', '8 ms', '80 ms'], answer: '0.8 ms', explanation: '8000 bits / 10,000,000 bits per second = 0.0008 seconds = 0.8 ms.' },
    { difficulty: 'Easy', kind: 'Protocols', question: 'Which protocol maps an IPv4 address to a link-layer address on a local network?', options: ['ARP', 'DNS', 'TCP', 'HTTP'], answer: 'ARP', explanation: 'ARP resolves an IPv4 address to a hardware address on the local link.' },
    { difficulty: 'Medium', kind: 'Transport layer', question: 'A stop-and-wait sender transmits one frame and waits for its acknowledgment before sending the next. What limits its utilization on a long-delay link?', options: ['Round-trip waiting time', 'The receiver’s IP address length', 'DNS caching', 'The Ethernet frame checksum'], answer: 'Round-trip waiting time', explanation: 'The sender remains idle while each frame and acknowledgment traverse the link.' },
  ],
  'Theory of Computation': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which machine recognizes exactly the regular languages?', options: ['Finite automaton', 'Pushdown automaton', 'Linear bounded automaton', 'Turing machine only'], answer: 'Finite automaton', explanation: 'Finite automata recognize regular languages.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'A context-free grammar is recognized by which abstract machine?', options: ['DFA', 'PDA', 'Finite-state transducer', 'Boolean circuit'], answer: 'PDA', explanation: 'Pushdown automata recognize context-free languages.' },
    { difficulty: 'Hard', kind: 'Language classes', question: 'Which statement is true for every regular language?', options: ['It is context-free', 'It is not context-free', 'It requires two stacks', 'It is undecidable'], answer: 'It is context-free', explanation: 'Every regular language is context-free; the inclusion is strict in the other direction.' },
    { difficulty: 'Easy', kind: 'Automata', question: 'How many states are required in a DFA that accepts every string over its alphabet?', options: ['One accepting state is sufficient', 'Exactly two states', 'At least one state per symbol', 'No states'], answer: 'One accepting state is sufficient', explanation: 'A single accepting state with self-loops for every alphabet symbol accepts all strings.' },
    { difficulty: 'Medium', kind: 'Closure properties', question: 'Are regular languages closed under intersection?', options: ['Yes', 'No', 'Only for finite languages', 'Only for unary alphabets'], answer: 'Yes', explanation: 'The product construction for finite automata recognizes the intersection of two regular languages.' },
  ],
  'Compiler Design': [
    { difficulty: 'Easy', kind: 'Concept', question: 'Which compiler phase typically produces tokens from source characters?', options: ['Parsing', 'Lexical analysis', 'Code generation', 'Register allocation'], answer: 'Lexical analysis', explanation: 'The lexer groups characters into tokens.' },
    { difficulty: 'Medium', kind: 'Concept', question: 'Which structure is commonly used to represent nested syntactic constructs after parsing?', options: ['Symbol table only', 'Abstract syntax tree', 'Cache table', 'Routing table'], answer: 'Abstract syntax tree', explanation: 'An AST represents the hierarchical syntactic structure while omitting some grammar details.' },
    { difficulty: 'Hard', kind: 'Parsing', question: 'For a grammar with left recursion A → Aα | β, which standard transformation removes immediate left recursion?', options: ['Left factoring only', 'Introduce a new nonterminal for the repeated α suffix', 'Delete β', 'Convert every terminal to a nonterminal'], answer: 'Introduce a new nonterminal for the repeated α suffix', explanation: 'The standard transformation rewrites A as βA′ and A′ as αA′ | ε, preserving the language without immediate left recursion.' },
    { difficulty: 'Easy', kind: 'Intermediate representation', question: 'What is the main purpose of a compiler symbol table?', options: ['Store information about identifiers', 'Schedule network packets', 'Cache machine instructions', 'Execute source code'], answer: 'Store information about identifiers', explanation: 'A symbol table records identifier properties such as scope, type, and storage location.' },
    { difficulty: 'Medium', kind: 'Parsing', question: 'What does a parser use FIRST sets for in predictive parsing?', options: ['Choose a production from the next input symbol', 'Allocate registers', 'Optimize machine cache', 'Generate network routes'], answer: 'Choose a production from the next input symbol', explanation: 'FIRST sets help select a production based on which terminals can begin its derivations.' },
  ],
  'Engineering Mathematics and General Aptitude': [
    { difficulty: 'Easy', kind: 'Numerical', question: 'The mean of 2, 4, and 9 is closest to:', options: ['4', '5', '6', '7'], answer: '5', explanation: 'The mean is (2 + 4 + 9) / 3 = 5.' },
    { difficulty: 'Medium', kind: 'Numerical', question: 'If a fair coin is tossed twice, what is the probability of exactly one head?', options: ['1/4', '1/2', '3/4', '1'], answer: '1/2', explanation: 'The outcomes HT and TH are two of the four equally likely outcomes.' },
    { difficulty: 'Hard', kind: 'Numerical', question: 'A task takes 20% less time after a 25% speed increase. What is the original time if the new time is 48 minutes?', options: ['54 min', '58 min', '60 min', '64 min'], answer: '60 min', explanation: 'The new time is 80% of the original, so original = 48 / 0.8 = 60 minutes.' },
    { difficulty: 'Easy', kind: 'Probability', question: 'A fair six-sided die is rolled once. What is the probability of an even result?', options: ['1/2', '1/3', '2/3', '1/6'], answer: '1/2', explanation: 'Three of the six equally likely outcomes are even, so the probability is 3/6 = 1/2.' },
    { difficulty: 'Medium', kind: 'Linear algebra', question: 'What is the determinant of the 2 × 2 matrix [[a, b], [c, d]]?', options: ['ad - bc', 'ab - cd', 'a + d', 'ac - bd'], answer: 'ad - bc', explanation: 'The determinant of a 2 × 2 matrix is the product of the main diagonal minus the product of the other diagonal.' },
  ],
};

export const gateSyllabus = {
  'Programming and Data Structures': 'Programming in C; recursion; arrays, stacks, queues, linked lists, trees, binary search trees, heaps, graphs, hashing.',
  Algorithms: 'Asymptotic analysis; searching, sorting, hashing; divide and conquer; greedy methods; dynamic programming; graph traversal and shortest paths.',
  'Discrete Mathematics': 'Propositional and predicate logic; sets, relations, functions; partial orders and lattices; groups; graph theory; combinatorics; recurrence relations.',
  'Digital Logic': 'Boolean algebra; combinational and sequential circuits; number representation; minimization; arithmetic circuits.',
  'Computer Organization and Architecture': 'Machine instructions; addressing modes; ALU and datapath; pipelining; memory hierarchy; cache and I/O organization.',
  'Operating Systems': 'Processes and threads; synchronization; deadlocks; CPU scheduling; memory and virtual memory; file systems.',
  'Database Management Systems': 'ER model; relational model and SQL; dependencies and normalization; indexing; transactions; concurrency control.',
  'Computer Networks': 'Layered architecture; Ethernet and switching; IP addressing and routing; transport protocols; congestion and application protocols.',
  'Theory of Computation': 'Regular expressions and finite automata; context-free grammars and pushdown automata; decidability and Turing machines.',
  'Compiler Design': 'Lexical analysis; parsing; syntax-directed translation; runtime environments; intermediate code; optimization; code generation.',
  'Engineering Mathematics and General Aptitude': 'Linear algebra; calculus; probability and statistics; numerical methods; verbal, analytical, and quantitative aptitude.',
};

for (const subject of gateSubjects) {
  gateQuestions[subject] = gateQuestions[subject].map((question) => ({
    ...question,
    syllabus: gateSyllabus[subject],
    source: 'Original practice',
  }));
}
