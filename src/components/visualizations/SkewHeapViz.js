import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const SkewHeapViz = () => {
  const [heap1, setHeap1] = useState({
    value: 3,
    left: { value: 8, left: { value: 15, left: null, right: null }, right: { value: 12, left: null, right: null } },
    right: { value: 5, left: null, right: { value: 7, left: null, right: null } }
  });

  const [heap2, setHeap2] = useState({
    value: 4,
    left: { value: 9, left: null, right: null },
    right: { value: 6, left: { value: 14, left: null, right: null }, right: { value: 10, left: null, right: null } }
  });

  const [mergedHeap, setMergedHeap] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Skew heaps are self-adjusting binary heaps. Click "Merge Heaps" to see the merge operation.');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [step, setStep] = useState(0);
  const [mergeSteps, setMergeSteps] = useState([]);

  // Generate unique ID for nodes
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Add IDs to existing trees
  const addIds = (node) => {
    if (!node) return null;
    return {
      ...node,
      id: generateId(),
      left: addIds(node.left),
      right: addIds(node.right)
    };
  };

  useEffect(() => {
    setHeap1(addIds(heap1));
    setHeap2(addIds(heap2));
  }, []);

  // Merge two skew heaps
  const mergeSkewHeaps = (h1, h2) => {
    if (!h1) return h2;
    if (!h2) return h1;

    // Ensure h1 has smaller root
    if (h1.value > h2.value) {
      [h1, h2] = [h2, h1];
    }

    // Create new node with swapped children
    const newNode = {
      id: generateId(),
      value: h1.value,
      left: h2, // Right child becomes left
      right: mergeSkewHeaps(h1.right, h1.left) // Merge right subtree with left subtree
    };

    return newNode;
  };

  // Animated merge operation
  const animatedMerge = async () => {
    setIsAnimating(true);
    setMergedHeap(null);
    setMergeSteps([]);
    setStep(0);
    setMessage('Starting merge operation...');

    const steps = [];
    const merge = async (h1, h2, depth = 0) => {
      if (!h1) return h2;
      if (!h2) return h1;

      // Record step
      steps.push({
        operation: 'compare',
        h1: h1.value,
        h2: h2.value,
        depth
      });

      setMergeSteps([...steps]);
      setMessage(`Comparing roots: ${h1.value} and ${h2.value}`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ensure h1 has smaller root
      if (h1.value > h2.value) {
        steps.push({
          operation: 'swap',
          h1: h1.value,
          h2: h2.value,
          depth
        });
        setMergeSteps([...steps]);
        setMessage(`Swapping: ${h1.value} > ${h2.value}, so swap heaps`);
        [h1, h2] = [h2, h1];
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      steps.push({
        operation: 'merge_recursive',
        root: h1.value,
        depth
      });
      setMergeSteps([...steps]);
      setMessage(`Making ${h1.value} root, merging children recursively`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Recursive merge with child swap
      const rightChild = await merge(h1.right, h1.left, depth + 1);

      const newNode = {
        id: generateId(),
        value: h1.value,
        left: h2, // h2 becomes left child
        right: rightChild
      };

      return newNode;
    };

    const result = await merge(heap1, heap2);
    setMergedHeap(result);
    setMessage('Merge complete! Notice how children are swapped at each level.');
    setIsAnimating(false);
  };

  // Insert into skew heap
  const insertValue = async () => {
    if (!inputValue) return;

    setIsAnimating(true);
    setMessage(`Inserting ${inputValue} into heap...`);

    const newNode = {
      id: generateId(),
      value: parseInt(inputValue),
      left: null,
      right: null
    };

    // Merge single node with existing heap
    const currentHeap = mergedHeap || heap1;
    const result = mergeSkewHeaps(currentHeap, newNode);

    setMergedHeap(result);
    setInputValue('');
    setMessage(`Inserted ${inputValue} successfully`);
    setIsAnimating(false);
  };

  // Delete minimum (root)
  const deleteMin = async () => {
    const currentHeap = mergedHeap || heap1;
    if (!currentHeap) {
      setMessage('Heap is empty');
      return;
    }

    setIsAnimating(true);
    setMessage(`Deleting minimum: ${currentHeap.value}`);

    // Merge left and right subtrees
    const result = mergeSkewHeaps(currentHeap.left, currentHeap.right);
    setMergedHeap(result);

    setMessage(`Deleted ${currentHeap.value}. Merged subtrees.`);
    setIsAnimating(false);
  };

  // Reset visualization
  const resetHeaps = () => {
    setMergedHeap(null);
    setMergeSteps([]);
    setStep(0);
    setHighlightedNodes([]);
    setMessage('Reset complete. Ready for new operations.');
  };

  // Render tree
  const renderTree = (node, x, y, spacing, isRoot = false) => {
    if (!node) return null;

    const nodeRadius = 25;
    const isHighlighted = highlightedNodes.includes(node.id);

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isHighlighted ? '#fbbf24' : isRoot ? '#10b981' : '#3b82f6'}
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fontSize="14"
          fill="white"
          fontWeight="bold"
        >
          {node.value}
        </text>

        {/* Left child */}
        {node.left && (
          <>
            <line
              x1={x - 15}
              y1={y + 20}
              x2={x - spacing}
              y2={y + 60}
              stroke="#6b7280"
              strokeWidth="2"
            />
            <text
              x={x - spacing/2}
              y={y + 45}
              textAnchor="middle"
              fontSize="10"
              fill="#ef4444"
              fontWeight="bold"
            >
              L
            </text>
            {renderTree(node.left, x - spacing, y + 80, spacing * 0.6)}
          </>
        )}

        {/* Right child */}
        {node.right && (
          <>
            <line
              x1={x + 15}
              y1={y + 20}
              x2={x + spacing}
              y2={y + 60}
              stroke="#6b7280"
              strokeWidth="2"
            />
            <text
              x={x + spacing/2}
              y={y + 45}
              textAnchor="middle"
              fontSize="10"
              fill="#3b82f6"
              fontWeight="bold"
            >
              R
            </text>
            {renderTree(node.right, x + spacing, y + 80, spacing * 0.6)}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Skew Heap Operations</h2>
        <p>Demonstrates skew heap merge operations with automatic child swapping for amortized efficiency.</p>
      </div>

      <div className="viz-controls">
        <button
          className="btn btn-primary"
          onClick={animatedMerge}
          disabled={isAnimating}
        >
          Merge Heaps
        </button>

        <div className="control-group">
          <label>Insert Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnimating}
            placeholder="Enter number"
          />
        </div>

        <button
          className="btn btn-secondary"
          onClick={insertValue}
          disabled={isAnimating || !inputValue}
        >
          Insert
        </button>

        <button
          className="btn btn-danger"
          onClick={deleteMin}
          disabled={isAnimating}
        >
          Delete Min
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetHeaps}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Original Heaps</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <h4>Heap 1</h4>
              <div style={{
                width: '100%',
                height: '300px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}>
                <svg width="100%" height="100%">
                  {heap1 && renderTree(heap1, 150, 40, 60, true)}
                </svg>
              </div>
            </div>

            <div>
              <h4>Heap 2</h4>
              <div style={{
                width: '100%',
                height: '300px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-secondary)',
                position: 'relative'
              }}>
                <svg width="100%" height="100%">
                  {heap2 && renderTree(heap2, 150, 40, 60, true)}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {mergedHeap && (
          <div className="section">
            <h3>Merged Heap</h3>
            <div style={{
              width: '100%',
              height: '400px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--bg-secondary)',
              position: 'relative'
            }}>
              <svg width="100%" height="100%">
                {renderTree(mergedHeap, 300, 40, 80, true)}
              </svg>
            </div>
          </div>
        )}

        {mergeSteps.length > 0 && (
          <div className="section">
            <h3>Merge Steps</h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px'
            }}>
              {mergeSteps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    marginBottom: '4px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px'
                  }}
                >
                  <strong>Step {index + 1}:</strong>
                  {step.operation === 'compare' &&
                    ` Compare roots ${step.h1} and ${step.h2}`
                  }
                  {step.operation === 'swap' &&
                    ` Swap heaps (${step.h1} > ${step.h2})`
                  }
                  {step.operation === 'merge_recursive' &&
                    ` Make ${step.root} root, merge children recursively`
                  }
                  <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                    (Depth: {step.depth})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Heap Properties</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Heap 1 Size:</span>
              <span className="metric-value">{heap1 ? countNodes(heap1) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Heap 2 Size:</span>
              <span className="metric-value">{heap2 ? countNodes(heap2) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Merged Heap Size:</span>
              <span className="metric-value">{mergedHeap ? countNodes(mergedHeap) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Merge Steps:</span>
              <span className="metric-value">{mergeSteps.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Skew Heap Properties:</h3>
        <ul>
          <li>Self-adjusting binary heap with no structural constraints</li>
          <li>Merge operation always swaps left and right children</li>
          <li>Amortized O(log n) for all operations</li>
          <li>Insert: merge single node with existing heap</li>
          <li>Delete min: remove root, merge left and right subtrees</li>
          <li>Simpler than leftist heaps but with similar performance</li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to count nodes
const countNodes = (node) => {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
};

export default SkewHeapViz;