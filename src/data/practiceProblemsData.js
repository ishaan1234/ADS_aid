export const practiceProblemsData = [
  // Amortized Analysis Problems
  {
    id: 1,
    category: 'Amortized Analysis',
    title: 'Binary Counter Increment',
    difficulty: 'intermediate',
    question: 'What is the amortized cost of incrementing a binary counter n times starting from 0?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correct: 2,
    explanation: 'Using aggregate analysis: bit 0 flips n times, bit 1 flips n/2 times, bit 2 flips n/4 times, etc. Total: n + n/2 + n/4 + ... < 2n. Amortized = 2n/n = O(1)'
  },
  {
    id: 2,
    category: 'Amortized Analysis',
    title: 'Dynamic Array Potential',
    difficulty: 'advanced',
    question: 'In dynamic array analysis, what potential function gives O(1) amortized insertion?',
    options: ['Φ = size', 'Φ = 2×size - capacity', 'Φ = capacity - size', 'Φ = log(size)'],
    correct: 1,
    explanation: 'Φ = 2×size - capacity works because when doubling: ΔΦ = 2(n+1) - 2n - (2n - n) = 2 - n, giving amortized cost = n + (2-n) = 2 = O(1)'
  },
  {
    id: 3,
    category: 'Amortized Analysis',
    title: 'Stack Multipop',
    difficulty: 'intermediate',
    question: 'For n stack operations including Multipop(k), what is the amortized cost per operation?',
    options: ['O(k)', 'O(n)', 'O(1)', 'O(log n)'],
    correct: 2,
    explanation: 'Each element can be pushed at most once and popped at most once across all operations. Total work ≤ 2n, amortized = O(1)'
  },
  {
    id: 4,
    category: 'Amortized Analysis',
    title: 'Accounting Method Credit',
    difficulty: 'advanced',
    question: 'In accounting method, what must always be true about accumulated credit?',
    options: ['Credit = 0', 'Credit ≥ 0', 'Credit ≤ 0', 'Credit = constant'],
    correct: 1,
    explanation: 'Credit must never be negative: Σ(amortized) - Σ(actual) ≥ 0 at all times. This ensures we\'ve paid for all operations.'
  },
  {
    id: 5,
    category: 'Amortized Analysis',
    title: 'Fibonacci Heap DecreaseKey',
    difficulty: 'graduate',
    question: 'What is the amortized cost of DecreaseKey in a Fibonacci heap?',
    options: ['O(log n)', 'O(1)', 'O(log log n)', 'O(√n)'],
    correct: 1,
    explanation: 'Using potential Φ = trees + 2×marks, cascading cuts have amortized cost O(1) despite worst-case O(log n)'
  },

  // Leftist Trees Problems
  {
    id: 6,
    category: 'Leftist Trees',
    title: 's() Function Value',
    difficulty: 'beginner',
    question: 'What is s(x) for a leaf node in a leftist tree?',
    options: ['0', '1', '2', 'undefined'],
    correct: 1,
    explanation: 's(leaf) = 1 + min(s(null), s(null)) = 1 + min(0, 0) = 1'
  },
  {
    id: 7,
    category: 'Leftist Trees',
    title: 'Leftist Property',
    difficulty: 'intermediate',
    question: 'If a node has s(left)=2 and s(right)=3, does it satisfy the leftist property?',
    options: ['Yes', 'No', 'Depends on values', 'Cannot determine'],
    correct: 1,
    explanation: 'No! Leftist property requires s(left) ≥ s(right). Here 2 < 3, so children must be swapped.'
  },
  {
    id: 8,
    category: 'Leftist Trees',
    title: 'Meld Complexity',
    difficulty: 'intermediate',
    question: 'What is the time complexity of melding two leftist trees with m and n nodes?',
    options: ['O(m + n)', 'O(log m + log n)', 'O(min(m,n))', 'O(m × n)'],
    correct: 1,
    explanation: 'Meld only traverses right paths, which have lengths ≤ log(m+1) and log(n+1), giving O(log m + log n)'
  },
  {
    id: 9,
    category: 'Leftist Trees',
    title: 'Skew Heap Difference',
    difficulty: 'advanced',
    question: 'What is the key difference between skew heaps and leftist trees?',
    options: ['Skew heaps are balanced', 'Skew heaps always swap children', 'Skew heaps are faster', 'Skew heaps use more memory'],
    correct: 1,
    explanation: 'Skew heaps unconditionally swap children after melding, achieving O(log n) amortized without storing s() values'
  },
  {
    id: 10,
    category: 'Leftist Trees',
    title: 'Maximum s() Value',
    difficulty: 'advanced',
    question: 'For a leftist tree with n nodes, what is the maximum possible s(root)?',
    options: ['log₂(n)', '⌊log₂(n+1)⌋', '√n', 'n'],
    correct: 1,
    explanation: 'A leftist tree with s(root)=k has at least 2^k - 1 nodes, so s(root) ≤ ⌊log₂(n+1)⌋'
  },

  // Interval Heaps Problems
  {
    id: 11,
    category: 'Interval Heaps',
    title: 'Insertion Position',
    difficulty: 'intermediate',
    question: 'In interval heap with parent interval [20,60], where does 15 go?',
    options: ['Left endpoint, bubble up min-heap', 'Right endpoint, bubble up max-heap', 'Either endpoint', 'New node'],
    correct: 0,
    explanation: 'Since 15 < 20, it becomes the left endpoint and bubbles up in the min-heap path'
  },
  {
    id: 12,
    category: 'Interval Heaps',
    title: 'DEPQ Operations',
    difficulty: 'beginner',
    question: 'Which operation is NOT supported by a DEPQ?',
    options: ['FindMin', 'FindMax', 'FindMedian', 'DeleteMax'],
    correct: 2,
    explanation: 'DEPQs support min/max operations, but finding median requires additional data structures'
  },
  {
    id: 13,
    category: 'Interval Heaps',
    title: 'Min-Max Heap Levels',
    difficulty: 'intermediate',
    question: 'In a min-max heap, what level is the root (level 0)?',
    options: ['Min level', 'Max level', 'Either', 'Neither'],
    correct: 0,
    explanation: 'Even levels (0, 2, 4...) are min-levels; odd levels (1, 3, 5...) are max-levels'
  },
  {
    id: 14,
    category: 'Interval Heaps',
    title: 'Deap Correspondence',
    difficulty: 'advanced',
    question: 'In a deap, if min-heap node is at position 6, what is its corresponding max-heap position?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'Position 6 = 2² + 2, so max position = 3×2¹ + 2 = 8'
  },
  {
    id: 15,
    category: 'Interval Heaps',
    title: 'Range Search',
    difficulty: 'advanced',
    question: 'What is the time complexity of complementary range search in an interval heap?',
    options: ['O(n)', 'O(log n)', 'O(k) where k=output size', 'O(k log n)'],
    correct: 2,
    explanation: 'By pruning subtrees whose intervals are contained in the query range, we achieve output-sensitive O(k) time'
  },

  // Binomial Heaps Problems
  {
    id: 16,
    category: 'Binomial Heaps',
    title: 'Tree Count',
    difficulty: 'intermediate',
    question: 'A binomial heap with 13 elements contains how many trees?',
    options: ['1', '2', '3', '4'],
    correct: 2,
    explanation: '13 = 1101₂, so we have B₃, B₂, and B₀ - three trees total'
  },
  {
    id: 17,
    category: 'Binomial Heaps',
    title: 'Binomial Tree Height',
    difficulty: 'beginner',
    question: 'What is the height of binomial tree B₅?',
    options: ['4', '5', '6', '32'],
    correct: 1,
    explanation: 'Binomial tree Bₖ has height k, so B₅ has height 5'
  },
  {
    id: 18,
    category: 'Binomial Heaps',
    title: 'Meld as Addition',
    difficulty: 'advanced',
    question: 'Melding heaps with 7 and 9 elements gives a heap with how many trees?',
    options: ['1', '2', '3', '4'],
    correct: 0,
    explanation: '7 + 9 = 16 = 10000₂, so result has only B₄ - one tree'
  },
  {
    id: 19,
    category: 'Binomial Heaps',
    title: 'Node Count at Depth',
    difficulty: 'graduate',
    question: 'In B₆, how many nodes are at depth 2?',
    options: ['6', '15', '20', '64'],
    correct: 1,
    explanation: 'Nodes at depth d in Bₖ = C(k,d) = C(6,2) = 15'
  },
  {
    id: 20,
    category: 'Binomial Heaps',
    title: 'Pairwise Combine',
    difficulty: 'advanced',
    question: 'After DeleteMin, pairwise combine ensures at most how many trees?',
    options: ['n', 'log n', '2 log n', '√n'],
    correct: 1,
    explanation: 'Pairwise combine consolidates to at most one tree per degree, giving O(log n) trees'
  },

  // Fibonacci Heaps Problems
  {
    id: 21,
    category: 'Fibonacci Heaps',
    title: 'Lazy Operations',
    difficulty: 'intermediate',
    question: 'Which Fibonacci heap operation triggers consolidation?',
    options: ['Insert', 'Meld', 'DecreaseKey', 'DeleteMin'],
    correct: 3,
    explanation: 'Only DeleteMin consolidates trees; other operations are lazy for O(1) amortized time'
  },
  {
    id: 22,
    category: 'Fibonacci Heaps',
    title: 'Cascading Cuts',
    difficulty: 'advanced',
    question: 'Why do Fibonacci heaps use cascading cuts?',
    options: ['Faster deletion', 'Maintain degree bound', 'Simplify implementation', 'Save memory'],
    correct: 1,
    explanation: 'Cascading cuts ensure degree(node) = O(log n) by cutting nodes that lose too many children'
  },
  {
    id: 23,
    category: 'Fibonacci Heaps',
    title: 'Potential Function',
    difficulty: 'graduate',
    question: 'In Fibonacci heap potential Φ = t + 2m, what does m represent?',
    options: ['Total nodes', 'Tree height', 'Marked nodes', 'Minimum value'],
    correct: 2,
    explanation: 't = number of trees, m = number of marked nodes. Factor of 2 for marks pays for cascading cuts'
  },
  {
    id: 24,
    category: 'Fibonacci Heaps',
    title: 'Degree Bound',
    difficulty: 'graduate',
    question: 'A Fibonacci heap node of degree k has at least how many descendants?',
    options: ['k', '2^k', 'F_{k+2}', 'k!'],
    correct: 2,
    explanation: 'By the marking scheme, a node of degree k has ≥ F_{k+2} descendants (Fibonacci number)'
  },
  {
    id: 25,
    category: 'Fibonacci Heaps',
    title: 'Amortized vs Worst Case',
    difficulty: 'intermediate',
    question: 'What is worst-case time for Fibonacci heap Insert?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(log log n)'],
    correct: 0,
    explanation: 'Insert is actually O(1) worst-case - just add to root list. It\'s one of the few operations with good worst-case time'
  },

  // External Sorting Problems
  {
    id: 26,
    category: 'External Sorting',
    title: 'I/O Complexity',
    difficulty: 'intermediate',
    question: 'What is the I/O complexity of optimally sorting N elements with memory M and block size B?',
    options: ['O(N/B)', 'O(N log N)', 'O((N/B) log_{M/B}(N/B))', 'O(N²/B)'],
    correct: 2,
    explanation: 'Optimal external sorting achieves O((N/B) log_{M/B}(N/B)) I/Os'
  },
  {
    id: 27,
    category: 'External Sorting',
    title: 'Run Generation',
    difficulty: 'advanced',
    question: 'Using replacement selection with M memory, expected run length for random data is?',
    options: ['M', '1.5M', '2M', 'M log M'],
    correct: 2,
    explanation: 'Tournament tree replacement selection generates runs averaging 2M for random input (Knuth\'s result)'
  },
  {
    id: 28,
    category: 'External Sorting',
    title: 'Merge Passes',
    difficulty: 'intermediate',
    question: 'With k-way merge and R initial runs, how many passes are needed?',
    options: ['R/k', '⌈log_k R⌉', 'k × R', 'R - k'],
    correct: 1,
    explanation: 'Each pass reduces runs by factor k, so ⌈log_k R⌉ passes needed'
  },
  {
    id: 29,
    category: 'External Sorting',
    title: 'Optimal k Choice',
    difficulty: 'graduate',
    question: 'When seek time dominates, optimal k for k-way merge is approximately?',
    options: ['M/B', '√(M/B)', 'M/B - 1', 'log(M/B)'],
    correct: 1,
    explanation: 'When seeks dominate, k ≈ √(M/B) balances fewer passes against more seeks per pass'
  },
  {
    id: 30,
    category: 'External Sorting',
    title: 'Loser Tree Advantage',
    difficulty: 'advanced',
    question: 'Why are loser trees preferred over winner trees for k-way merge?',
    options: ['Less memory', 'Fewer comparisons on update', 'Simpler code', 'Better cache usage'],
    correct: 1,
    explanation: 'Loser trees only compare with parent loser on update, avoiding sibling lookups needed in winner trees'
  },

  // Cache Optimization Problems
  {
    id: 31,
    category: 'Cache Optimization',
    title: 'Memory Hierarchy',
    difficulty: 'beginner',
    question: 'Typical L1 cache access time vs RAM access time ratio is approximately?',
    options: ['2:1', '10:1', '100:1', '1000:1'],
    correct: 2,
    explanation: 'L1 cache ~1ns, RAM ~100ns, making RAM about 100x slower than L1'
  },
  {
    id: 32,
    category: 'Cache Optimization',
    title: 'Cache Miss Types',
    difficulty: 'intermediate',
    question: 'Which cache miss type occurs when working set exceeds cache size?',
    options: ['Compulsory', 'Capacity', 'Conflict', 'Coherence'],
    correct: 1,
    explanation: 'Capacity misses occur when the working set is larger than the cache can hold'
  },
  {
    id: 33,
    category: 'Cache Optimization',
    title: 'Matrix Multiply Tiling',
    difficulty: 'advanced',
    question: 'Tiled matrix multiplication reduces cache misses from O(n³/B) to?',
    options: ['O(n²/B)', 'O(n³/(B√M))', 'O(n³/M)', 'O(n log n/B)'],
    correct: 1,
    explanation: 'Tiling with blocks of size √M reduces misses to O(n³/(B√M))'
  },
  {
    id: 34,
    category: 'Cache Optimization',
    title: 'vEB Layout',
    difficulty: 'graduate',
    question: 'van Emde Boas tree layout achieves which cache complexity for search?',
    options: ['O(log n)', 'O(log B)', 'O(log_B n)', 'O(B log n)'],
    correct: 2,
    explanation: 'vEB layout groups nodes by recursive √n splitting, achieving O(log_B n) cache misses'
  },
  {
    id: 35,
    category: 'Cache Optimization',
    title: 'False Sharing',
    difficulty: 'advanced',
    question: 'False sharing in parallel programs occurs when?',
    options: ['Threads share data', 'Different data in same cache line', 'Cache is full', 'Memory barrier used'],
    correct: 1,
    explanation: 'False sharing happens when different threads modify different data that happen to be in the same cache line'
  },

  // Huffman Coding Problems
  {
    id: 36,
    category: 'Huffman Coding',
    title: 'Code Properties',
    difficulty: 'beginner',
    question: 'What property must Huffman codes satisfy?',
    options: ['Fixed length', 'Prefix-free', 'Sorted order', 'Binary tree'],
    correct: 1,
    explanation: 'Huffman codes must be prefix-free: no code is a prefix of another code'
  },
  {
    id: 37,
    category: 'Huffman Coding',
    title: 'Entropy Bound',
    difficulty: 'advanced',
    question: 'Huffman coding average length L relates to entropy H as?',
    options: ['L = H', 'L ≤ H', 'H ≤ L < H+1', 'L ≥ H+1'],
    correct: 2,
    explanation: 'Huffman coding achieves H ≤ L < H+1, within 1 bit of entropy lower bound'
  },
  {
    id: 38,
    category: 'Huffman Coding',
    title: 'Tree Construction',
    difficulty: 'intermediate',
    question: 'Huffman tree for frequencies [5,9,12,13,16,45] has height?',
    options: ['3', '4', '5', '6'],
    correct: 1,
    explanation: 'Merge order: (5,9)→14, (12,13)→25, (14,16)→30, (25,30)→55, (45,55)→100. Height = 4'
  },
  {
    id: 39,
    category: 'Huffman Coding',
    title: 'Adaptive Huffman',
    difficulty: 'advanced',
    question: 'Main advantage of adaptive Huffman coding?',
    options: ['Better compression', 'No frequency table needed', 'Faster encoding', 'Smaller trees'],
    correct: 1,
    explanation: 'Adaptive Huffman updates tree dynamically, eliminating need to transmit frequency table'
  },
  {
    id: 40,
    category: 'Huffman Coding',
    title: 'Optimality Proof',
    difficulty: 'graduate',
    question: 'Why must least frequent symbols be deepest leaves in optimal code?',
    options: ['Greedy choice', 'Tree balance', 'Minimize total bits', 'Implementation ease'],
    correct: 2,
    explanation: 'Swapping a frequent symbol with infrequent at leaf level would increase total bits, violating optimality'
  },

  // Tournament Trees Problems
  {
    id: 41,
    category: 'Tournament Trees',
    title: 'Winner vs Loser',
    difficulty: 'intermediate',
    question: 'Where does a loser tree store the overall winner?',
    options: ['Root node', 'Leftmost leaf', 'Separate variable', 'Not stored'],
    correct: 2,
    explanation: 'Loser trees store losers at internal nodes; the overall winner is kept separately (often conceptually at root)'
  },
  {
    id: 42,
    category: 'Tournament Trees',
    title: 'K-way Merge',
    difficulty: 'intermediate',
    question: 'Time to extract minimum in k-way merge using tournament tree?',
    options: ['O(1)', 'O(k)', 'O(log k)', 'O(k log k)'],
    correct: 2,
    explanation: 'After extracting min, we update tree in O(log k) time by replaying matches to root'
  },
  {
    id: 43,
    category: 'Tournament Trees',
    title: 'Run Generation',
    difficulty: 'advanced',
    question: 'Why does replacement selection produce 2M-length runs?',
    options: ['Tree property', 'Random input statistics', 'Memory alignment', 'I/O blocking'],
    correct: 1,
    explanation: 'For random input, probability that new element extends run is ~0.5, leading to harmonic series sum ≈ 2M'
  },
  {
    id: 44,
    category: 'Tournament Trees',
    title: 'Update Efficiency',
    difficulty: 'intermediate',
    question: 'Why are loser trees more efficient for updates than winner trees?',
    options: ['Smaller size', 'Better cache usage', 'No sibling lookups', 'Simpler logic'],
    correct: 2,
    explanation: 'Loser trees only need to compare with parent\'s loser, not find sibling like winner trees'
  },

  // Bin Packing Problems
  {
    id: 45,
    category: 'Bin Packing',
    title: 'First Fit',
    difficulty: 'intermediate',
    question: 'First Fit online algorithm guarantees at most how many times optimal bins?',
    options: ['1.5', '1.7', '2.0', '2.2'],
    correct: 1,
    explanation: 'First Fit uses at most 1.7 × OPT bins for any input sequence'
  },
  {
    id: 46,
    category: 'Bin Packing',
    title: 'FFD Performance',
    difficulty: 'advanced',
    question: 'First Fit Decreasing approximation ratio is?',
    options: ['1.7', '1.5', '11/9', '4/3'],
    correct: 2,
    explanation: 'FFD achieves 11/9 × OPT + 6/9 bins, much better than online First Fit'
  },
  {
    id: 47,
    category: 'Bin Packing',
    title: 'Problem Complexity',
    difficulty: 'beginner',
    question: 'The bin packing problem is?',
    options: ['P', 'NP-complete', 'NP-hard', 'PSPACE-complete'],
    correct: 2,
    explanation: 'Bin packing is NP-hard (optimization version), with decision version being NP-complete'
  },
  {
    id: 48,
    category: 'Bin Packing',
    title: 'Harmonic Algorithm',
    difficulty: 'graduate',
    question: 'Harmonic algorithm achieves which approximation ratio?',
    options: ['1.5', '1.691', '1.7', '2.0'],
    correct: 1,
    explanation: 'Harmonic algorithm, using size classes, achieves 1.691 × OPT, best known online ratio'
  },

  // Splay Trees Problems
  {
    id: 49,
    category: 'Splay Trees',
    title: 'Splaying Purpose',
    difficulty: 'intermediate',
    question: 'Why use zig-zig instead of simple rotate-to-root?',
    options: ['Faster', 'Simpler code', 'Better balance', 'Less memory'],
    correct: 2,
    explanation: 'Zig-zig\'s double rotation improves tree balance; simple rotation can create linear chains'
  },
  {
    id: 50,
    category: 'Splay Trees',
    title: 'Amortized Bound',
    difficulty: 'advanced',
    question: 'Splay tree operations have what amortized complexity?',
    options: ['O(1)', 'O(log n)', 'O(log log n)', 'O(√n)'],
    correct: 1,
    explanation: 'All splay tree operations achieve O(log n) amortized time through self-adjustment'
  },
  {
    id: 51,
    category: 'Splay Trees',
    title: 'Balance Information',
    difficulty: 'beginner',
    question: 'How much balance information do splay trees store?',
    options: ['Height at each node', 'Balance factor', 'Color bit', 'None'],
    correct: 3,
    explanation: 'Splay trees store no balance information - self-adjustment through splaying maintains balance'
  },
  {
    id: 52,
    category: 'Splay Trees',
    title: 'Access Pattern',
    difficulty: 'advanced',
    question: 'Splay trees excel when access pattern exhibits?',
    options: ['Random access', 'Temporal locality', 'Sequential access', 'Uniform distribution'],
    correct: 1,
    explanation: 'Frequently accessed items migrate to root, making splay trees ideal for temporal locality'
  },

  // Expression Trees Problems
  {
    id: 53,
    category: 'Expression Trees',
    title: 'Notation Conversion',
    difficulty: 'intermediate',
    question: 'Postfix expression for infix "(A+B)×C" is?',
    options: ['AB+C×', 'ABC×+', 'A+BC×', '×+ABC'],
    correct: 0,
    explanation: 'Postfix evaluates left-to-right: A B + gives (A+B), then C × gives (A+B)×C'
  },
  {
    id: 54,
    category: 'Expression Trees',
    title: 'Shunting Yard',
    difficulty: 'advanced',
    question: 'In Shunting Yard algorithm, when do we pop operators from stack to output?',
    options: ['Always immediately', 'When higher precedence arrives', 'When lower/equal precedence arrives', 'Only at end'],
    correct: 2,
    explanation: 'Pop operators when incoming operator has lower or equal precedence (left-associative)'
  },
  {
    id: 55,
    category: 'Expression Trees',
    title: 'Tree Traversal',
    difficulty: 'beginner',
    question: 'Which traversal of expression tree gives prefix notation?',
    options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
    correct: 1,
    explanation: 'Preorder traversal (root-left-right) produces prefix notation'
  },

  // Parallel Algorithms Problems
  {
    id: 56,
    category: 'Parallel Algorithms',
    title: 'CAS Operation',
    difficulty: 'intermediate',
    question: 'What problem can occur with Compare-And-Swap?',
    options: ['Deadlock', 'ABA problem', 'Memory leak', 'Stack overflow'],
    correct: 1,
    explanation: 'ABA problem: value changes A→B→A between read and CAS, appearing unchanged but isn\'t'
  },
  {
    id: 57,
    category: 'Parallel Algorithms',
    title: 'Progress Guarantees',
    difficulty: 'advanced',
    question: 'Which guarantee is stronger?',
    options: ['Lock-free', 'Wait-free', 'Obstruction-free', 'Deadlock-free'],
    correct: 1,
    explanation: 'Wait-free guarantees every thread makes progress in finite steps, stronger than lock-free'
  },
  {
    id: 58,
    category: 'Parallel Algorithms',
    title: 'Work Stealing',
    difficulty: 'advanced',
    question: 'In work stealing, threads steal from which end of other deques?',
    options: ['Top', 'Bottom', 'Random', 'Middle'],
    correct: 0,
    explanation: 'Threads push/pop from bottom of own deque, steal from top of others\' to minimize contention'
  },

  // Complex Analysis Problems
  {
    id: 59,
    category: 'Complex Analysis',
    title: 'Master Theorem',
    difficulty: 'graduate',
    question: 'For T(n) = 4T(n/2) + n², which case applies?',
    options: ['Case 1', 'Case 2', 'Case 3', 'None'],
    correct: 1,
    explanation: 'a=4, b=2, f(n)=n². Since log_b(a)=2 and f(n)=Θ(n²), Case 2 applies: T(n)=Θ(n² log n)'
  },
  {
    id: 60,
    category: 'Complex Analysis',
    title: 'Recurrence Solution',
    difficulty: 'advanced',
    question: 'Solve: T(n) = 2T(n/2) + n log n',
    options: ['Θ(n log n)', 'Θ(n log² n)', 'Θ(n²)', 'Θ(n)'],
    correct: 1,
    explanation: 'Master theorem doesn\'t directly apply. Using recursion tree: T(n) = Θ(n log² n)'
  }
];