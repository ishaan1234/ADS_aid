export const flashcardCategories = {
  amortized: {
    name: 'Amortized Analysis',
    icon: '📊',
    cards: [
      {
        id: 'am-1',
        front: 'What is Amortized Complexity?',
        back: 'The average time per operation over a worst-case sequence of operations. It provides a guarantee about the average performance of each operation in the worst case, NOT average case analysis.',
        difficulty: 'beginner',
        tags: ['amortized', 'basics']
      },
      {
        id: 'am-2',
        front: 'Three Methods of Amortized Analysis',
        back: '1. Aggregate Method: Total cost / number of ops\n2. Accounting Method: Assign costs, track credit\n3. Potential Method: Use potential function Φ',
        difficulty: 'intermediate',
        tags: ['amortized', 'methods']
      },
      {
        id: 'am-3',
        front: 'Potential Method Formula',
        back: 'â_i = c_i + Φ(D_i) - Φ(D_{i-1})\nwhere â = amortized cost, c = actual cost, Φ = potential function\nRequirement: Φ(D_n) - Φ(D_0) ≥ 0',
        difficulty: 'advanced',
        tags: ['amortized', 'potential']
      },
      {
        id: 'am-4',
        front: 'Dynamic Array Doubling Analysis',
        back: 'Insert when full: copy n elements, allocate 2n space\nPotential: Φ = 2×size - capacity\nAmortized cost = n + (2 - n) = 2 = O(1)',
        difficulty: 'advanced',
        tags: ['amortized', 'arrays']
      },
      {
        id: 'am-5',
        front: 'Binary Counter Increment Cost',
        back: 'Actual: number of bits flipped (worst O(log n))\nAccounting: charge 2 per increment\nAmortized: O(1) - pay 1 to flip 0→1, store 1 credit',
        difficulty: 'intermediate',
        tags: ['amortized', 'counter']
      },
      {
        id: 'am-6',
        front: 'Stack with Multipop - Aggregate Analysis',
        back: 'n operations, each element pushed once, popped once max\nTotal work ≤ 2n\nAmortized cost = 2n/n = O(1) per operation',
        difficulty: 'intermediate',
        tags: ['amortized', 'aggregate']
      },
      {
        id: 'am-7',
        front: 'Union-Find Amortized Complexity',
        back: 'With path compression + union by rank:\nAmortized O(α(n)) per operation\nα = inverse Ackermann function (essentially constant)',
        difficulty: 'advanced',
        tags: ['amortized', 'union-find']
      },
      {
        id: 'am-8',
        front: 'Splay Tree Amortized Bound',
        back: 'All operations O(log n) amortized\nPotential: Φ = Σ log(size(x)) for all nodes\nNo balance info stored!',
        difficulty: 'advanced',
        tags: ['amortized', 'splay']
      }
    ]
  },

  leftistTrees: {
    name: 'Leftist & Skew Heaps',
    icon: '🌳',
    cards: [
      {
        id: 'lt-1',
        front: 'Define s() function in Leftist Trees',
        back: 's(x) = length of shortest path from x to external node\ns(null) = 0, s(leaf) = 1\ns(x) = 1 + min(s(left), s(right))',
        difficulty: 'intermediate',
        tags: ['leftist', 's-function']
      },
      {
        id: 'lt-2',
        front: 'Leftist Property',
        back: 'For every node x: s(left child) ≥ s(right child)\nEnsures right path is shortest to null\nRight path length ≤ log(n+1)',
        difficulty: 'intermediate',
        tags: ['leftist', 'property']
      },
      {
        id: 'lt-3',
        front: 'Leftist Tree Meld Algorithm',
        back: '1. Compare roots, keep smaller\n2. Meld right subtree with other tree\n3. Make result new right child\n4. If s(left) < s(right), swap children\n5. Update s() = 1 + s(right)',
        difficulty: 'advanced',
        tags: ['leftist', 'meld']
      },
      {
        id: 'lt-4',
        front: 'Why Meld on Right Path?',
        back: 'Right path guaranteed ≤ log n nodes by leftist property\nMelding only traverses right paths\nTime: O(log m + log n) = O(log n)',
        difficulty: 'intermediate',
        tags: ['leftist', 'complexity']
      },
      {
        id: 'lt-5',
        front: 'Skew Heap vs Leftist Tree',
        back: 'Skew: No s() values, always swap children after meld\nLeftist: Store s(), swap only if needed\nSkew: O(log n) amortized, Leftist: O(log n) worst-case',
        difficulty: 'advanced',
        tags: ['skew', 'comparison']
      },
      {
        id: 'lt-6',
        front: 'Leftist Tree Insert & DeleteMin',
        back: 'Insert(x): Create single node, meld with heap\nDeleteMin: Remove root, meld left and right subtrees\nBoth O(log n) via meld operation',
        difficulty: 'intermediate',
        tags: ['leftist', 'operations']
      },
      {
        id: 'lt-7',
        front: 's(root) Upper Bound Proof',
        back: 'Leftist tree with s(root)=k has ≥ 2^k - 1 nodes\nProof: Right path has k nodes, leftist property ensures complete levels\nn ≥ 2^k - 1 → s(root) ≤ log(n+1)',
        difficulty: 'advanced',
        tags: ['leftist', 'proof']
      }
    ]
  },

  intervalHeaps: {
    name: 'Interval Heaps & DEPQs',
    icon: '🌲',
    cards: [
      {
        id: 'ih-1',
        front: 'What is a DEPQ?',
        back: 'Double-Ended Priority Queue\nSupports: FindMin, FindMax, DeleteMin, DeleteMax\nAll in O(log n) time\nApplications: median finding, range queries',
        difficulty: 'beginner',
        tags: ['depq', 'definition']
      },
      {
        id: 'ih-2',
        front: 'Interval Heap Structure',
        back: 'Complete binary tree, each node has interval [left, right]\nLeft endpoints form min-heap\nRight endpoints form max-heap\nParent interval contains child intervals',
        difficulty: 'intermediate',
        tags: ['interval-heap', 'structure']
      },
      {
        id: 'ih-3',
        front: 'Interval Heap Insert Decision',
        back: 'New element x vs parent [a,b]:\nIf x < a: x becomes left endpoint, bubble up in min-heap\nIf x > b: x becomes right endpoint, bubble up in max-heap\nIf a ≤ x ≤ b: can go either side',
        difficulty: 'advanced',
        tags: ['interval-heap', 'insert']
      },
      {
        id: 'ih-4',
        front: 'Min-Max Heap Levels',
        back: 'Even levels (0,2,4,...) are min-levels\nOdd levels (1,3,5,...) are max-levels\nRoot contains global minimum\nMax is among root\'s children',
        difficulty: 'intermediate',
        tags: ['minmax-heap', 'structure']
      },
      {
        id: 'ih-5',
        front: 'Deap Structure',
        back: 'Root is empty\nLeft subtree: min-heap\nRight subtree: max-heap\nCorrespondence: each min node ≤ corresponding max node',
        difficulty: 'intermediate',
        tags: ['deap', 'structure']
      },
      {
        id: 'ih-6',
        front: 'Complementary Range Search',
        back: 'Find elements outside [a,b] in interval heap\nIf node interval ⊆ [a,b], skip entire subtree\nTime: O(k) where k = output size\nOptimal for comparison-based structures',
        difficulty: 'advanced',
        tags: ['interval-heap', 'range']
      },
      {
        id: 'ih-7',
        front: 'DEPQ Implementation Comparison',
        back: 'Dual heaps: 2n space, complex correspondence\nInterval heap: n nodes, simple operations\nMin-max heap: single tree, alternating levels\nDeap: empty root, two subtrees',
        difficulty: 'intermediate',
        tags: ['depq', 'comparison']
      }
    ]
  },

  binomialHeaps: {
    name: 'Binomial & Fibonacci Heaps',
    icon: '🌀',
    cards: [
      {
        id: 'bh-1',
        front: 'Binomial Tree Bk Properties',
        back: 'Bk has exactly 2^k nodes\nHeight = k\nRoot has k children: Bk-1, Bk-2, ..., B0\nNodes at depth d = C(k,d)',
        difficulty: 'intermediate',
        tags: ['binomial', 'properties']
      },
      {
        id: 'bh-2',
        front: 'Binomial Heap Structure',
        back: 'Forest of binomial trees with distinct degrees\nn items → binary representation determines trees\n13 = 1101₂ → B3, B2, B0 present\nAt most ⌊log n⌋ + 1 trees',
        difficulty: 'intermediate',
        tags: ['binomial', 'structure']
      },
      {
        id: 'bh-3',
        front: 'Binomial Heap Meld as Binary Addition',
        back: 'Linking Bk + Bk → Bk+1 (like carry in addition)\n5 + 7: 101₂ + 111₂ = 1100₂\nB2,B0 + B2,B1,B0 → B3,B2',
        difficulty: 'advanced',
        tags: ['binomial', 'meld']
      },
      {
        id: 'bh-4',
        front: 'Pairwise Combine Operation',
        back: 'After DeleteMin, consolidate trees of same degree\nUse array indexed by degree\nLink trees with same degree until unique\nReduces to O(log n) trees',
        difficulty: 'advanced',
        tags: ['binomial', 'consolidate']
      },
      {
        id: 'bh-5',
        front: 'Fibonacci Heap Lazy Operations',
        back: 'Insert: Just add to root list - O(1)\nMeld: Concatenate root lists - O(1)\nNo consolidation until DeleteMin\nPotential pays for deferred work',
        difficulty: 'advanced',
        tags: ['fibonacci', 'lazy']
      },
      {
        id: 'bh-6',
        front: 'Fibonacci Heap Cascading Cuts',
        back: 'DecreaseKey cuts node if heap order violated\nMark parent if first child lost\nCut marked parents (cascade)\nBounds degree to O(log n)',
        difficulty: 'advanced',
        tags: ['fibonacci', 'cuts']
      },
      {
        id: 'bh-7',
        front: 'Fibonacci Heap Potential Function',
        back: 'Φ = trees + 2×marks\nInsert: ΔΦ = 1\nDecreaseKey with c cuts: ΔΦ = 2-c\nAmortized DecreaseKey = O(1)!',
        difficulty: 'graduate',
        tags: ['fibonacci', 'potential']
      },
      {
        id: 'bh-8',
        front: 'Why "Fibonacci" Heap?',
        back: 'Node of degree k has ≥ Fk+2 descendants\nProof uses Fibonacci numbers\nDegree ≤ logφ(n) where φ = golden ratio',
        difficulty: 'graduate',
        tags: ['fibonacci', 'name']
      }
    ]
  },

  externalMemory: {
    name: 'External Memory & I/O',
    icon: '💾',
    cards: [
      {
        id: 'em-1',
        front: 'I/O Model Parameters',
        back: 'N = problem size\nM = internal memory size\nB = block/page size\nCount block transfers, not CPU operations',
        difficulty: 'beginner',
        tags: ['io-model', 'basics']
      },
      {
        id: 'em-2',
        front: 'External Sort I/O Complexity',
        back: 'Optimal: O((N/B) log_{M/B}(N/B)) I/Os\nScanning: O(N/B)\nRun generation: O(N/B)\nMerge passes: log_{M/B}(N/M)',
        difficulty: 'advanced',
        tags: ['external-sort', 'complexity']
      },
      {
        id: 'em-3',
        front: 'Tournament Tree Run Generation',
        back: 'Loser tree with M slots generates runs of average 2M length\nBetter than naive M-length runs\nUses replacement selection\nAdapts to partial sorting',
        difficulty: 'advanced',
        tags: ['tournament', 'runs']
      },
      {
        id: 'em-4',
        front: 'Optimal k for k-way Merge',
        back: 'Not always k = M/B - 1!\nConsider seek time: k ≈ √(M/B)\nTrade-off: fewer passes vs. more seeks per pass\nDouble buffering helps',
        difficulty: 'graduate',
        tags: ['merge', 'optimization']
      },
      {
        id: 'em-5',
        front: 'Why Loser Trees for Merging?',
        back: 'Winner trees need sibling lookups\nLoser trees: only compare with parent loser\nFewer memory accesses\nBetter cache behavior',
        difficulty: 'intermediate',
        tags: ['loser-tree', 'efficiency']
      },
      {
        id: 'em-6',
        front: 'Cache-Oblivious vs Cache-Aware',
        back: 'Aware: Knows B, M, optimizes for specific cache\nOblivious: No parameters, works for any cache\nOblivious often within constant of optimal',
        difficulty: 'advanced',
        tags: ['cache', 'algorithms']
      },
      {
        id: 'em-7',
        front: 'Tall Cache Assumption',
        back: 'M ≥ B² (cache holds ≥ B blocks)\nNeeded for cache-oblivious analysis\nRealistic for modern systems\nEnables recursive algorithms',
        difficulty: 'graduate',
        tags: ['cache', 'assumption']
      }
    ]
  },

  cacheOptimization: {
    name: 'Cache Optimization',
    icon: '⚡',
    cards: [
      {
        id: 'co-1',
        front: 'Memory Hierarchy Speeds',
        back: 'L1: 1ns\nL2: 4ns\nL3: 10ns\nRAM: 100ns\nSSD: 100μs\nHDD: 10ms\nEach level 10-100x slower!',
        difficulty: 'beginner',
        tags: ['memory', 'hierarchy']
      },
      {
        id: 'co-2',
        front: 'Cache Miss Types',
        back: 'Compulsory: First access ever\nCapacity: Working set > cache size\nConflict: Mapping collisions in set-associative\nCoherence: Multiprocessor invalidation',
        difficulty: 'intermediate',
        tags: ['cache', 'misses']
      },
      {
        id: 'co-3',
        front: 'Row vs Column Major Access',
        back: 'C arrays: row-major (row elements contiguous)\nFortran: column-major\nWrong order → cache miss per element!\n100x performance difference possible',
        difficulty: 'intermediate',
        tags: ['cache', 'layout']
      },
      {
        id: 'co-4',
        front: 'Matrix Multiply Tiling',
        back: 'Process in cache-sized tiles\nNaive: O(n³/B) misses\nTiled: O(n³/(B√M)) misses\nChoose tile size ≈ √(M/3)',
        difficulty: 'advanced',
        tags: ['cache', 'tiling']
      },
      {
        id: 'co-5',
        front: 'van Emde Boas Tree Layout',
        back: 'Recursive √n splitting of binary tree\nTop tree of √n, bottom √n trees of √n each\nPath uses O(log_B n) blocks\nCache-oblivious!',
        difficulty: 'graduate',
        tags: ['veb', 'layout']
      },
      {
        id: 'co-6',
        front: 'd-ary Heap Cache Benefits',
        back: 'd = B/sizeof(element) = cache line capacity\nHeight = log_d(n) vs log_2(n)\nAll children in one cache line\n1.5-2x faster than binary heap',
        difficulty: 'advanced',
        tags: ['d-heap', 'cache']
      },
      {
        id: 'co-7',
        front: 'False Sharing',
        back: 'Different threads modify different data in same cache line\nCauses invalidation ping-pong\nSolution: pad to cache line boundary\nCritical in parallel algorithms',
        difficulty: 'advanced',
        tags: ['parallel', 'cache']
      },
      {
        id: 'co-8',
        front: 'Structure Packing',
        back: 'Compilers add padding for alignment\nReorder fields by size (largest first)\nUse __attribute__((packed)) carefully\nCan save 30-50% memory',
        difficulty: 'intermediate',
        tags: ['memory', 'optimization']
      }
    ]
  },

  huffmanCoding: {
    name: 'Huffman & Compression',
    icon: '🗜️',
    cards: [
      {
        id: 'hc-1',
        front: 'Huffman Code Properties',
        back: 'Prefix-free: no code is prefix of another\nOptimal for known frequencies\nAverage length < entropy + 1\nGreedy algorithm gives optimal solution',
        difficulty: 'intermediate',
        tags: ['huffman', 'properties']
      },
      {
        id: 'hc-2',
        front: 'Huffman Tree Construction',
        back: '1. Create leaf for each symbol\n2. Repeatedly merge two minimum frequency nodes\n3. Parent frequency = sum of children\n4. Path to leaf = binary code',
        difficulty: 'intermediate',
        tags: ['huffman', 'algorithm']
      },
      {
        id: 'hc-3',
        front: 'Shannon Entropy Formula',
        back: 'H(S) = -Σ(pi × log₂(pi))\nLower bound on bits per symbol\nHuffman achieves H(S) ≤ L < H(S) + 1',
        difficulty: 'advanced',
        tags: ['entropy', 'information']
      },
      {
        id: 'hc-4',
        front: 'Adaptive Huffman Coding',
        back: 'Updates tree as symbols processed\nNo need to transmit frequency table\nMaintains sibling property\nO(log n) update per symbol',
        difficulty: 'advanced',
        tags: ['adaptive', 'huffman']
      },
      {
        id: 'hc-5',
        front: 'Why Huffman is Optimal',
        back: 'Greedy choice: merge least frequent\nOptimal substructure after merge\nInduction on number of symbols\nPrefix-free constraint satisfied',
        difficulty: 'advanced',
        tags: ['huffman', 'proof']
      },
      {
        id: 'hc-6',
        front: 'Canonical Huffman Codes',
        back: 'Same lengths as optimal but lexicographic\nEncode lengths only, reconstruct codes\nSaves space in header\nUsed in DEFLATE (ZIP)',
        difficulty: 'graduate',
        tags: ['canonical', 'compression']
      }
    ]
  },

  binPacking: {
    name: 'Bin Packing',
    icon: '📦',
    cards: [
      {
        id: 'bp-1',
        front: 'Bin Packing Problem',
        back: 'Pack items of various sizes into minimum bins\nNP-hard: no polynomial optimal algorithm\nMany approximation algorithms\nApplications: memory, shipping, scheduling',
        difficulty: 'beginner',
        tags: ['bin-packing', 'problem']
      },
      {
        id: 'bp-2',
        front: 'First Fit Algorithm',
        back: 'Place item in first bin with space\nOnline: 1.7 × OPT guarantee\nO(n log n) with balanced trees\nSimple and practical',
        difficulty: 'intermediate',
        tags: ['first-fit', 'online']
      },
      {
        id: 'bp-3',
        front: 'First Fit Decreasing',
        back: 'Sort items descending, then First Fit\nOffline algorithm: 11/9 × OPT + 6/9\nMuch better than online First Fit\nOften finds optimal solution',
        difficulty: 'intermediate',
        tags: ['ffd', 'offline']
      },
      {
        id: 'bp-4',
        front: 'Best Fit vs Worst Fit',
        back: 'Best: Use fullest bin with space\nWorst: Use emptiest bin with space\nBoth 1.7 × OPT online\nBest Fit better in practice',
        difficulty: 'intermediate',
        tags: ['heuristics', 'comparison']
      },
      {
        id: 'bp-5',
        front: 'Harmonic Algorithm',
        back: 'Classify items by size ranges\nBin for each class: (1/2,1], (1/3,1/2], ...\nAchieves 1.691 × OPT\nBest known online algorithm',
        difficulty: 'advanced',
        tags: ['harmonic', 'online']
      },
      {
        id: 'bp-6',
        front: 'Lower Bounds for Bin Packing',
        back: 'Continuous: ⌈Σ(sizes)/capacity⌉\nOnline: No algorithm better than 1.54 × OPT\nOffline NP-hard: No PTAS unless P=NP',
        difficulty: 'advanced',
        tags: ['bounds', 'theory']
      }
    ]
  },

  expressionTrees: {
    name: 'Expression Processing',
    icon: '🌲',
    cards: [
      {
        id: 'et-1',
        front: 'Expression Tree Traversals',
        back: 'Inorder: infix notation (needs parentheses)\nPreorder: prefix/Polish notation\nPostorder: postfix/RPN\nEach uniquely represents expression',
        difficulty: 'beginner',
        tags: ['expression', 'traversal']
      },
      {
        id: 'et-2',
        front: 'Shunting Yard Algorithm',
        back: 'Converts infix to postfix using stack\nOperators wait in stack by precedence\nLeft-to-right scan of input\nO(n) time, handles parentheses',
        difficulty: 'intermediate',
        tags: ['shunting-yard', 'parsing']
      },
      {
        id: 'et-3',
        front: 'Postfix Evaluation',
        back: 'Scan left to right\nPush operands on stack\nPop and apply operators\nFinal stack value is result\nNo precedence needed!',
        difficulty: 'beginner',
        tags: ['postfix', 'evaluation']
      },
      {
        id: 'et-4',
        front: 'Operator Precedence',
        back: '() highest\n^ (right associative)\n× / (left associative)\n+ - (left associative)\n= lowest',
        difficulty: 'beginner',
        tags: ['precedence', 'operators']
      },
      {
        id: 'et-5',
        front: 'Why Use Postfix?',
        back: 'No parentheses needed\nNo precedence rules during evaluation\nSingle left-to-right pass\nStack-based execution\nUsed in many calculators',
        difficulty: 'intermediate',
        tags: ['postfix', 'advantages']
      }
    ]
  },

  tournamentTrees: {
    name: 'Tournament Trees',
    icon: '🏆',
    cards: [
      {
        id: 'tt-1',
        front: 'Winner vs Loser Trees',
        back: 'Winner: stores winner at internal nodes\nLoser: stores loser, winner at root\nLoser trees more efficient for updates\nBoth used in k-way merge',
        difficulty: 'intermediate',
        tags: ['tournament', 'types']
      },
      {
        id: 'tt-2',
        front: 'Tournament Tree Update',
        back: 'Change leaf value\nReplay matches up to root\nO(log n) comparisons\nLoser tree: compare only with stored loser',
        difficulty: 'intermediate',
        tags: ['tournament', 'update']
      },
      {
        id: 'tt-3',
        front: 'K-way Merge Complexity',
        back: 'k sequences, n total elements\nTournament tree of k leaves\nO(log k) per element extraction\nTotal: O(n log k) time',
        difficulty: 'intermediate',
        tags: ['k-way', 'merge']
      },
      {
        id: 'tt-4',
        front: 'Replacement Selection',
        back: 'Generate runs > memory size\nAverage run = 2M for random input\nMaintain tournament tree of M elements\nElement > last output extends run',
        difficulty: 'advanced',
        tags: ['external-sort', 'runs']
      },
      {
        id: 'tt-5',
        front: 'Why 2M Average Run Length?',
        back: 'Probability element extends run = 1/2 for random\nHarmonic series analysis\nE[run] = M × H_M ≈ 2M for large M\nKnuth\'s proof using probabilistic argument',
        difficulty: 'graduate',
        tags: ['run-generation', 'analysis']
      }
    ]
  },

  splayTrees: {
    name: 'Splay Trees',
    icon: '🌀',
    cards: [
      {
        id: 'st-1',
        front: 'Splay Tree Key Property',
        back: 'Self-adjusting BST\nNo balance information stored\nO(log n) amortized all operations\nAdapts to access patterns',
        difficulty: 'intermediate',
        tags: ['splay', 'properties']
      },
      {
        id: 'st-2',
        front: 'Splaying Cases',
        back: 'Zig: parent is root (single rotation)\nZig-zig: same side (double rotation)\nZig-zag: opposite sides (double rotation)\nZig-zig is key to balance!',
        difficulty: 'intermediate',
        tags: ['splay', 'rotations']
      },
      {
        id: 'st-3',
        front: 'Why Not Simple Move-to-Root?',
        back: 'Creates unbalanced trees\nSequential access → linear chain\nSplaying zig-zig improves balance\nAmortized analysis fails without it',
        difficulty: 'advanced',
        tags: ['splay', 'analysis']
      },
      {
        id: 'st-4',
        front: 'Splay Tree Access Theorem',
        back: 'm operations on n-node tree: O(m log n + n log n)\nStatic optimality within constant factor\nDynamic finger property\nWorking set property',
        difficulty: 'graduate',
        tags: ['splay', 'theorems']
      },
      {
        id: 'st-5',
        front: 'Splay Tree Applications',
        back: 'Caching: frequent items bubble up\nData compression: adaptive Huffman\nNetwork routing: path compression\nSimpler than red-black/AVL',
        difficulty: 'intermediate',
        tags: ['splay', 'applications']
      }
    ]
  },

  parallelStructures: {
    name: 'Parallel Algorithms',
    icon: '🔀',
    cards: [
      {
        id: 'ps-1',
        front: 'Lock-Free vs Wait-Free',
        back: 'Lock-free: Some thread makes progress\nWait-free: Every thread makes progress\nWait-free stronger guarantee\nHarder to implement',
        difficulty: 'advanced',
        tags: ['parallel', 'progress']
      },
      {
        id: 'ps-2',
        front: 'Compare-And-Swap (CAS)',
        back: 'Atomic: if (location == expected) location = new\nReturns success/failure\nBasis for lock-free algorithms\nABA problem: value changes A→B→A',
        difficulty: 'intermediate',
        tags: ['cas', 'atomic']
      },
      {
        id: 'ps-3',
        front: 'Memory Ordering',
        back: 'Sequential consistency: global order\nRelaxed: allows reordering\nAcquire/Release: synchronization points\nAffects correctness and performance',
        difficulty: 'graduate',
        tags: ['memory', 'ordering']
      },
      {
        id: 'ps-4',
        front: 'Lock-Free Skip List',
        back: 'Natural for concurrent ops\nInsert: CAS at each level\nDelete: mark then unlink\nSearch: no synchronization needed',
        difficulty: 'advanced',
        tags: ['skiplist', 'lock-free']
      },
      {
        id: 'ps-5',
        front: 'Work Stealing',
        back: 'Each thread has local deque\nPush/pop from own bottom\nSteal from others\' top\nBalances load dynamically',
        difficulty: 'advanced',
        tags: ['work-stealing', 'scheduling']
      }
    ]
  },

  complexity: {
    name: 'Complexity Analysis',
    icon: '📈',
    cards: [
      {
        id: 'cx-1',
        front: 'Amortized vs Average Case',
        back: 'Amortized: worst-case sequence guarantee\nAverage: probabilistic over inputs\nAmortized stronger: no assumptions\nExample: dynamic array O(1) amortized',
        difficulty: 'intermediate',
        tags: ['complexity', 'analysis']
      },
      {
        id: 'cx-2',
        front: 'Master Theorem',
        back: 'T(n) = aT(n/b) + f(n)\nCase 1: f(n) = O(n^(log_b(a)-ε)) → T(n) = Θ(n^(log_b(a)))\nCase 2: f(n) = Θ(n^(log_b(a))) → T(n) = Θ(n^(log_b(a)) log n)\nCase 3: f(n) = Ω(n^(log_b(a)+ε)) → T(n) = Θ(f(n))',
        difficulty: 'advanced',
        tags: ['recurrence', 'master']
      },
      {
        id: 'cx-3',
        front: 'Ackermann Function Growth',
        back: 'A(1,n) = n+2\nA(2,n) = 2n+3\nA(3,n) = 2^(n+3)-3\nA(4,n) = 2^2^2... (n+3 times) - 3\nInverse α(n) ≤ 4 for practical n',
        difficulty: 'graduate',
        tags: ['ackermann', 'growth']
      },
      {
        id: 'cx-4',
        front: 'Space Complexity Classes',
        back: 'L: O(log n) space\nPSPACE: polynomial space\nEXPSPACE: exponential space\nL ⊆ P ⊆ NP ⊆ PSPACE',
        difficulty: 'advanced',
        tags: ['complexity', 'classes']
      },
      {
        id: 'cx-5',
        front: 'Cache Complexity Notation',
        back: 'M = cache size\nB = block size\nCache misses often dominate\nExample: scanning = O(N/B) misses',
        difficulty: 'intermediate',
        tags: ['cache', 'complexity']
      }
    ]
  }
};

export class SpacedRepetition {
  constructor() {
    this.reviews = JSON.parse(localStorage.getItem('cardReviews') || '{}');
  }

  getNextReviewTime(cardId, difficulty) {
    const review = this.reviews[cardId] || { interval: 1, easeFactor: 2.5, reviewCount: 0 };

    const qualityMap = {
      'again': 0,
      'hard': 3,
      'good': 4,
      'easy': 5
    };

    const quality = qualityMap[difficulty] || 4;

    let newInterval;
    let newEaseFactor = review.easeFactor;

    if (quality < 3) {
      newInterval = 1;
    } else {
      if (review.reviewCount === 0) {
        newInterval = 1;
      } else if (review.reviewCount === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(review.interval * newEaseFactor);
      }

      newEaseFactor = review.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);
    }

    this.reviews[cardId] = {
      interval: newInterval,
      easeFactor: newEaseFactor,
      reviewCount: review.reviewCount + 1,
      lastReview: Date.now(),
      nextReview: Date.now() + (newInterval * 24 * 60 * 60 * 1000)
    };

    localStorage.setItem('cardReviews', JSON.stringify(this.reviews));
    return this.reviews[cardId];
  }

  getCardsDueForReview(cards) {
    const now = Date.now();
    return cards.filter(card => {
      const review = this.reviews[card.id];
      return !review || review.nextReview <= now;
    });
  }

  getCardStrength(cardId) {
    const review = this.reviews[cardId];
    if (!review) return 0;

    const strengthLevels = [1, 3, 7, 21, 60];
    let strength = 0;

    for (let level of strengthLevels) {
      if (review.interval >= level) strength++;
    }

    return (strength / strengthLevels.length) * 100;
  }
}