export const learnContent = {
  amortized: {
    title: 'Amortized Complexity Analysis',
    icon: '📊',
    level: 'Advanced',
    readingTime: '45 min',
    sections: [
      {
        id: 'intro',
        title: 'Introduction & Motivation',
        content: `Amortized analysis provides a way to analyze the average performance of operations over a worst-case sequence of operations, giving us tighter bounds than traditional worst-case analysis.

The key insight is that expensive operations cannot occur too frequently. When they do occur, they must be preceded or followed by many cheap operations. This balance allows us to "spread out" the cost of expensive operations over the entire sequence.

Consider a dynamic array that doubles in size when full. While a single insertion might take O(n) time due to resizing, most insertions take O(1). Amortized analysis captures this by showing that n insertions take O(n) total time, giving O(1) amortized time per operation.

This technique is crucial for analyzing data structures like dynamic arrays, splay trees, union-find, and Fibonacci heaps, where occasional expensive operations are balanced by many cheap ones.`,
        keyPoints: [
          'Amortized cost is the average cost over a worst-case sequence',
          'Total amortized cost ≥ Total actual cost (always)',
          'Different from average-case analysis (which assumes probability distributions)',
          'Three methods: Aggregate, Accounting, and Potential'
        ],
        examTips: [
          'Always verify that Σ(amortized) ≥ Σ(actual) for any sequence',
          'Choose the simplest method that works for the problem',
          'In exams, clearly state which method you are using'
        ]
      },
      {
        id: 'aggregate',
        title: 'Aggregate Method',
        content: `The aggregate method is the simplest form of amortized analysis. We compute an upper bound T(n) on the total cost of n operations, then divide by n to get the amortized cost per operation.

This method works well when all operations have the same amortized cost. The key is finding a tight upper bound on the total cost of any sequence of n operations.`,
        formula: 'Amortized Cost = T(n) / n',
        formulaExplanation: 'Where T(n) is the total cost of n operations in the worst case',
        example: `Stack with Multipop:
Operations: Push, Pop, Multipop(k)
- Push: O(1) actual
- Pop: O(1) actual
- Multipop(k): O(min(k, s)) actual where s = stack size

Analysis:
- Each element can be pushed at most once
- Each element can be popped at most once
- For n operations: at most n pushes → at most n pops total
- Total cost ≤ 2n
- Amortized cost = 2n/n = O(1) per operation`,
        proof: `Theorem: n operations on an initially empty stack take O(n) time.
Proof:
1. Let P = number of Push operations (P ≤ n)
2. Each element pushed can be popped at most once
3. Total pops across all operations ≤ P ≤ n
4. Cost of pushes = P ≤ n
5. Cost of all pops/multipops ≤ P ≤ n
6. Total cost ≤ 2n = O(n)
Therefore, amortized cost = O(n)/n = O(1) ∎`,
        commonMistakes: [
          'Forgetting that we analyze worst-case sequences, not average behavior',
          'Using n for number of elements instead of number of operations',
          'Not considering all possible operation sequences'
        ]
      },
      {
        id: 'accounting',
        title: 'Accounting Method',
        content: `The accounting method assigns different charges (amortized costs) to different operations. Some operations are overcharged, building up "credit" that pays for future undercharged operations.

The key invariant: the sum of amortized costs must always be at least as large as the sum of actual costs. We track credit in the data structure and ensure it never becomes negative.

Think of it as a bank account: deposits (overcharges) must come before withdrawals (undercharges). The account balance (accumulated credit) must always be non-negative.`,
        formula: 'Σ(amortized costs) - Σ(actual costs) ≥ 0',
        example: `Binary Counter Increment:
- Actual cost: number of bits flipped
- Amortized cost: 2 per increment

Credit Scheme:
- Pay 2 units per increment
- 1 unit pays for setting a bit from 0→1
- 1 unit credit stored on that bit
- When bit flips 1→0, use stored credit

Verification:
- Each 1-bit has 1 credit
- Increment flips k trailing 1s to 0 (free using credit)
- Sets one 0 to 1 (costs 1, stores 1 credit)
- Total paid: 2, Total spent: 1, Credit stored: 1
- Credit = number of 1s ≥ 0 ✓`,
        keyPoints: [
          'Assign amortized costs to operations',
          'Track credit in data structure',
          'Credit must never go negative',
          'Useful when different operations have different costs'
        ],
        examTips: [
          'Clearly state where credit is stored',
          'Verify credit never goes negative for any sequence',
          'Draw diagrams showing credit distribution'
        ]
      },
      {
        id: 'potential',
        title: 'Potential Method',
        content: `The potential method is the most flexible and powerful technique. We define a potential function Φ that maps data structure states to real numbers, representing stored "energy" or "potential" for future work.

The amortized cost of an operation equals its actual cost plus the change in potential. This elegantly captures how operations that increase potential are charged more, while those that decrease potential are charged less.

Mathematically: amortized_i = actual_i + Φ(D_i) - Φ(D_{i-1}) = actual_i + ΔΦ_i`,
        formula: 'â_i = c_i + Φ(D_i) - Φ(D_{i-1})',
        formulaExplanation: 'â_i = amortized cost, c_i = actual cost, Φ = potential function, D_i = data structure after operation i',
        proof: `Telescoping Sum Proof:
Σ(â_i) = Σ(c_i + Φ(D_i) - Φ(D_{i-1}))
       = Σ(c_i) + Σ(Φ(D_i) - Φ(D_{i-1}))
       = Σ(c_i) + (Φ(D_n) - Φ(D_0))

If Φ(D_n) ≥ Φ(D_0), then:
Σ(â_i) ≥ Σ(c_i)

Common choice: Φ(D_0) = 0, Φ(D) ≥ 0 for all D`,
        example: `Dynamic Array Doubling:
Φ(D) = 2 × num_elements - capacity

Insert when not full:
- Actual: O(1)
- ΔΦ = 2 (num increases by 1)
- Amortized = 1 + 2 = O(1)

Insert when full (doubling):
- Actual: n (copy n elements)
- Before: Φ = 2n - n = n
- After: Φ = 2(n+1) - 2n = 2
- ΔΦ = 2 - n = -n + 2
- Amortized = n + (-n + 2) = 2 = O(1)`,
        commonMistakes: [
          'Choosing a potential function that can go negative',
          'Forgetting to verify Φ(D_n) - Φ(D_0) ≥ 0',
          'Using complicated Φ when simpler ones work',
          'Not showing that Φ ≥ 0 for all states'
        ],
        examTips: [
          'State potential function clearly at the beginning',
          'Verify Φ ≥ 0 and typically choose Φ(D_0) = 0',
          'Show calculations for each operation type',
          'Common Φ: size, number of 1s, 2n - capacity, etc.'
        ]
      },
      {
        id: 'applications',
        title: 'Advanced Applications',
        content: `Amortized analysis is essential for many sophisticated data structures and algorithms used in practice. Understanding these applications demonstrates the power and necessity of amortized analysis.

Splay Trees achieve O(log n) amortized time for all operations despite having O(n) worst-case time. The potential function counts the sum of depths, and splaying reduces overall potential.

Union-Find with path compression and union by rank achieves nearly constant amortized time O(α(n)), where α is the inverse Ackermann function. This uses a complex potential based on level and group classifications.

Fibonacci Heaps achieve O(1) amortized insertion and decrease-key operations, crucial for optimal implementations of Dijkstra's and Prim's algorithms. The potential function counts trees plus twice the marked nodes.`,
        complexity: {
          'Dynamic Array': { worst: 'O(n)', amortized: 'O(1)', space: 'O(n)' },
          'Binary Counter': { worst: 'O(log n)', amortized: 'O(1)', space: 'O(log n)' },
          'Splay Tree': { worst: 'O(n)', amortized: 'O(log n)', space: 'O(n)' },
          'Union-Find': { worst: 'O(log n)', amortized: 'O(α(n))', space: 'O(n)' },
          'Fibonacci Heap Insert': { worst: 'O(1)', amortized: 'O(1)', space: 'O(n)' }
        }
      }
    ],
    summary: 'Amortized analysis provides tight bounds for sequences of operations by accounting for the fact that expensive operations cannot occur frequently. Master all three methods: aggregate for simple uniform costs, accounting for credit-based reasoning, and potential for mathematical elegance.',
    references: [
      'Cormen et al., "Introduction to Algorithms", Chapter 17',
      'Tarjan, "Amortized Computational Complexity", SIAM J. Algebraic Discrete Methods, 1985',
      'Kozen, "The Design and Analysis of Algorithms", Chapter 9'
    ]
  },

  intervalHeaps: {
    title: 'Interval Heaps & DEPQs',
    icon: '🌲',
    level: 'Advanced',
    readingTime: '40 min',
    sections: [
      {
        id: 'depq-intro',
        title: 'Double-Ended Priority Queues',
        content: `A Double-Ended Priority Queue (DEPQ) supports efficient access to both minimum and maximum elements, extending the traditional priority queue interface. This is essential for applications like median finding, range queries, and external sorting algorithms.

DEPQs arise naturally in many scenarios: finding outliers in data streams, maintaining sliding window statistics, implementing cache replacement policies, and optimizing network packet scheduling.

Several data structures implement DEPQ operations efficiently: dual heaps with correspondence, min-max heaps, deaps, and interval heaps. Among these, interval heaps provide the best balance of simplicity, efficiency, and practical performance.`,
        complexity: {
          'FindMin': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'FindMax': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'Insert': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'DeleteMin': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'DeleteMax': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' }
        },
        keyPoints: [
          'DEPQs extend priority queues with dual min/max access',
          'Multiple implementation strategies with different trade-offs',
          'Interval heaps are most practical for general use',
          'Essential for algorithms requiring both extremes'
        ]
      },
      {
        id: 'interval-structure',
        title: 'Interval Heap Structure',
        content: `An interval heap is a complete binary tree where each node stores an interval [left, right] with left ≤ right. The defining property: a node's interval must contain all intervals in its subtree.

Structurally, left endpoints form a min-heap while right endpoints form a max-heap. The root contains [global_min, global_max], providing O(1) access to both extremes.

For n elements, we need ⌈n/2⌉ nodes. The last node may contain a single element (degenerate interval [x, x]). Array representation uses index i for node with children at 2i and 2i+1.`,
        formula: 'Node[i] = [left_i, right_i] where left_i ≤ right_i',
        formulaExplanation: 'Each node stores an interval; parent intervals contain child intervals',
        example: `Interval Heap Example:
          [2, 80]           <- root: min=2, max=80
         /        \\
    [7, 70]      [10, 60]
   /      \\      /      \\
[15,50] [20,45] [25,40] [30,35]

Valid because:
- [15,50] ⊆ [7,70] ⊆ [2,80] ✓
- [20,45] ⊆ [7,70] ⊆ [2,80] ✓
- All intervals properly contained`,
        commonMistakes: [
          'Confusing interval containment with value ordering',
          'Forgetting that last node can have single element',
          'Not maintaining both min-heap and max-heap properties',
          'Incorrect parent-child relationship in array representation'
        ]
      },
      {
        id: 'interval-operations',
        title: 'Insertion Algorithm',
        content: `Insertion in an interval heap requires determining whether the new element becomes a left or right endpoint, then bubbling up in the appropriate heap while maintaining interval containment.

The algorithm compares the new element with intervals along the insertion path, swapping endpoints as needed to maintain the heap properties. This elegant process naturally maintains both min and max heap structures simultaneously.`,
        example: `Insert 35 into interval heap:
1. Start at last position (new node)
2. Parent interval is [30, 60]
3. Since 35 ∈ [30, 60], could go either endpoint
4. If left endpoint: bubble up in min-heap
5. If right endpoint: bubble up in max-heap
6. Choose based on maintaining balance

Insert 5:
1. Parent [30, 60], but 5 < 30
2. 5 becomes left endpoint, 30 moves down
3. Bubble up: compare with [10, 70]
4. 5 < 10, swap to get [5, 70] and [10, 60]
5. Continue until interval property satisfied`,
        proof: `Correctness of Insertion:
Invariant: After each swap, interval containment is maintained.

Base: New node with single element [x, x] trivially valid.

Induction: If x < parent.left:
- Swap x with parent.left
- New parent interval contains old parent interval
- All descendants still contained
- Recurse on parent

Similar for x > parent.right.
Terminal: Root or contained in parent.
Thus heap properties preserved. ∎`,
        keyPoints: [
          'Determine endpoint type based on parent interval',
          'Bubble up maintains interval containment',
          'At most log n comparisons and swaps',
          'Preserves both min and max heap properties'
        ]
      },
      {
        id: 'deletion',
        title: 'Deletion Operations',
        content: `DeleteMin and DeleteMax in interval heaps follow similar strategies: remove the appropriate endpoint from the root, replace it with an element from the last node, and bubble down to restore heap properties.

The key insight is that we only modify one endpoint at a time, preserving the other heap structure. This makes interval heaps more efficient than correspondence-based DEPQs.`,
        example: `DeleteMin from [2, 80]:
1. Remove 2 from root interval → [?, 80]
2. Take left endpoint from last node, say 35
3. Place 35 at root → [35, 80]
4. Bubble down in min-heap:
   - Children: [7, 70], [10, 60]
   - Minimum left endpoint: 7
   - Swap 35 and 7 → [7, 80]
5. Continue at [35, 70] position
6. Swap with child if needed
7. May need to swap with right endpoint

Special cases:
- Last node has one element
- Root has one element
- Swapping causes interval reversal`,
        complexity: {
          'DeleteMin': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'DeleteMax': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'Comparison': { worst: '2 log n', amortized: '2 log n', space: '-' }
        },
        examTips: [
          'Always handle the special case of single-element nodes',
          'Remember to maintain left ≤ right after swaps',
          'Bubble down follows min/max heap rules separately',
          'Draw the tree to visualize endpoint movements'
        ]
      },
      {
        id: 'range-search',
        title: 'Complementary Range Search',
        content: `Interval heaps excel at complementary range search: finding all elements outside a given range [a, b]. This operation leverages the interval containment property to prune entire subtrees.

If a node's interval [l, r] is completely contained in [a, b], then all descendants are also in [a, b] and can be skipped. This produces O(k) time complexity where k is the output size, optimal for any comparison-based structure.`,
        example: `Find elements outside [20, 60]:
          [2, 80]
         /        \\
    [7, 70]      [10, 65]
   /      \\      /       \\
[15,50] [25,45] [30,40] [35,55]

Traversal:
1. Root [2, 80]: 2 < 20 (output: 2), 80 > 60 (output: 80)
2. Left child [7, 70]: 7 < 20 (output: 7), 70 > 60 (output: 70)
3. [15, 50]: 15 < 20 (output: 15), check children
4. [25, 45] ⊆ [20, 60]: skip entire subtree ✓
5. Right subtree similar process

Output: {2, 7, 15, 65, 70, 80}`,
        keyPoints: [
          'Prune subtrees with intervals contained in query range',
          'Output elements outside range from visited nodes',
          'Time complexity O(k) where k = output size',
          'More efficient than checking every element'
        ]
      }
    ],
    summary: 'Interval heaps provide an elegant and efficient DEPQ implementation using interval containment. Master the insertion endpoint decision, deletion bubble-down process, and the power of interval-based pruning for range queries.',
    references: [
      'van Leeuwen & Wood, "Interval Heaps", The Computer Journal, 1993',
      'Ding & Weiss, "The Relaxation Paradigm", Algorithmica, 2011',
      'Brodal et al., "Fast Meldable Priority Queues", Workshop on Algorithms and Data Structures, 1995'
    ]
  },

  leftistTrees: {
    title: 'Leftist Trees & Meldable Heaps',
    icon: '🌳',
    level: 'Advanced',
    readingTime: '35 min',
    sections: [
      {
        id: 'leftist-intro',
        title: 'Meldable Heap Motivation',
        content: `Leftist trees solve a fundamental limitation of standard heaps: efficient melding (merging) of two heaps. While standard heaps require O(n) time to merge, leftist trees achieve O(log n) meld operations.

This efficiency is crucial for applications like optimal merge patterns, discrete event simulation with multiple queues, and implementing other data structures like binomial and Fibonacci heaps.

The key innovation is biasing the tree structure to keep the right spine short, allowing meld operations to traverse only logarithmic-length paths while maintaining heap order.`,
        keyPoints: [
          'Standard heaps cannot meld efficiently due to rigid structure',
          'Leftist trees sacrifice balance for efficient melding',
          'Right-biased structure ensures O(log n) operations',
          'Foundation for more advanced heap structures'
        ],
        examTips: [
          'Remember: leftist property is about s() values, not element values',
          'Right spine is always the shortest path to null',
          'All operations can be implemented via meld'
        ]
      },
      {
        id: 's-function',
        title: 'The s() Function',
        content: `The s() function (also called rank or null path length) is fundamental to leftist trees. For any node x, s(x) is the length of the shortest path from x to an external (null) node in its subtree.

This seemingly simple function enables the entire leftist tree structure. By maintaining s(leftChild) ≥ s(rightChild) at every node, we ensure the right spine is always a shortest path.`,
        formula: 's(x) = 1 + min(s(left(x)), s(right(x)))',
        formulaExplanation: 'For null nodes: s(null) = 0. For leaves: s(leaf) = 1.',
        example: `Computing s() values:
        (3)           s() values:      2
       /   \\                       / \\
     (1)    (7)                   2   1
     / \\    / \\                  /\\ /\\
   (4) (2) (8) null             1 1 1 0

s(8) = 1 (leaf)
s(7) = 1 + min(s(8), s(null)) = 1 + min(1, 0) = 1
s(2) = 1 (leaf)
s(4) = 1 (leaf)
s(1) = 1 + min(s(4), s(2)) = 1 + min(1, 1) = 2
s(3) = 1 + min(s(1), s(7)) = 1 + min(2, 1) = 2`,
        proof: `Theorem: In a leftist tree with n nodes, s(root) ≤ ⌊log₂(n+1)⌋.

Proof:
Let T be a leftist tree with root r and s(r) = k.
Consider the complete binary tree of height k-1.
This complete tree has 2^k - 1 nodes.

Claim: T has at least 2^k - 1 internal nodes.
- The rightmost path has length s(r) = k
- At each level 0 to k-1 on this path, there must be a node
- By leftist property, left subtrees are at least as deep
- Therefore, levels 0 to k-1 are complete

Thus: n ≥ 2^k - 1
      n + 1 ≥ 2^k
      log₂(n+1) ≥ k = s(root)
Therefore: s(root) ≤ ⌊log₂(n+1)⌋ ∎`,
        commonMistakes: [
          'Confusing s() with height or depth',
          'Forgetting s(null) = 0 base case',
          'Not updating s() after structural changes',
          'Assuming s() relates to element values'
        ]
      },
      {
        id: 'meld-operation',
        title: 'The Meld Operation',
        content: `Meld is the cornerstone operation of leftist trees - all other operations are implemented through it. The algorithm recursively melds along right spines, maintaining heap order and leftist property.

The elegance lies in only traversing right paths (length O(log n)) and making local adjustments to preserve the leftist property. This transforms an O(n) operation in standard heaps to O(log n).`,
        example: `Meld Algorithm:
function meld(T1, T2):
  if T1 is null: return T2
  if T2 is null: return T1

  // Ensure T1 has smaller root (min-heap)
  if T1.value > T2.value:
    swap(T1, T2)

  // Recursively meld T1's right subtree with T2
  T1.right = meld(T1.right, T2)

  // Maintain leftist property
  if s(T1.left) < s(T1.right):
    swap(T1.left, T1.right)

  // Update s() value
  T1.s = 1 + s(T1.right)

  return T1

Example execution:
Meld [3,7,11] with [2,5,8]
     3            2
    / \\          / \\
   7   11        5   8

Step 1: 2 < 3, so 2 becomes root
Step 2: Meld 2.right=[5,8] with [3,7,11]
Step 3: 3 < 5, recursively meld...
Result maintains heap order and leftist property`,
        complexity: {
          'Meld': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(log n)' },
          'Path Length': { worst: 'O(log n)', amortized: '-', space: '-' },
          'Comparisons': { worst: 'O(log n)', amortized: 'O(log n)', space: '-' }
        },
        keyPoints: [
          'Only traverses right spines of both trees',
          'Maintains heap order by choosing smaller root',
          'Swaps children to maintain leftist property',
          'All other operations implemented via meld'
        ]
      },
      {
        id: 'derived-operations',
        title: 'Operations via Meld',
        content: `The beauty of leftist trees is that all priority queue operations can be elegantly implemented using meld as the only complex operation. This simplifies implementation and analysis.

Insert becomes melding with a single-node tree. DeleteMin removes the root and melds its children. This unified approach makes leftist trees conceptually cleaner than standard heaps.`,
        example: `Insert(x):
  Create single-node tree Tx with value x
  root = meld(root, Tx)
  // O(log n) time

DeleteMin():
  min = root.value
  root = meld(root.left, root.right)
  return min
  // O(log n) time

DecreaseKey(node, newValue):
  node.value = newValue
  if node ≠ root and violates heap order:
    Cut subtree at node
    Remove node from parent
    root = meld(root, subtree)
  // O(log n) time

BuildHeap(array):
  Create n single-node trees
  While more than one tree:
    T1 = dequeue()
    T2 = dequeue()
    enqueue(meld(T1, T2))
  // O(n) time total!`,
        proof: `BuildHeap in O(n) Proof:
Let n = 2^k for simplicity.
Round i: 2^(k-i) melds of trees with s() ≤ i
Cost of round i: 2^(k-i) × O(i)
Total: Σ(i=1 to k) 2^(k-i) × i
     = 2^k × Σ(i=1 to k) i/2^i
     = n × O(1) = O(n)
(Since Σ(i/2^i) converges to 2)`,
        examTips: [
          'Always implement operations via meld for consistency',
          'BuildHeap uses bottom-up pairing for O(n) time',
          'Draw trees to verify leftist property preserved',
          'Remember insert is just meld with singleton'
        ]
      },
      {
        id: 'skew-heaps',
        title: 'Skew Heaps',
        content: `Skew heaps are a self-adjusting version of leftist trees that don't store s() values. Instead, they unconditionally swap children after melding, achieving amortized O(log n) bounds through automatic rebalancing.

This simplification eliminates the space overhead of storing s() values and the time overhead of maintaining them, while preserving good amortized performance. The trade-off is losing worst-case guarantees.`,
        example: `Skew Heap Meld:
function skewMeld(T1, T2):
  if T1 is null: return T2
  if T2 is null: return T1

  if T1.value > T2.value:
    swap(T1, T2)

  T1.right = skewMeld(T1.right, T2)
  swap(T1.left, T1.right)  // Always swap!

  return T1

Key differences from leftist trees:
- No s() values stored or maintained
- Always swap children (no conditional)
- Simpler but only amortized bounds
- Self-adjusting like splay trees`,
        complexity: {
          'Meld': { worst: 'O(n)', amortized: 'O(log n)', space: 'O(log n)' },
          'Insert': { worst: 'O(n)', amortized: 'O(log n)', space: 'O(1)' },
          'DeleteMin': { worst: 'O(n)', amortized: 'O(log n)', space: 'O(1)' }
        },
        keyPoints: [
          'No s() values - simpler structure',
          'Unconditional swapping provides amortization',
          'Worst-case O(n) but amortized O(log n)',
          'Good practical performance with less overhead'
        ]
      }
    ],
    summary: 'Leftist trees enable efficient heap melding through right-spine bias maintained by the s() function. Master the meld operation as it underlies all other operations. Skew heaps offer a simpler alternative with good amortized bounds.',
    references: [
      'Crane, "Linear Lists and Priority Queues as Balanced Binary Trees", PhD Thesis, 1972',
      'Tarjan, "Data Structures and Network Algorithms", Chapter 3',
      'Sleator & Tarjan, "Self-Adjusting Heaps", SIAM J. Computing, 1986'
    ]
  },

  tournamentTrees: {
    title: 'Tournament Trees (Winner & Loser)',
    icon: '🏆',
    level: 'Advanced',
    readingTime: '40 min',
    sections: [
      {
        id: 'tournament-intro',
        title: 'Tournament Tree Fundamentals',
        content: `Tournament trees, also known as selection trees, efficiently track winners or losers in competitive scenarios. They excel at finding minimum/maximum elements repeatedly, making them ideal for external sorting, k-way merging, and run generation.

Two variants exist: Winner trees store winners at internal nodes, while Loser trees store losers. Surprisingly, loser trees are often more efficient because they require fewer comparisons during updates.

The structure mimics sports tournaments: leaves represent players (elements), internal nodes represent match results. Each match's outcome propagates upward until a champion emerges at the root.`,
        keyPoints: [
          'Complete binary tree structure with n leaves',
          'Internal nodes store match results (winner or loser)',
          'O(log n) update after changing a leaf',
          'Ideal for repeated minimum/maximum finding',
          'Loser trees often outperform winner trees'
        ],
        examTips: [
          'Draw the tree structure for small examples',
          'Remember: loser tree root stores overall winner',
          'Update path only needs to check log n matches',
          'Perfect for k-way merge in external sorting'
        ]
      },
      {
        id: 'winner-trees',
        title: 'Winner Tree Structure',
        content: `Winner trees store the winner (smaller element for min-tree) at each internal node. The root contains the overall winner. Updates require recomputing matches along the path from modified leaf to root.

The main drawback: during updates, we need to know both competitors at each level, requiring extra lookups to find siblings. This makes winner trees slightly less efficient than loser trees.`,
        example: `Winner Tree (Min) Example:
Leaves: [5, 2, 8, 3, 9, 1, 7, 6]

Tournament Structure:
                1
              /   \\
            1       3
          /   \\   /   \\
        2       1 3       6
       / \\     / \\ / \\     / \\
      5   2   8   1 3   9 7   6

Each internal node stores winner (minimum).
Path to find 1: right → left → right

After replacing 1 with 10:
Need to replay matches: 8 vs 10 → 8 wins
Then 2 vs 8 → 2 wins
Then 2 vs 3 → 2 wins (new champion)`,
        complexity: {
          'Build': { worst: 'O(n)', amortized: '-', space: 'O(n)' },
          'Find Min': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'Replace Min': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'Update Any': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' }
        }
      },
      {
        id: 'loser-trees',
        title: 'Loser Tree Structure',
        content: `Loser trees store the loser at each internal node, with the overall winner stored separately at the root. This clever inversion simplifies updates: when a leaf changes, we only need to compare with the loser stored at parent nodes.

The key insight: the loser at a node provides complete information about past matches. During updates, we carry the potential new winner up the tree, swapping with losers when necessary.`,
        example: `Loser Tree (Min) Example:
Leaves: [5, 2, 8, 3, 9, 1, 7, 6]
Overall Winner: 1 (stored at root)

Loser Tree Structure:
              [1]  ← overall winner
                2  ← loser
              /   \\
            5       3
          /   \\   /   \\
        (leaf level has actual values)

Update Algorithm when leaf changes:
1. Start with new value
2. At each level, compare with loser
3. Winner goes up, loser stays
4. Continue to root
5. Final winner becomes new overall winner

Advantages:
- Only one comparison per level
- No sibling lookups needed
- More cache-friendly access pattern`,
        proof: `Loser Tree Correctness Proof:
Invariant: The loser at node n is the element that lost the match determining n's subtree winner.

Base: Leaves are players, no losers stored.

Induction: For internal node n with children c1, c2:
- Match between winner(c1) and winner(c2)
- Store loser at n
- Winner proceeds upward

Update maintains invariant:
- New value w competes with loser l at each level
- If w < l: w proceeds up, l remains (invariant holds)
- If w > l: l proceeds up, w becomes new loser (invariant holds)
- Process terminates at root with correct overall winner ∎`
      },
      {
        id: 'k-way-merge',
        title: 'K-Way Merge Application',
        content: `Tournament trees excel at k-way merging, crucial for external sorting. With k sorted sequences, we need to repeatedly find the minimum among k front elements. A tournament tree does this in O(log k) time per element.

The loser tree implementation is particularly elegant: each leaf represents one sequence's current element. After outputting the minimum, we replace it with the next element from that sequence and update the tree.`,
        example: `K-Way Merge with Loser Tree (k=4):
Sequences:
S1: [3, 7, 15, 20]
S2: [1, 8, 12, 25]
S3: [5, 9, 11, 18]
S4: [2, 6, 14, 22]

Initial Tree (with first elements):
         [1] ← min
          2
        /   \\
      3       5
     / \\     / \\
   [3] [1] [5] [2]

Output 1, advance S2 to 8:
         [2] ← new min
          3
        /   \\
      8       5
     / \\     / \\
   [3] [8] [5] [2]

Continue until all sequences exhausted.
Total elements: n, Comparisons: n⋅log(k)`,
        complexity: {
          'Initialize': { worst: 'O(k)', amortized: '-', space: 'O(k)' },
          'Extract Min': { worst: 'O(log k)', amortized: 'O(log k)', space: 'O(1)' },
          'Total Merge': { worst: 'O(n log k)', amortized: '-', space: 'O(k)' }
        },
        keyPoints: [
          'Each leaf represents one sorted sequence',
          'Update tree after extracting minimum',
          'Loser tree avoids redundant comparisons',
          'Essential for external sorting efficiency'
        ]
      },
      {
        id: 'run-generation-tournament',
        title: 'Run Generation Optimization',
        content: `Tournament trees optimize run generation in external sorting through the replacement selection algorithm. This technique generates runs averaging 2M length using only M memory, doubling efficiency.

The tree maintains M elements. When outputting the minimum, its replacement either extends the current run (if larger) or starts the next run (if smaller). The tree efficiently tracks which elements belong to which run.`,
        formula: 'E[Run Length] = 2M for random input',
        example: `Replacement Selection with Tournament Tree:
Memory = 8 slots, generating runs

Tree maintains 8 elements:
- Output minimum if it extends current run
- Mark for next run if too small
- Replace with new input

Run 1: Output 3, replace with 12 → OK (12 > 3)
       Output 5, replace with 4 → FAIL (4 < 5)
       Mark 4 for Run 2
       Output 7, replace with 15 → OK
       Continue...

Benefits:
- Longer runs = fewer merge passes
- Natural adaptation to partially sorted input
- Fully sorted input produces single run`,
        examTips: [
          'Remember average run length is 2M, not M',
          'Draw run boundaries when tracing algorithm',
          'Partially sorted input produces even longer runs'
        ]
      }
    ],
    summary: 'Tournament trees efficiently solve the k-minimum problem through competitive elimination. Master the winner vs. loser tree trade-off, understand k-way merge applications, and know how they optimize external sorting.',
    references: [
      'Knuth, "The Art of Computer Programming, Vol. 3", Section 5.4.1',
      'Horowitz & Sahni, "Fundamentals of Data Structures", Chapter 11',
      'Floyd, "Tournament Sorting", Communications of the ACM, 1964'
    ]
  },

  externalSorting: {
    title: 'External Memory Algorithms',
    icon: '💾',
    level: 'Graduate',
    readingTime: '50 min',
    sections: [
      {
        id: 'io-model',
        title: 'I/O Complexity Model',
        content: `External memory algorithms operate when data exceeds RAM capacity, requiring expensive disk I/O. The I/O model captures this by counting block transfers between disk and memory, ignoring CPU computation.

Modern systems have dramatic performance gaps: RAM access takes nanoseconds while disk seeks take milliseconds - a factor of 1,000,000! This makes I/O minimization crucial for large-scale data processing.

Parameters: N = problem size, M = memory size, B = block size. We analyze algorithms by counting I/O operations, where one I/O transfers B consecutive items. The goal is minimizing I/Os, not CPU operations.`,
        formula: 'I/O Complexity = Number of block transfers × (Seek + Latency + Transfer/B)',
        formulaExplanation: 'Each I/O includes fixed seek/latency costs plus per-byte transfer time',
        keyPoints: [
          'I/O cost dominates CPU cost for external algorithms',
          'Sequential access far more efficient than random',
          'Block size B typically 4KB to 1MB',
          'Memory M typically holds M/B blocks'
        ],
        examTips: [
          'Always express I/O complexity in terms of N, M, and B',
          'Scanning N items takes Θ(N/B) I/Os',
          'Sorting takes Θ((N/B) log_{M/B}(N/B)) I/Os optimally',
          'Consider both read and write I/Os'
        ]
      },
      {
        id: 'merge-sort-external',
        title: 'External Merge Sort',
        content: `External merge sort adapts the merge sort paradigm for disk-based data. Phase 1 generates sorted runs using available memory. Phase 2 repeatedly merges runs until one sorted file remains.

The key insight: longer initial runs mean fewer merge passes. Using sophisticated run generation (like loser trees) doubles average run length, halving the number of passes required.`,
        example: `External Merge Sort Analysis:
Given: N = 10GB data, M = 100MB memory, B = 1MB blocks

Phase 1 - Run Generation:
- Load M data, sort in memory, write run
- Basic: 100 runs of 100MB each
- With loser tree: ~50 runs of 200MB average
- I/Os: 2N/B (read once, write once)

Phase 2 - Merging (k-way):
- k limited by M/B (need k+1 buffers)
- Here k ≤ 99 (keep 1 output buffer)
- Passes needed: ⌈log_k(runs)⌉ = 1 pass!
- I/Os per pass: 2N/B
- Total: 2N/B × ⌈log_k(runs)⌉

Total I/Os: 2N/B + 2N/B × ⌈log_k(R)⌉
         = 20,000 + 20,000 = 40,000 I/Os
Time at 10ms/IO: 400 seconds = 6.7 minutes`,
        complexity: {
          'Run Generation': { worst: 'O(N/B)', amortized: '-', space: 'O(M)' },
          'k-way Merge Pass': { worst: 'O(N/B)', amortized: '-', space: 'O(M)' },
          'Total Sorting': { worst: 'O((N/B)log_{M/B}(N/B))', amortized: '-', space: 'O(M)' }
        }
      },
      {
        id: 'run-generation',
        title: 'Advanced Run Generation',
        content: `The loser tree (tournament tree) method generates runs averaging 2M in length using only M memory, doubling efficiency compared to basic run generation.

The technique maintains a tournament tree in memory. Elements larger than the current winner extend the current run; smaller elements start the next run. This selection process naturally produces longer runs from partially sorted input.`,
        proof: `Expected Run Length = 2M Proof (Knuth):
Model input as random permutation.
Element x joins current run if x > last output.
Probability = (rank of x among seen elements)^(-1)

Expected run length = M × H_M
where H_M = 1 + 1/2 + ... + 1/M (harmonic series)

For large M: H_M ≈ ln(M) + γ
But with replacement selection:
E[length] = M × (e^γ × ln(M)) ≈ 2M

Intuition: We maintain M elements, continuously replacing the minimum with new input that exceeds it.`,
        example: `Loser Tree Run Generation:
Memory = 4 slots, Input = [8,3,9,4,7,6,2,1,5]

Initial tree: [8,3,9,4]
        3
       / \\
      8   4
         /
        9

Output 3, read 7 → 7 > 3 ✓ (current run)
Tree: [8,7,9,4], output 4, read 6 → 6 > 4 ✓
Tree: [8,7,9,6], output 6, read 2 → 2 < 6 ✗
Mark 2 for next run, output 7, read 1 → 1 < 7 ✗
Continue until run completes...

Run 1: [3,4,6,7,8,9] (length 6 > M)
Run 2: [1,2,5] (remaining)`,
        keyPoints: [
          'Loser tree maintains M elements in memory',
          'Output smallest element that extends current run',
          'Mark elements for next run when too small',
          'Average run length ≈ 2M for random input',
          'Sorted input produces single run'
        ]
      },
      {
        id: 'optimal-merging',
        title: 'Optimizing Merge Order',
        content: `The choice of merge order k significantly impacts I/O performance. Too small k means many passes; too large k means many seeks per block due to buffer fragmentation.

The optimal k balances these factors. Typically k = Θ(√(M/B)) minimizes total I/O time when considering seek costs. This surprising result comes from analyzing the trade-off between pass count and per-pass efficiency.`,
        formula: 'Optimal k ≈ √(M/B) when seek time dominates',
        formulaExplanation: 'Balances number of passes (log_k) with seeks per pass (k)',
        example: `Choosing Optimal k:
M = 100MB, B = 1MB, 100 runs
Seek = 10ms, Transfer = 1ms per MB

k=5: ⌈log_5(100)⌉ = 3 passes
- Buffers: 1MB each
- Seeks per block: 5
- Time: 3 × (100 × 10ms × 5 + 10GB/100MB/s) = 215s

k=10: ⌈log_10(100)⌉ = 2 passes
- Buffers: 0.5MB each (more seeks)
- Seeks per block: 10
- Time: 2 × (200 × 10ms × 10 + 10GB/100MB/s) = 300s

k=99: ⌈log_99(100)⌉ = 1 pass
- Buffers: 10KB each (many seeks!)
- Seeks per block: 99
- Time: 1 × (1000 × 10ms × 99 + 10GB/100MB/s) = 990s

Optimal around k=10-20 for these parameters`,
        commonMistakes: [
          'Always choosing maximum k = M/B - 1',
          'Ignoring seek time in I/O calculations',
          'Not accounting for output buffer in memory',
          'Forgetting double buffering benefits'
        ]
      }
    ],
    summary: 'External sorting minimizes expensive I/O operations through run generation and multi-way merging. Master the I/O model, understand why loser trees double run length, and know how to choose optimal merge order k.',
    references: [
      'Knuth, "The Art of Computer Programming, Vol. 3: Sorting and Searching", Section 5.4',
      'Aggarwal & Vitter, "The Input/Output Complexity of Sorting", Communications of the ACM, 1988',
      'Arge, "External Memory Data Structures", Handbook of Massive Data Sets, 2002'
    ]
  },

  binomialHeaps: {
    title: 'Binomial Heaps',
    icon: '🌲',
    level: 'Advanced',
    readingTime: '45 min',
    sections: [
      {
        id: 'binomial-intro',
        title: 'Binomial Heap Motivation',
        content: `Binomial heaps achieve efficient heap melding through a forest of binomial trees, each with a unique degree. This structure enables O(log n) meld, insert, and delete operations with elegant binary arithmetic.

The key insight: represent heap sizes in binary, where bit i indicates presence of a binomial tree of degree i. Melding becomes binary addition with carries, providing both theoretical elegance and practical efficiency.

Binomial heaps form the foundation for Fibonacci heaps and are used in network optimization algorithms, parallel algorithms, and when frequent melding is required.`,
        keyPoints: [
          'Forest of binomial trees with unique degrees',
          'Heap size in binary determines tree structure',
          'O(log n) worst-case for all operations',
          'Melding corresponds to binary addition',
          'Precursor to Fibonacci heaps'
        ],
        examTips: [
          'Draw binomial trees B₀, B₁, B₂, B₃ from memory',
          'Remember: Bₖ has 2^k nodes and height k',
          'Melding = binary addition with tree carries',
          'Know binomial coefficient property of trees'
        ]
      },
      {
        id: 'binomial-trees',
        title: 'Binomial Tree Structure',
        content: `A binomial tree Bₖ is recursively defined: B₀ is a single node; Bₖ is formed by linking two Bₖ₋₁ trees, making one the leftmost child of the other's root.

This recursive structure yields remarkable properties: Bₖ has exactly 2^k nodes, height k, and the number of nodes at depth i equals the binomial coefficient C(k,i) - hence the name "binomial" tree.`,
        formula: '|Bₖ| = 2^k nodes, height(Bₖ) = k',
        formulaExplanation: 'Nodes at depth i in Bₖ = C(k,i) = k!/(i!(k-i)!)',
        example: `Binomial Trees B₀ through B₃:

B₀:  5

B₁:  3
     |
     7

B₂:  2
    /|
   6 4
   |
   8

B₃:      1
      / | \\
     9  5  3
    /|  |
   10 7 11
   |
   12

Properties verified:
- B₀: 2^0 = 1 node, height 0
- B₁: 2^1 = 2 nodes, height 1
- B₂: 2^2 = 4 nodes, height 2
- B₃: 2^3 = 8 nodes, height 3`,
        proof: `Binomial Coefficient Property Proof:
Claim: Bₖ has C(k,i) nodes at depth i.

Base: B₀ has C(0,0) = 1 node at depth 0. ✓

Induction: Assume true for Bₖ₋₁.
Bₖ = Bₖ₋₁ linked with another Bₖ₋₁
Nodes at depth i in Bₖ come from:
- Depth i in first Bₖ₋₁: C(k-1,i) nodes
- Depth i-1 in second Bₖ₋₁: C(k-1,i-1) nodes

Total = C(k-1,i) + C(k-1,i-1) = C(k,i)
(Pascal's identity) ∎`,
        keyPoints: [
          'Recursive definition: Bₖ = link(Bₖ₋₁, Bₖ₋₁)',
          'Root has k children: Bₖ₋₁, Bₖ₋₂, ..., B₁, B₀',
          'Binomial coefficient gives node distribution',
          'Max degree of any node is log n'
        ]
      },
      {
        id: 'heap-structure',
        title: 'Binomial Heap Organization',
        content: `A binomial heap is a forest of heap-ordered binomial trees with distinct degrees. For n elements, the binary representation of n determines which trees are present: bit i = 1 means Bᵢ is present.

This bijection between binary numbers and heap structure is the key to understanding binomial heap operations. A heap with 13 elements (1101₂) contains B₃, B₂, and B₀.`,
        example: `Binomial Heap with n = 13 elements:
13 = 1101₂ = 8 + 4 + 1

Forest contains:
- B₃ (8 nodes)  Root: min₁
- B₂ (4 nodes)  Root: min₂
- B₀ (1 node)   Root: min₃

Overall minimum = min(min₁, min₂, min₃)

Root list: [B₃] → [B₂] → [B₀]
           ↓
    (heap-ordered trees)

Maximum trees: ⌊log₂ n⌋ + 1
Root degree: at most ⌊log₂ n⌋`,
        keyPoints: [
          'At most ⌊log₂ n⌋ + 1 trees in heap',
          'Each tree has unique degree',
          'Trees linked in increasing degree order',
          'Minimum is among root list'
        ]
      },
      {
        id: 'meld-algorithm',
        title: 'Melding as Binary Addition',
        content: `Melding two binomial heaps mirrors binary addition with carries. When two trees of the same degree meet, they link to form a tree of the next degree - exactly like adding bits with carry.

This elegant correspondence makes melding both conceptually simple and efficient. The algorithm walks through both root lists, linking trees of equal degree and propagating carries.`,
        example: `Meld H₁ (5 elements) with H₂ (7 elements):
H₁: 5 = 101₂ → B₂, B₀
H₂: 7 = 111₂ → B₂, B₁, B₀

Binary addition:
  101
+ 111
-----
 1100

Step-by-step:
1. B₀ + B₀ = carry B₁ (link trees)
2. 0 + B₁ + carry = B₁ + B₁ = carry B₂
3. B₂ + B₂ + carry = B₂ + carry B₃
4. Result: B₃, B₂ → 12 elements (1100₂)

Linking Rule:
link(Bₖ, Bₖ) → Bₖ₊₁
Smaller root becomes parent`,
        complexity: {
          'Meld': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'Links': { worst: 'O(log n)', amortized: '-', space: '-' },
          'Comparisons': { worst: 'O(log n)', amortized: 'O(log n)', space: '-' }
        },
        proof: `Meld Complexity Proof:
Maximum trees in each heap: ⌊log n₁⌋ + 1 and ⌊log n₂⌋ + 1
Each tree processed once, possibly generating carry.
Total trees examined ≤ 2(⌊log n⌋ + 1)
Each link operation: O(1)
Therefore: O(log n) time ∎`
      },
      {
        id: 'operations',
        title: 'Core Operations',
        content: `All binomial heap operations leverage the meld primitive. Insert melds with a single-element heap. DeleteMin removes a root, converting its children to a new heap, then melds with the remaining heap.

DecreaseKey bubbles up like standard heaps. The amortized analysis shows these operations have excellent performance, especially when combined with lazy evaluation in Fibonacci heaps.`,
        example: `Insert(x):
1. Create B₀ with element x
2. Meld with main heap
3. Time: O(log n) worst, O(1) amortized

DeleteMin():
1. Find minimum among roots: O(log n)
2. Remove min root, get children
3. Children form new heap H'
4. Meld H' with remaining heap
5. Time: O(log n)

DecreaseKey(node, delta):
1. Decrease node.key by delta
2. Bubble up maintaining heap order
3. Time: O(log n)

Example DeleteMin with 15 elements:
15 = 1111₂ → B₃, B₂, B₁, B₀
Remove B₂ root (was minimum)
Children of B₂: B₁, B₀
New heap: B₃, B₁, B₀ (from original)
         + B₁, B₀ (children)
Meld: B₃, (B₁+B₁=B₂), (B₀+B₀+carry=B₁)
Result: B₃, B₂, B₁ → 11 elements`,
        keyPoints: [
          'All operations use meld as foundation',
          'Insert has O(1) amortized time',
          'DeleteMin involves child-forest melding',
          'DecreaseKey uses standard bubbling'
        ]
      },
      {
        id: 'pairwise-combine',
        title: 'Pairwise Combine Optimization',
        content: `The pairwise combine operation consolidates trees of the same degree throughout the heap, reducing the root list to at most one tree per degree. This is crucial for maintaining efficiency.

The algorithm uses an array indexed by degree, placing each tree in its slot and linking when collisions occur. This process continues until no two trees share the same degree.`,
        example: `Pairwise Combine Algorithm:
degree[] = array of size log n

for each tree T in root list:
  d = degree(T)
  while degree[d] ≠ null:
    T = link(T, degree[d])
    degree[d] = null
    d++
  degree[d] = T

Example with 4 B₁ trees:
Initial: B₁, B₁, B₁, B₁
Step 1: B₁ + B₁ → B₂, remaining: B₂, B₁, B₁
Step 2: B₁ + B₁ → B₂, remaining: B₂, B₂
Step 3: B₂ + B₂ → B₃
Final: B₃ (all consolidated)

Time: O(log n) as at most log n distinct degrees`,
        keyPoints: [
          'Ensures at most one tree per degree',
          'Uses degree-indexed array for efficiency',
          'Essential for Fibonacci heap optimization',
          'Reduces root list to O(log n) size'
        ]
      }
    ],
    summary: 'Binomial heaps elegantly map binary arithmetic to heap operations through binomial tree forests. Master the recursive tree structure, understand melding as addition with carries, and appreciate how all operations build on the meld primitive.',
    references: [
      'Vuillemin, "A Data Structure for Manipulating Priority Queues", Communications of the ACM, 1978',
      'Brown, "Implementation and Analysis of Binomial Queue Algorithms", SIAM J. Computing, 1978',
      'Cormen et al., "Introduction to Algorithms", Chapter 19'
    ]
  },

  huffmanTrees: {
    title: 'Huffman Trees & Compression',
    icon: '🗜️',
    level: 'Intermediate',
    readingTime: '35 min',
    sections: [
      {
        id: 'compression-intro',
        title: 'Compression Fundamentals',
        content: `Huffman coding achieves optimal prefix-free compression by assigning shorter codes to more frequent symbols. This fundamental algorithm appears in ZIP files, JPEG images, MP3 audio, and countless other applications.

The key insight: build a binary tree where frequent symbols have shorter paths from root to leaf. The path itself (left=0, right=1) becomes the symbol's binary code. No code is a prefix of another, enabling unambiguous decoding.

Huffman coding typically achieves 20-90% compression depending on data redundancy, approaching the theoretical limit given by Shannon's entropy.`,
        formula: 'Average bits = Σ(frequency_i × depth_i)',
        formulaExplanation: 'Minimized when frequent symbols have small depth',
        keyPoints: [
          'Optimal prefix-free variable-length encoding',
          'Greedy algorithm builds optimal tree bottom-up',
          'No code is prefix of another (prefix-free property)',
          'Compression ratio depends on symbol frequency skew',
          'Foundation for many practical compression schemes'
        ]
      },
      {
        id: 'huffman-algorithm',
        title: 'Tree Construction Algorithm',
        content: `Huffman's algorithm greedily builds an optimal tree bottom-up by repeatedly combining the two least frequent nodes. This seemingly simple strategy provably produces an optimal prefix code.

The algorithm uses a priority queue to efficiently find minimum frequency nodes. Each merge creates an internal node whose frequency equals the sum of its children's frequencies.`,
        example: `Huffman Tree Construction:
Symbols: A(45), B(13), C(12), D(16), E(9), F(5)

Step 1: Combine F(5) + E(9) = 14
Step 2: Combine C(12) + B(13) = 25
Step 3: Combine [F,E](14) + D(16) = 30
Step 4: Combine [C,B](25) + [F,E,D](30) = 55
Step 5: Combine A(45) + [...](55) = 100

Final Tree:
         100
        /    \\
      A(45)   55
             /  \\
           25    30
          / \\   / \\
        C   B  14  D
              / \\
             E   F

Codes:
A: 0 (1 bit × 45 = 45)
C: 100 (3 bits × 12 = 36)
B: 101 (3 bits × 13 = 39)
E: 1100 (4 bits × 9 = 36)
F: 1101 (4 bits × 5 = 20)
D: 111 (3 bits × 16 = 48)
Total: 224 bits vs 300 fixed`,
        proof: `Optimality Proof (Sketch):
1. Least frequent symbols must be deepest leaves
2. Can assume they are siblings (rearrange if not)
3. Their parent has combined frequency
4. Inductively, merging least frequent maintains optimality
5. Greedy choice property + optimal substructure = optimal solution ∎`
      },
      {
        id: 'implementation',
        title: 'Efficient Implementation',
        content: `Implementing Huffman coding requires careful attention to the priority queue, tree representation, and code generation. Using a min-heap for the priority queue gives O(n log n) construction time.

For decoding efficiency, some implementations use lookup tables for common prefixes, trading space for speed. Canonical Huffman codes enable even more compact code table storage.`,
        example: `Implementation with Min-Heap:

class HuffmanNode:
  char symbol
  int frequency
  HuffmanNode left, right

function buildHuffmanTree(frequencies):
  heap = MinHeap()

  // Create leaf nodes
  for each (symbol, freq) in frequencies:
    heap.insert(new HuffmanNode(symbol, freq))

  // Build tree
  while heap.size > 1:
    left = heap.extractMin()
    right = heap.extractMin()

    parent = new HuffmanNode(null,
                    left.freq + right.freq)
    parent.left = left
    parent.right = right

    heap.insert(parent)

  return heap.extractMin() // root

function generateCodes(root):
  codes = {}
  traverse(root, "")

  function traverse(node, code):
    if node.isLeaf():
      codes[node.symbol] = code
    else:
      traverse(node.left, code + "0")
      traverse(node.right, code + "1")

  return codes`,
        complexity: {
          'Build Tree': { worst: 'O(n log n)', amortized: '-', space: 'O(n)' },
          'Generate Codes': { worst: 'O(n)', amortized: '-', space: 'O(n)' },
          'Encode': { worst: 'O(n)', amortized: 'O(1)', space: 'O(1)' },
          'Decode': { worst: 'O(n)', amortized: 'O(1)', space: 'O(1)' }
        }
      },
      {
        id: 'adaptive-huffman',
        title: 'Adaptive Huffman Coding',
        content: `Adaptive Huffman coding updates the tree dynamically as symbols are processed, eliminating the need to transmit the frequency table. This one-pass algorithm is ideal for streaming data or when symbol frequencies are unknown.

The key challenge is maintaining tree optimality while updating frequencies. The sibling property and node numbering scheme enable efficient updates in O(log n) time per symbol.`,
        example: `Adaptive Algorithm (FGK):
1. Start with single NYT (Not Yet Transmitted) node
2. For each symbol:
   - If new: split NYT, add symbol
   - If seen: increment count
   - Update tree maintaining sibling property
3. Sibling property: nodes numbered by level-order have non-increasing weights

Update procedure:
- Find node to increment
- If violates ordering, swap with appropriate node
- Increment and propagate to root`,
        keyPoints: [
          'Single-pass algorithm, no frequency table needed',
          'Tree adapts to changing symbol distributions',
          'O(log n) update per symbol',
          'Used in FAX machines and modems'
        ]
      },
      {
        id: 'entropy-bounds',
        title: 'Theoretical Bounds',
        content: `Huffman coding achieves compression within 1 bit per symbol of Shannon's entropy lower bound. For symbol set S with probabilities p_i, entropy H(S) = -Σ(p_i × log₂ p_i) bits.

No prefix-free code can achieve better than entropy, and Huffman coding gets remarkably close. The worst case occurs when all probabilities are powers of 2, where Huffman achieves exactly entropy.`,
        formula: 'H(S) ≤ Average(Huffman) < H(S) + 1',
        formulaExplanation: 'H(S) = entropy = theoretical minimum bits per symbol',
        proof: `Bound Proof:
Let L_i = length of code for symbol i
Average length L = Σ(p_i × L_i)

Lower bound: L ≥ H(S) (Shannon's theorem)

Upper bound: Huffman assigns L_i = ⌈-log₂ p_i⌉
L = Σ(p_i × L_i) < Σ(p_i × (-log₂ p_i + 1))
  = H(S) + 1

Therefore: H(S) ≤ L < H(S) + 1 ∎`,
        examTips: [
          'Calculate entropy: -Σ(p × log₂ p)',
          'Huffman length within 1 bit of entropy',
          'Equal frequencies → balanced tree → log₂ n bits',
          'Skewed frequencies → unbalanced tree → better compression'
        ]
      }
    ],
    summary: 'Huffman coding optimally compresses data through frequency-based variable-length encoding. Master the greedy tree construction, understand the prefix-free property, and know the entropy bounds that prove optimality.',
    references: [
      'Huffman, "A Method for the Construction of Minimum-Redundancy Codes", Proceedings of the IRE, 1952',
      'Cover & Thomas, "Elements of Information Theory", Chapter 5',
      'Sayood, "Introduction to Data Compression", Morgan Kaufmann'
    ]
  },

  cacheOptimization: {
    title: 'Cache-Efficient Algorithms',
    icon: '💾',
    level: 'Graduate',
    readingTime: '45 min',
    sections: [
      {
        id: 'memory-hierarchy',
        title: 'Modern Memory Hierarchy',
        content: `Modern computers have multi-level memory hierarchies with dramatic speed differences: L1 cache (1ns), L2 cache (4ns), L3 cache (10ns), RAM (100ns), SSD (100μs), HDD (10ms). Each level is 10-100x slower than the previous!

Cache-efficient algorithms minimize memory transfers between levels, often improving performance by orders of magnitude. The key is exploiting spatial and temporal locality: accessing nearby data (spatial) and reusing recent data (temporal).

Cache parameters: B = block/line size (typically 64 bytes), M = cache size (KB to MB), associativity (typically 4-16 way). Algorithms must adapt to these hardware constraints for optimal performance.`,
        formula: 'Cache Misses = Compulsory + Capacity + Conflict',
        formulaExplanation: 'Compulsory: first access, Capacity: working set > cache, Conflict: mapping collisions',
        keyPoints: [
          'Memory hierarchy has 6+ levels with huge speed gaps',
          'Cache misses cost 100-1000x more than cache hits',
          'Spatial locality: access contiguous memory',
          'Temporal locality: reuse recently accessed data',
          'Cache-oblivious algorithms work for any cache size'
        ]
      },
      {
        id: 'cache-aware',
        title: 'Cache-Aware Data Structures',
        content: `Cache-aware structures explicitly optimize for known cache parameters. The B-tree variant B⁺-tree aligns node size with cache blocks, packing maximum keys per cache line. This reduces tree height and cache misses.

Array layouts matter enormously: row-major vs column-major traversal can differ by 100x in performance! Tile/block algorithms partition data to fit in cache, processing each tile completely before moving to the next.`,
        example: `Cache-Aware Heap Layout:
Standard: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
Parent(i) = i/2, Children = 2i, 2i+1

Cache-Aware d-Heap (d=B/sizeof(element)):
d=4: [1|2,3,4,5|6,7,8,9|10,11,12,13|...]
- Each node has d children
- Node fits in one cache line
- Height = log_d(n) vs log_2(n)
- Fewer cache misses per operation

Matrix Multiplication Tiling:
// Naive: O(n³) ops, O(n³/B) cache misses
for i = 1 to n:
  for j = 1 to n:
    for k = 1 to n:
      C[i,j] += A[i,k] * B[k,j]

// Tiled: O(n³) ops, O(n³/(B√M)) misses
for ii = 1 to n by T:
  for jj = 1 to n by T:
    for kk = 1 to n by T:
      // Process T×T tile
      for i = ii to min(ii+T-1, n):
        for j = jj to min(jj+T-1, n):
          for k = kk to min(kk+T-1, n):
            C[i,j] += A[i,k] * B[k,j]`,
        complexity: {
          'd-Heap Insert': { worst: 'O(log_d n)', cache: 'O(log_d n / B)', space: 'O(1)' },
          'Matrix Multiply': { worst: 'O(n³)', cache: 'O(n³/(B√M))', space: 'O(1)' },
          'B⁺-Tree Search': { worst: 'O(log_B n)', cache: 'O(log_B n)', space: 'O(1)' }
        }
      },
      {
        id: 'cache-oblivious',
        title: 'Cache-Oblivious Algorithms',
        content: `Cache-oblivious algorithms achieve optimal cache performance without knowing cache parameters! They work well for any cache size or block size, crucial for portable performance across different hardware.

The key technique is recursive divide-and-conquer with careful layout. The recursion naturally creates working sets of all sizes, automatically adapting to each cache level.`,
        example: `Cache-Oblivious Matrix Transpose:
// Recursive divide until base case
function transpose(A, i, j, m, n):
  if m * n ≤ THRESHOLD:
    // Base: transpose small block
    for r = i to i+m-1:
      for c = j to j+n-1:
        B[c,r] = A[r,c]
  else if m ≥ n:
    // Divide rows
    transpose(A, i, j, m/2, n)
    transpose(A, i+m/2, j, m/2, n)
  else:
    // Divide columns
    transpose(A, i, j, m, n/2)
    transpose(A, i, j+n/2, m, n/2)

Analysis:
- Recursion creates all block sizes
- Some level fits perfectly in cache
- O(mn/B) cache misses (optimal!)
- Works for ANY cache parameters`,
        proof: `Cache-Oblivious Optimality:
Tall-Cache Assumption: M ≥ B² (cache holds ≥ B blocks)

For recursive algorithm with recurrence:
T(n) = a·T(n/b) + f(n)

If working set n/b^k ≤ M at recursion level k:
- Entire subproblem fits in cache
- No cache misses except compulsory
- Happens for k = log_b(n/M)

Total cache misses:
Q(n) = O(n/B) when n ≤ M (base case)
Q(n) = a·Q(n/b) + O(1) when n > M

Solves to optimal bound for many problems ∎`
      },
      {
        id: 'veb-layout',
        title: 'Van Emde Boas Layout',
        content: `The van Emde Boas (vEB) layout recursively arranges binary trees for optimal cache performance. Instead of level-order or in-order, it groups subtrees that are accessed together, minimizing cache misses during traversal.

A complete binary tree of height h is split at height h/2, creating √n top tree and √n bottom trees of size √n each. This recursive decomposition continues until trees fit in cache blocks.`,
        example: `vEB Layout Example (height 4):
Standard level-order:
[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

vEB recursive layout:
         1          <- Top tree (√n size)
       /   \\
      2     3
    /  |   |  \\
   4   5   6   7    <- Split point

Bottom trees:
[4,8,9] [5,10,11] [6,12,13] [7,14,15]

Memory layout:
[1,2,3 | 4,8,9 | 5,10,11 | 6,12,13 | 7,14,15]
  Top    BT1      BT2       BT3       BT4

Benefits:
- Path from root to leaf: O(log_B n) blocks
- Range query touches O(k/B + log_B n) blocks
- Optimal for unknown B!`,
        keyPoints: [
          'Recursive √n decomposition of tree',
          'Groups frequently accessed nodes',
          'O(log_B n) cache misses per search',
          'Cache-oblivious: works for any B'
        ]
      },
      {
        id: 'practical-tips',
        title: 'Practical Optimization Tips',
        content: `Real-world cache optimization requires understanding both hardware and algorithms. Profile before optimizing - cache misses may not be your bottleneck! Use performance counters to measure actual cache behavior.

Key techniques: structure packing (eliminate padding), array-of-structs vs struct-of-arrays (AoS vs SoA), prefetching hints, NUMA awareness, and avoiding false sharing in parallel code.`,
        example: `Practical Optimizations:

1. Structure Packing:
// Before: 24 bytes (padding!)
struct Node {
  char flag;     // 1 byte
  // 7 bytes padding
  double value;  // 8 bytes
  int count;     // 4 bytes
  // 4 bytes padding
};

// After: 16 bytes (optimal)
struct Node {
  double value;  // 8 bytes
  int count;     // 4 bytes
  char flag;     // 1 byte
  // 3 bytes padding
} __attribute__((packed));

2. AoS vs SoA:
// Array of Structs (poor locality)
struct Point { float x, y, z; };
Point points[1000];
for (i = 0; i < 1000; i++)
  sum += points[i].x;  // Wastes cache

// Struct of Arrays (good locality)
struct Points {
  float x[1000], y[1000], z[1000];
} points;
for (i = 0; i < 1000; i++)
  sum += points.x[i];  // Efficient!

3. Loop Tiling/Blocking:
// Process data in cache-sized chunks
for (i = 0; i < n; i += TILE)
  for (j = 0; j < n; j += TILE)
    for (ii = i; ii < min(i+TILE,n); ii++)
      for (jj = j; jj < min(j+TILE,n); jj++)
        process(A[ii][jj]);`,
        examTips: [
          'Know cache miss types: compulsory, capacity, conflict',
          'Remember tall-cache assumption: M ≥ B²',
          'vEB layout: recursive √n splitting',
          'Cache-oblivious means no hardcoded parameters'
        ]
      }
    ],
    summary: 'Cache-efficient algorithms exploit memory hierarchy for massive speedups. Master the cache-aware vs cache-oblivious distinction, understand recursive layouts like vEB, and know practical optimization techniques.',
    references: [
      'Frigo et al., "Cache-Oblivious Algorithms", FOCS 1999',
      'Prokop, "Cache-Oblivious Algorithms", MIT Masters Thesis, 1999',
      'Aggarwal & Vitter, "The I/O Complexity of Sorting", Communications of the ACM, 1988'
    ]
  },

  minMaxHeaps: {
    title: 'Min-Max Heaps',
    icon: '🔄',
    level: 'Intermediate',
    readingTime: '30 min',
    sections: [
      {
        id: 'minmax-intro',
        title: 'Min-Max Heap Concept',
        content: `Min-max heaps provide O(log n) access to both minimum and maximum elements using a single tree with alternating min/max levels. Even levels (including root) are min-levels where elements are smaller than descendants; odd levels are max-levels where elements are larger than descendants.

This elegant structure achieves DEPQ functionality with simpler implementation than interval heaps. The alternating level property creates natural boundaries that simplify correctness proofs and implementations.`,
        keyPoints: [
          'Single complete binary tree structure',
          'Alternating min-levels (even) and max-levels (odd)',
          'Root at level 0 contains global minimum',
          'Maximum is at level 1 (among root\'s children)',
          'Simple array representation like standard heaps'
        ],
        example: `Min-Max Heap Structure:
Level 0 (min):        2
Level 1 (max):      /   \\
                   85    45
Level 2 (min):    /  \\  /  \\
                 14  20 31  40
Level 3 (max):  / \\  /
               75 18 25

Properties verified:
- Level 0: 2 ≤ all descendants ✓
- Level 1: 85 ≥ {14,20,75,18}, 45 ≥ {31,40,25} ✓
- Level 2: 14 ≤ {75,18}, 20 ≤ {25}, etc. ✓`
      },
      {
        id: 'minmax-operations',
        title: 'Operations',
        content: `Min-max heap operations determine whether a node is on a min-level or max-level (using floor(log₂(i))), then apply the appropriate comparison. Insertion bubbles up alternating between min and max comparisons.

Deletion is more complex: after replacing with the last element, we may need to bubble up (if violating parent) or trickle down (if violating children). The trickle-down process must consider both children and grandchildren.`,
        example: `Insert 10:
1. Add at position 8 (level 3, max-level)
2. Parent at 4 (level 2, min-level) has value 20
3. 10 < 20, swap and continue at min-level
4. Grandparent at 1 has value 85 (max-level)
5. 10 < 85, continue up
6. Parent at 0 has value 2
7. 10 > 2, stop

DeleteMin:
1. Remove root value 2
2. Move last element (25) to root
3. Find smallest child/grandchild
4. If grandchild: swap and recurse
5. If child: swap if needed, stop`,
        complexity: {
          'FindMin': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'FindMax': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'Insert': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' },
          'DeleteMin/Max': { worst: 'O(log n)', amortized: 'O(log n)', space: 'O(1)' }
        }
      }
    ],
    summary: 'Min-max heaps elegantly solve the DEPQ problem through alternating level constraints. Simpler than interval heaps but with similar performance.',
    references: [
      'Atkinson et al., "Min-Max Heaps and Generalized Priority Queues", Communications of the ACM, 1986'
    ]
  },

  deaps: {
    title: 'Deaps (Double-Ended Heaps)',
    icon: '🌳',
    level: 'Intermediate',
    readingTime: '25 min',
    sections: [
      {
        id: 'deap-structure',
        title: 'Deap Structure',
        content: `A deap is a complete binary tree where the root is empty, the left subtree is a min-heap, and the right subtree is a max-heap. Additionally, each node in the min-heap has a corresponding node in the max-heap with a greater or equal value.

This correspondence property ensures that elements are properly distributed between the two heaps. The empty root simplifies index calculations: left child of i is 2i, right child is 2i+1, exactly like standard heaps.`,
        example: `Deap Example:
           (empty)
          /       \\
      (min-heap) (max-heap)
        3           85
       / \\         /  \\
      7   12      70   45
     / \\ / \\     / \\  /
    9 10 15 20  65 30 25

Correspondence verified:
- 3 ↔ 85 (3 ≤ 85) ✓
- 7 ↔ 70 (7 ≤ 70) ✓
- 12 ↔ 45 (12 ≤ 45) ✓
- Each min node ≤ corresponding max node`,
        keyPoints: [
          'Root is always empty (index 1)',
          'Left subtree (starting at 2) is min-heap',
          'Right subtree (starting at 3) is max-heap',
          'Correspondence: min[i] ≤ max[j] for paired nodes',
          'Simple index math: left=2i, right=2i+1'
        ]
      },
      {
        id: 'deap-correspondence',
        title: 'Correspondence Calculation',
        content: `The correspondence between min-heap and max-heap nodes follows a pattern based on tree positions. For a node at position i in the min-heap, its corresponding max-heap node j is found by mirroring the path from root.

If i is at position 2^k + m in the min-heap, then j = 3×2^(k-1) + m in the max-heap. This ensures balanced distribution and maintains the DEPQ properties efficiently.`,
        formula: 'j = i + 2^(⌊log₂(i)⌋-1) for min→max correspondence',
        example: `Finding Correspondence:
Min node at position 6:
- 6 = 4 + 2 = 2² + 2
- k = 2, m = 2
- Max node: 3×2^(2-1) + 2 = 3×2 + 2 = 8

Verification:
Position 6 (left subtree) ↔ Position 8 (right subtree)
Both at same relative position in their heaps`
      }
    ],
    summary: 'Deaps provide DEPQ functionality through dual min/max heaps with correspondence. The empty root and correspondence property ensure efficient operations.',
    references: [
      'Carlsson, "The Deap: A Double-Ended Heap", IPL 1987'
    ]
  },

  binPacking: {
    title: 'Bin Packing Algorithms',
    icon: '📦',
    level: 'Advanced',
    readingTime: '40 min',
    sections: [
      {
        id: 'binpack-intro',
        title: 'Bin Packing Problem',
        content: `Bin packing is a classic NP-hard optimization problem: pack items of various sizes into minimum number of fixed-capacity bins. Applications include container loading, memory allocation, cloud resource scheduling, and file storage.

The offline version knows all items in advance; online version must pack items as they arrive without knowledge of future items. No polynomial-time algorithm can guarantee optimal solutions, but sophisticated heuristics achieve near-optimal results in practice.`,
        keyPoints: [
          'NP-hard: no efficient optimal algorithm known',
          'Online: must pack without seeing future items',
          'Offline: can sort and optimize with full knowledge',
          'Approximation ratios measure algorithm quality',
          'Lower bound: ⌈Σ(item sizes) / bin capacity⌉'
        ]
      },
      {
        id: 'online-algorithms',
        title: 'Online Bin Packing',
        content: `Online algorithms must irreversibly assign items to bins upon arrival. First Fit (FF) places in first bin with space; Best Fit (BF) uses fullest bin with space; Worst Fit (WF) uses emptiest bin with space.

These simple strategies guarantee at most 1.7×OPT bins. More sophisticated algorithms like Harmonic achieve better bounds by classifying items by size ranges.`,
        example: `Online Algorithms Comparison:
Items: [0.5, 0.7, 0.5, 0.2, 0.4, 0.2, 0.3, 0.1]
Capacity: 1.0

First Fit:
Bin 1: [0.5, 0.2, 0.2, 0.1] = 1.0
Bin 2: [0.7, 0.3] = 1.0
Bin 3: [0.5, 0.4] = 0.9
Result: 3 bins

Best Fit:
Bin 1: [0.5, 0.5] = 1.0
Bin 2: [0.7, 0.2, 0.1] = 1.0
Bin 3: [0.4, 0.2, 0.3] = 0.9
Result: 3 bins

Optimal (offline):
Bin 1: [0.7, 0.3] = 1.0
Bin 2: [0.5, 0.5] = 1.0
Bin 3: [0.4, 0.2, 0.2, 0.1] = 0.9
Result: 3 bins (same!)`,
        complexity: {
          'First Fit': { worst: 'O(n log n)', ratio: '1.7', space: 'O(n)' },
          'Best Fit': { worst: 'O(n log n)', ratio: '1.7', space: 'O(n)' },
          'Harmonic': { worst: 'O(n)', ratio: '1.691', space: 'O(n)' }
        }
      },
      {
        id: 'offline-algorithms',
        title: 'Offline Bin Packing',
        content: `Offline algorithms can sort items and plan globally. First Fit Decreasing (FFD) sorts items descending, then applies First Fit. This simple change improves the approximation ratio to 1.222×OPT.

More sophisticated algorithms use dynamic programming for small instances or column generation for large instances, achieving near-optimal solutions at higher computational cost.`,
        example: `First Fit Decreasing:
Items: [0.7, 0.5, 0.5, 0.4, 0.3, 0.2, 0.2, 0.1]
Sorted: [0.7, 0.5, 0.5, 0.4, 0.3, 0.2, 0.2, 0.1]

FFD Packing:
1. Place 0.7 → Bin 1: [0.7]
2. Place 0.5 → Bin 2: [0.5]
3. Place 0.5 → Bin 3: [0.5]
4. Place 0.4 → Bin 2: [0.5, 0.4]
5. Place 0.3 → Bin 1: [0.7, 0.3]
6. Place 0.2 → Bin 3: [0.5, 0.2]
7. Place 0.2 → Bin 3: [0.5, 0.2, 0.2]
8. Place 0.1 → Bin 2: [0.5, 0.4, 0.1]

Result: 3 bins (optimal!)
All bins: 1.0, 1.0, 0.9`,
        proof: `FFD Approximation Bound:
Theorem: FFD uses at most ⌈11/9 × OPT⌉ + 6/9 bins.

Key insight: Large items (> 1/2) go in separate bins.
Medium items (1/3 to 1/2) pack efficiently.
Small items fill remaining space.

Proof sketch:
1. Items > 2/3: at most one per bin
2. Items > 1/2: at most OPT such items
3. Items ≤ 1/2: FFD packs near-optimally
4. Detailed case analysis yields 11/9 ratio ∎`
      }
    ],
    summary: 'Bin packing requires clever heuristics for NP-hard optimization. Online algorithms achieve 1.7× optimal; offline FFD achieves 1.222× optimal with simple sorting.',
    references: [
      'Johnson, "Near-Optimal Bin Packing Algorithms", MIT PhD Thesis, 1973',
      'Coffman et al., "Approximation Algorithms for Bin Packing", 1996'
    ]
  },

  expressionTrees: {
    title: 'Expression Trees & Parsing',
    icon: '🌲',
    level: 'Intermediate',
    readingTime: '35 min',
    sections: [
      {
        id: 'expression-intro',
        title: 'Expression Representations',
        content: `Expression trees represent mathematical and logical expressions as binary trees, enabling efficient evaluation, optimization, and transformation. Internal nodes are operators; leaves are operands.

Three main traversal orders yield different notations: inorder gives infix (needs parentheses), preorder gives prefix (Polish notation), and postorder gives postfix (Reverse Polish notation). Each has unique advantages for parsing and evaluation.`,
        example: `Expression: (3 + 4) × (5 - 2)

Expression Tree:
         ×
       /   \\
      +     -
     / \\   / \\
    3   4 5   2

Traversals:
Infix:   3 + 4 × 5 - 2 (ambiguous!)
         ((3 + 4) × (5 - 2)) (with parens)
Prefix:  × + 3 4 - 5 2
Postfix: 3 4 + 5 2 - ×`,
        keyPoints: [
          'Internal nodes: operators with precedence/associativity',
          'Leaves: variables, constants, or sub-expressions',
          'Unambiguous representation of expressions',
          'Enables algebraic simplification and optimization',
          'Foundation for compilers and interpreters'
        ]
      },
      {
        id: 'shunting-yard',
        title: 'Shunting Yard Algorithm',
        content: `Dijkstra's Shunting Yard algorithm converts infix to postfix notation using a stack for operators and precedence rules. It handles parentheses and operator precedence elegantly, making it ideal for calculator and compiler implementations.

The algorithm uses the metaphor of railroad shunting: operators wait in a holding track (stack) until their precedence allows them to proceed to the output.`,
        example: `Convert: 3 + 4 × 2 / (1 - 5)^2

Token | Stack    | Output
------|----------|------------------
3     | []       | 3
+     | [+]      | 3
4     | [+]      | 3 4
×     | [+,×]    | 3 4
2     | [+,×]    | 3 4 2
/     | [+,/]    | 3 4 2 ×
(     | [+,/,(]  | 3 4 2 ×
1     | [+,/,(]  | 3 4 2 × 1
-     | [+,/,(,-]| 3 4 2 × 1
5     | [+,/,(,-]| 3 4 2 × 1 5
)     | [+,/]    | 3 4 2 × 1 5 -
^     | [+,/,^]  | 3 4 2 × 1 5 -
2     | [+,/,^]  | 3 4 2 × 1 5 - 2
END   | []       | 3 4 2 × 1 5 - 2 ^ / +

Result: 3 4 2 × 1 5 - 2 ^ / +`,
        complexity: {
          'Parse': { worst: 'O(n)', amortized: 'O(n)', space: 'O(n)' },
          'Evaluate': { worst: 'O(n)', amortized: 'O(n)', space: 'O(n)' }
        }
      },
      {
        id: 'evaluation',
        title: 'Expression Evaluation',
        content: `Postfix expressions evaluate linearly using a stack: scan left-to-right, push operands, pop and apply operators. No parentheses or precedence needed - the notation encodes evaluation order.

Expression trees evaluate recursively: evaluate left subtree, right subtree, then apply root operator. This natural recursion enables optimizations like constant folding and common subexpression elimination.`,
        example: `Evaluate Postfix: 3 4 + 5 2 - ×

Step | Token | Stack    | Action
-----|-------|----------|------------------
1    | 3     | [3]      | Push 3
2    | 4     | [3,4]    | Push 4
3    | +     | [7]      | Pop 4,3; Push 3+4=7
4    | 5     | [7,5]    | Push 5
5    | 2     | [7,5,2]  | Push 2
6    | -     | [7,3]    | Pop 2,5; Push 5-2=3
7    | ×     | [21]     | Pop 3,7; Push 7×3=21

Result: 21

Tree Evaluation (recursive):
eval(×) = eval(+) × eval(-)
        = (eval(3) + eval(4)) × (eval(5) - eval(2))
        = (3 + 4) × (5 - 2)
        = 7 × 3
        = 21`
      }
    ],
    summary: 'Expression trees unambiguously represent and manipulate mathematical expressions. Master the three notations, Shunting Yard parsing, and stack-based evaluation.',
    references: [
      'Dijkstra, "Algol 60 Translation", 1961',
      'Aho et al., "Compilers: Principles, Techniques, and Tools"'
    ]
  },

  fibonacciHeaps: {
    title: 'Fibonacci Heaps',
    icon: '🌀',
    level: 'Graduate',
    readingTime: '50 min',
    sections: [
      {
        id: 'fib-motivation',
        title: 'Why Fibonacci Heaps?',
        content: `Fibonacci heaps achieve remarkable amortized time bounds: O(1) for insert, find-min, decrease-key, and meld operations. Only delete and delete-min require O(log n) amortized time. This makes them theoretically optimal for algorithms like Dijkstra's and Prim's.

The key innovation is lazy consolidation - deferring cleanup work until absolutely necessary. This laziness, combined with potential function analysis, yields superior amortized bounds despite potentially poor worst-case performance.

While complex to implement and having high constant factors, Fibonacci heaps demonstrate the power of amortization and lazy evaluation in algorithm design.`,
        keyPoints: [
          'O(1) amortized insert and decrease-key',
          'Lazy consolidation defers cleanup',
          'Marking scheme bounds degree',
          'Theoretically optimal for graph algorithms',
          'High constants limit practical use'
        ]
      },
      {
        id: 'fib-structure',
        title: 'Heap Structure',
        content: `A Fibonacci heap is a collection of heap-ordered trees with no structural constraints. Trees can have any shape, and the root list can contain many trees. This flexibility enables O(1) operations by simply postponing structural maintenance.

Each node tracks its degree, parent, children (circular doubly-linked list), and a mark bit. The mark indicates whether a node has lost a child since becoming a non-root. This marking scheme is crucial for maintaining the degree bound.`,
        example: `Fibonacci Heap Structure:

Root List: → [3] ↔ [7] ↔ [18] ↔ [24] ↔
              |     |      |      |
            trees  tree   leaf   tree

Tree at [3]:     3
               / | \\
              5  8  10
             /
            12

Node fields:
- key: element value
- degree: number of children
- mark: lost a child? (true/false)
- parent, child, left, right pointers

Min pointer → [3] (tracks minimum)`,
        complexity: {
          'Insert': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'Meld': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'FindMin': { worst: 'O(1)', amortized: 'O(1)', space: 'O(1)' },
          'DecreaseKey': { worst: 'O(n)', amortized: 'O(1)', space: 'O(1)' },
          'DeleteMin': { worst: 'O(n)', amortized: 'O(log n)', space: 'O(1)' }
        }
      },
      {
        id: 'fib-operations',
        title: 'Core Operations',
        content: `Insert and meld simply add trees to the root list - no consolidation needed! This laziness is key to O(1) amortized time. Delete-min removes the minimum, promotes its children to roots, then consolidates to ensure at most one tree per degree.

Decrease-key is the most sophisticated operation. It cuts the node from its parent and adds it to the root list. If the parent was already marked, it's also cut (cascading cut). This marking scheme ensures trees don't become too thin.`,
        example: `DecreaseKey with Cascading Cuts:

Initial: Parent P (marked) → Child C → Grandchild G

DecreaseKey(G, newValue):
1. Decrease G's key
2. If heap order violated:
   - Cut G from C, add to root list
   - If C unmarked: mark C
   - If C marked: cut C too (cascade)
3. Continue cascading up

Why cascading cuts?
- Ensures degree(node) = O(log n)
- Without: trees become paths
- With: max 2 children lost before cut`,
        proof: `Degree Bound Proof (Sketch):
Let F_k = k-th Fibonacci number.
Claim: A node of degree k has ≥ F_{k+2} descendants.

Base: Degree 0 has 1 ≥ F_2 = 1 node ✓

Induction: Node x with degree k
- Children added in order c_1, c_2, ..., c_k
- When c_i added, degree(x) ≥ i-1
- So degree(c_i) ≥ i-2 (loses at most 1 child)
- Size(x) ≥ 1 + Σ F_{i} = F_{k+2}

Since F_k grows exponentially:
degree ≤ log_φ(n) where φ = golden ratio ∎`
      },
      {
        id: 'fib-potential',
        title: 'Amortized Analysis',
        content: `The potential function Φ = t + 2m, where t = number of trees and m = number of marked nodes, elegantly captures the heap's "messiness". Operations that increase disorder pay upfront; cleanup operations get credit from accumulated potential.

This potential function is carefully designed so that expensive operations (consolidation, cascading cuts) are paid for by previous cheap operations that increased potential.`,
        formula: 'Φ = trees + 2×marks',
        example: `Amortized Costs:

Insert:
- Actual: O(1) (add to root list)
- ΔΦ = 1 (one more tree)
- Amortized = O(1) + 1 = O(1)

DecreaseKey:
- Actual: O(c) cascading cuts
- ΔΦ = c + 2 - 2c = 2 - c
- Amortized = O(c) + (2-c) = O(1)!

DeleteMin:
- Actual: O(D(n) + t) for consolidation
- ΔΦ ≤ D(n) + 1 - t
- Amortized = O(D(n)) = O(log n)`,
        keyPoints: [
          'Potential measures disorder',
          'Lazy operations increase potential',
          'Cleanup decreases potential',
          'Cascading cuts have O(1) amortized cost'
        ]
      }
    ],
    summary: 'Fibonacci heaps achieve optimal amortized bounds through lazy evaluation and clever marking. Master the potential analysis, understand cascading cuts, and appreciate why laziness enables efficiency.',
    references: [
      'Fredman & Tarjan, "Fibonacci Heaps and Their Uses", JACM 1987',
      'Cormen et al., "Introduction to Algorithms", Chapter 19'
    ]
  },

  splayTrees: {
    title: 'Splay Trees',
    icon: '🌲',
    level: 'Advanced',
    readingTime: '35 min',
    sections: [
      {
        id: 'splay-intro',
        title: 'Self-Adjusting BSTs',
        content: `Splay trees are self-adjusting binary search trees that move accessed nodes to the root through rotations. This simple strategy achieves O(log n) amortized time for all operations without storing any balance information.

The key insight: frequently accessed items naturally migrate toward the root, creating an implicit cache. The splaying operation's zig-zig and zig-zag cases ensure the tree becomes more balanced over time, not just moving nodes up.`,
        keyPoints: [
          'No balance information stored',
          'Recently accessed nodes near root',
          'O(log n) amortized for all operations',
          'Simple to implement',
          'Adapts to access patterns'
        ]
      },
      {
        id: 'splaying',
        title: 'The Splaying Operation',
        content: `Splaying moves a node to the root through a series of rotations. Unlike simple move-to-root, splaying uses special zig-zig and zig-zag patterns that improve balance. This is crucial for the amortized analysis.

Three cases: zig (parent is root), zig-zig (node and parent are same-side children), and zig-zag (node and parent are opposite-side children). The zig-zig case's double rotation is the key to rebalancing.`,
        example: `Splaying Cases:

Zig (terminal case):
    y                x
   / \\      zig     / \\
  x   C    ---->   A   y
 / \\                  / \\
A   B                B   C

Zig-Zig (both left children):
      z              x
     / \\            / \\
    y   D   zig    A   y
   / \\      zig        / \\
  x   C    ---->      B   z
 / \\                     / \\
A   B                   C   D

Zig-Zag (opposite sides):
    z                x
   / \\              / \\
  y   D    zig     y   z
 / \\       zag    / \\ / \\
A   x     ---->  A  B C  D
   / \\
  B   C

Key: Zig-zig does TWO rotations on same side!`,
        proof: `Access Theorem:
Total cost of m operations on n-node tree is O(m log n + n log n).

Uses potential Φ = Σ log(size(x)) for all nodes x.
Zig-zig case telescopes beautifully in analysis.`
      }
    ],
    summary: 'Splay trees achieve logarithmic amortized time through self-adjustment. The splaying operation\'s zig-zig pattern is crucial for maintaining balance without explicit bookkeeping.',
    references: [
      'Sleator & Tarjan, "Self-Adjusting Binary Search Trees", JACM 1985'
    ]
  },

  parallelAlgorithms: {
    title: 'Parallel Data Structures',
    icon: '🔀',
    level: 'Graduate',
    readingTime: '40 min',
    sections: [
      {
        id: 'parallel-intro',
        title: 'Concurrency Challenges',
        content: `Parallel data structures must handle concurrent operations from multiple threads while maintaining correctness and efficiency. Key challenges include race conditions, memory consistency, cache coherence, and scalability bottlenecks.

Modern approaches range from coarse-grained locking (simple but limited parallelism) to lock-free algorithms (complex but highly scalable). The choice depends on contention levels, operation mix, and hardware architecture.`,
        keyPoints: [
          'Race conditions require synchronization',
          'Cache coherence affects performance',
          'Lock-free algorithms avoid blocking',
          'Memory ordering matters',
          'Scalability vs simplicity tradeoff'
        ]
      },
      {
        id: 'concurrent-skip-lists',
        title: 'Lock-Free Skip Lists',
        content: `Skip lists naturally support concurrent operations because modifications are localized. Lock-free implementations use compare-and-swap (CAS) operations to atomically update pointers, avoiding locks entirely.

The key challenge is maintaining consistency during multi-pointer updates. Marking schemes and careful ordering ensure operations appear atomic despite being implemented as multiple steps.`,
        example: `Lock-Free Insert:

1. Find insertion position
2. Create new node
3. CAS to insert at each level (bottom-up)
4. If CAS fails, retry from step 1

Marking for Delete:
- Mark node logically deleted (bit in pointer)
- Then physically unlink
- Prevents lost inserts during delete`,
        complexity: {
          'Search': { worst: 'O(log n)', expected: 'O(log n)', contention: 'None' },
          'Insert': { worst: 'O(log n)', expected: 'O(log n)', contention: 'Point' },
          'Delete': { worst: 'O(log n)', expected: 'O(log n)', contention: 'Point' }
        }
      }
    ],
    summary: 'Parallel data structures balance correctness, performance, and scalability. Lock-free algorithms provide high concurrency but require careful design to ensure correctness.',
    references: [
      'Herlihy & Shavit, "The Art of Multiprocessor Programming", 2008'
    ]
  }
};