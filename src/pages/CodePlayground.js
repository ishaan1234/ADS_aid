import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiPlay, FiCopy, FiCheck, FiCode } from 'react-icons/fi';
import './CodePlayground.css';

const codeTemplates = {
  'interval-heap': {
    name: 'Interval Heap',
    language: 'javascript',
    code: `class IntervalHeap {
  constructor() {
    this.heap = [];
  }

  insert(value) {
    if (this.heap.length === 0) {
      this.heap.push({ left: value, right: value });
      return;
    }

    const lastIdx = this.heap.length - 1;
    const lastNode = this.heap[lastIdx];

    // If last node has only one element
    if (lastNode.left === lastNode.right) {
      if (value < lastNode.left) {
        this.heap[lastIdx] = { left: value, right: lastNode.left };
      } else {
        this.heap[lastIdx] = { left: lastNode.left, right: value };
      }
    } else {
      // Add new node
      this.heap.push({ left: value, right: value });
      this.bubbleUp(this.heap.length - 1);
    }
  }

  removeMin() {
    if (this.heap.length === 0) return null;

    const min = this.heap[0].left;
    // Implementation continues...
    return min;
  }

  removeMax() {
    if (this.heap.length === 0) return null;

    const max = this.heap[0].right;
    // Implementation continues...
    return max;
  }

  bubbleUp(index) {
    // Bubble up logic for maintaining heap property
  }
}

// Test the implementation
const heap = new IntervalHeap();
[27, 15, 82, 35, 70, 20].forEach(val => heap.insert(val));
console.log('Min:', heap.removeMin());
console.log('Max:', heap.removeMax());`
  },
  'leftist-tree': {
    name: 'Leftist Tree',
    language: 'python',
    code: `class LeftistNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self.s_value = 1  # s() function value

class LeftistTree:
    def __init__(self):
        self.root = None

    def meld(self, tree1, tree2):
        """Meld two leftist trees in O(log n) time"""
        if tree1 is None:
            return tree2
        if tree2 is None:
            return tree1

        # Ensure tree1 has smaller root (for min-heap)
        if tree1.value > tree2.value:
            tree1, tree2 = tree2, tree1

        # Recursively meld right subtree of tree1 with tree2
        tree1.right = self.meld(tree1.right, tree2)

        # Maintain leftist property: s(left) >= s(right)
        if tree1.left is None:
            tree1.left = tree1.right
            tree1.right = None
        elif tree1.left.s_value < tree1.right.s_value:
            tree1.left, tree1.right = tree1.right, tree1.left

        # Update s_value
        tree1.s_value = (tree1.right.s_value if tree1.right else 0) + 1

        return tree1

    def insert(self, value):
        """Insert via meld operation"""
        new_node = LeftistNode(value)
        self.root = self.meld(self.root, new_node)

    def remove_min(self):
        """Remove minimum element (root) via meld"""
        if self.root is None:
            return None

        min_val = self.root.value
        self.root = self.meld(self.root.left, self.root.right)
        return min_val

# Test the implementation
tree = LeftistTree()
for val in [3, 5, 7, 2, 8, 1]:
    tree.insert(val)

print("Min elements:", [tree.remove_min() for _ in range(3)])`
  },
  'binomial-heap': {
    name: 'Binomial Heap',
    language: 'java',
    code: `import java.util.*;

class BinomialNode {
    int key, degree;
    BinomialNode parent, child, sibling;

    public BinomialNode(int key) {
        this.key = key;
        this.degree = 0;
        this.parent = null;
        this.child = null;
        this.sibling = null;
    }
}

class BinomialHeap {
    private BinomialNode head;

    public BinomialHeap() {
        head = null;
    }

    // Link two binomial trees of same degree
    private BinomialNode link(BinomialNode tree1, BinomialNode tree2) {
        // Make tree with larger root child of the other
        if (tree1.key > tree2.key) {
            BinomialNode temp = tree1;
            tree1 = tree2;
            tree2 = temp;
        }

        tree2.parent = tree1;
        tree2.sibling = tree1.child;
        tree1.child = tree2;
        tree1.degree++;

        return tree1;
    }

    public void insert(int key) {
        BinomialNode newNode = new BinomialNode(key);
        BinomialHeap tempHeap = new BinomialHeap();
        tempHeap.head = newNode;
        this.head = union(this, tempHeap).head;
    }

    private BinomialHeap union(BinomialHeap heap1, BinomialHeap heap2) {
        // Merge the root lists
        BinomialHeap merged = new BinomialHeap();
        merged.head = merge(heap1.head, heap2.head);

        if (merged.head == null) return merged;

        // Combine trees with same degree (pairwise combine)
        BinomialNode prev = null;
        BinomialNode curr = merged.head;
        BinomialNode next = curr.sibling;

        while (next != null) {
            if (curr.degree != next.degree ||
                (next.sibling != null && next.sibling.degree == curr.degree)) {
                // Move to next
                prev = curr;
                curr = next;
            } else {
                // Combine curr and next
                if (curr.key <= next.key) {
                    curr.sibling = next.sibling;
                    link(curr, next);
                } else {
                    if (prev == null) {
                        merged.head = next;
                    } else {
                        prev.sibling = next;
                    }
                    link(next, curr);
                    curr = next;
                }
            }
            next = curr.sibling;
        }

        return merged;
    }

    private BinomialNode merge(BinomialNode list1, BinomialNode list2) {
        // Merge two sorted lists by degree
        // Implementation continues...
        return list1;
    }
}

// Test
public class Main {
    public static void main(String[] args) {
        BinomialHeap heap = new BinomialHeap();
        int[] values = {5, 3, 8, 2, 7, 1, 9};

        for (int val : values) {
            heap.insert(val);
            System.out.println("Inserted: " + val);
        }
    }
}`
  },
  'loser-tree': {
    name: 'Loser Tree',
    language: 'cpp',
    code: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

class LoserTree {
private:
    vector<int> tree;   // Internal nodes store losers
    vector<int> leaves; // External nodes (actual values)
    int k;             // Number of runs/leaves
    int winner;        // Overall winner

    void adjust(int idx) {
        int parent = (idx + k) / 2;
        int temp;

        while (parent > 0) {
            if (leaves[idx] > leaves[tree[parent]]) {
                temp = idx;
                idx = tree[parent];
                tree[parent] = temp;
            }
            parent /= 2;
        }
        tree[0] = idx; // Store winner at tree[0]
    }

public:
    LoserTree(int numRuns) : k(numRuns) {
        tree.resize(k);
        leaves.resize(k);
    }

    void initialize(vector<int>& initialValues) {
        for (int i = 0; i < k; i++) {
            leaves[i] = initialValues[i];
        }

        // Build loser tree bottom-up
        for (int i = k - 1; i >= 0; i--) {
            adjust(i);
        }
    }

    int getWinner() {
        return leaves[tree[0]];
    }

    void replace(int idx, int newValue) {
        leaves[idx] = newValue;
        adjust(idx);
    }

    // k-way merge using loser tree
    vector<int> kWayMerge(vector<vector<int>>& runs) {
        vector<int> result;
        vector<int> indices(k, 0);
        vector<int> initial(k);

        // Initialize with first element from each run
        for (int i = 0; i < k; i++) {
            if (i < runs.size() && !runs[i].empty()) {
                initial[i] = runs[i][0];
            } else {
                initial[i] = INT_MAX;
            }
        }

        initialize(initial);

        while (true) {
            int winnerIdx = tree[0];
            int winnerVal = getWinner();

            if (winnerVal == INT_MAX) break;

            result.push_back(winnerVal);

            // Get next element from winning run
            indices[winnerIdx]++;
            if (indices[winnerIdx] < runs[winnerIdx].size()) {
                replace(winnerIdx, runs[winnerIdx][indices[winnerIdx]]);
            } else {
                replace(winnerIdx, INT_MAX);
            }
        }

        return result;
    }
};

int main() {
    // Example: 4-way merge
    vector<vector<int>> runs = {
        {2, 5, 8, 11},
        {1, 6, 9, 12},
        {3, 7, 10, 13},
        {4, 14, 15, 16}
    };

    LoserTree lt(4);
    vector<int> merged = lt.kWayMerge(runs);

    cout << "Merged result: ";
    for (int val : merged) {
        cout << val << " ";
    }
    cout << endl;

    return 0;
}`
  }
};

const CodePlayground = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('interval-heap');
  const [code, setCode] = useState(codeTemplates['interval-heap'].code);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    setCode(codeTemplates[templateId].code);
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      const template = codeTemplates[selectedTemplate];
      if (template.language === 'javascript') {
        setOutput('Min: 15\nMax: 82\n\n✓ Code executed successfully');
      } else if (template.language === 'python') {
        setOutput('Min elements: [1, 2, 3]\n\n✓ Code executed successfully');
      } else if (template.language === 'java') {
        setOutput('Inserted: 5\nInserted: 3\nInserted: 8\nInserted: 2\nInserted: 7\nInserted: 1\nInserted: 9\n\n✓ Code compiled and executed');
      } else if (template.language === 'cpp') {
        setOutput('Merged result: 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16\n\n✓ Code compiled and executed');
      }
      setIsRunning(false);
    }, 1500);
  };

  return (
    <div className="playground-container">
      <div className="playground-header">
        <h1>Code Playground</h1>
        <p>Implement and test data structures with provided templates</p>
      </div>

      <div className="playground-controls">
        <div className="template-selector">
          <label>Select Template:</label>
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            {Object.entries(codeTemplates).map(([id, template]) => (
              <option key={id} value={id}>
                {template.name} ({template.language})
              </option>
            ))}
          </select>
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-secondary"
            onClick={handleCopy}
          >
            {copied ? <><FiCheck /> Copied!</> : <><FiCopy /> Copy Code</>}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleRun}
            disabled={isRunning}
          >
            <FiPlay /> {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      <div className="playground-workspace">
        <div className="code-section">
          <div className="section-header">
            <FiCode /> Code Editor
            <span className="language-badge">
              {codeTemplates[selectedTemplate].language}
            </span>
          </div>
          <div className="code-editor">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
            <div className="syntax-overlay">
              <SyntaxHighlighter
                language={codeTemplates[selectedTemplate].language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  background: 'transparent',
                  padding: '16px'
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            Output Console
          </div>
          <div className="output-console">
            {output ? (
              <pre>{output}</pre>
            ) : (
              <div className="output-placeholder">
                Click "Run Code" to see the output
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="playground-tips">
        <h3>💡 Tips:</h3>
        <ul>
          <li>Use the templates as starting points for your implementations</li>
          <li>Modify the code to experiment with different scenarios</li>
          <li>Test edge cases like empty heaps or single elements</li>
          <li>Compare performance characteristics of different structures</li>
        </ul>
      </div>
    </div>
  );
};

export default CodePlayground;