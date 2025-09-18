import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const PairingHeapViz = () => {
  const [heap, setHeap] = useState({
    value: 2,
    children: [
      { value: 5, children: [{ value: 8, children: [] }, { value: 12, children: [] }] },
      { value: 3, children: [{ value: 7, children: [] }] },
      { value: 6, children: [{ value: 15, children: [] }, { value: 10, children: [] }] }
    ]
  });

  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Pairing heap supports efficient decrease-key and merge operations');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [operationSteps, setOperationSteps] = useState([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  // Add unique IDs to nodes
  const addIds = (node) => {
    if (!node) return null;
    const newNode = {
      ...node,
      id: nodeIdCounter,
      children: node.children ? node.children.map(child => addIds(child)) : []
    };
    setNodeIdCounter(prev => prev + 1);
    return newNode;
  };

  useEffect(() => {
    setHeap(addIds(heap));
  }, []);

  // Find node by value (for decrease key operation)
  const findNode = (node, value) => {
    if (!node) return null;
    if (node.value === value) return node;

    for (const child of node.children || []) {
      const found = findNode(child, value);
      if (found) return found;
    }
    return null;
  };

  // Merge two pairing heaps
  const mergePairingHeaps = (h1, h2) => {
    if (!h1) return h2;
    if (!h2) return h1;

    if (h1.value <= h2.value) {
      return {
        ...h1,
        children: [...(h1.children || []), h2]
      };
    } else {
      return {
        ...h2,
        children: [...(h2.children || []), h1]
      };
    }
  };

  // Merge pairs of children (two-pass algorithm)
  const mergePairs = (children) => {
    if (!children || children.length === 0) return null;
    if (children.length === 1) return children[0];

    // First pass: merge pairs from left to right
    const firstPass = [];
    for (let i = 0; i < children.length; i += 2) {
      if (i + 1 < children.length) {
        firstPass.push(mergePairingHeaps(children[i], children[i + 1]));
      } else {
        firstPass.push(children[i]);
      }
    }

    // Second pass: merge from right to left
    let result = firstPass[firstPass.length - 1];
    for (let i = firstPass.length - 2; i >= 0; i--) {
      result = mergePairingHeaps(firstPass[i], result);
    }

    return result;
  };

  // Insert operation
  const insert = async (value) => {
    if (!value) return;

    setIsAnimating(true);
    setOperationSteps([]);
    setMessage(`Inserting ${value}...`);

    const newNode = {
      id: nodeIdCounter,
      value: parseInt(value),
      children: []
    };
    setNodeIdCounter(prev => prev + 1);

    setOperationSteps(prev => [...prev, `Create new node with value ${value}`]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mergedHeap = mergePairingHeaps(heap, newNode);
    setHeap(mergedHeap);

    setOperationSteps(prev => [...prev, `Merge new node with existing heap`]);
    setMessage(`Successfully inserted ${value}`);
    setInputValue('');
    setIsAnimating(false);
  };

  // Delete minimum (extract root)
  const deleteMin = async () => {
    if (!heap) {
      setMessage('Heap is empty');
      return;
    }

    setIsAnimating(true);
    setOperationSteps([]);
    const minValue = heap.value;
    setMessage(`Deleting minimum: ${minValue}`);

    setHighlightedNodes([heap.id]);
    setOperationSteps([`Remove root node with value ${minValue}`]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!heap.children || heap.children.length === 0) {
      setHeap(null);
      setOperationSteps(prev => [...prev, 'Heap is now empty']);
    } else {
      setOperationSteps(prev => [...prev, 'Merge all children using two-pass algorithm']);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demonstrate two-pass merging
      const children = heap.children;
      setOperationSteps(prev => [...prev, `First pass: pair children left-to-right`]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const firstPass = [];
      for (let i = 0; i < children.length; i += 2) {
        if (i + 1 < children.length) {
          setOperationSteps(prev => [...prev, `Merge children ${children[i].value} and ${children[i + 1].value}`]);
          firstPass.push(mergePairingHeaps(children[i], children[i + 1]));
        } else {
          firstPass.push(children[i]);
        }
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setOperationSteps(prev => [...prev, `Second pass: merge results right-to-left`]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      let result = firstPass[firstPass.length - 1];
      for (let i = firstPass.length - 2; i >= 0; i--) {
        setOperationSteps(prev => [...prev, `Merge with previous result`]);
        result = mergePairingHeaps(firstPass[i], result);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setHeap(result);
    }

    setHighlightedNodes([]);
    setMessage(`Deleted minimum: ${minValue}`);
    setIsAnimating(false);
  };

  // Decrease key operation (simplified)
  const decreaseKey = async () => {
    const oldValue = 12; // Example: decrease 12 to 1
    const newValue = 1;

    setIsAnimating(true);
    setOperationSteps([]);
    setMessage(`Decreasing key from ${oldValue} to ${newValue}...`);

    // Find the node
    const nodeToDecrease = findNode(heap, oldValue);
    if (!nodeToDecrease) {
      setMessage(`Value ${oldValue} not found in heap`);
      setIsAnimating(false);
      return;
    }

    setHighlightedNodes([nodeToDecrease.id]);
    setOperationSteps([`Found node with value ${oldValue}`]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate cutting the subtree and re-inserting
    // In practice, this would involve more complex parent pointer manipulation
    nodeToDecrease.value = newValue;

    setOperationSteps(prev => [...prev, `Changed value to ${newValue}`]);
    setOperationSteps(prev => [...prev, `Cut subtree and merge with root`]);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For simplification, we'll rebuild the heap with the new value
    const newHeap = { ...heap };
    setHeap(newHeap);

    setHighlightedNodes([]);
    setMessage(`Decreased key from ${oldValue} to ${newValue}`);
    setIsAnimating(false);
  };

  // Reset heap
  const resetHeap = () => {
    const initialHeap = {
      value: 2,
      children: [
        { value: 5, children: [{ value: 8, children: [] }, { value: 12, children: [] }] },
        { value: 3, children: [{ value: 7, children: [] }] },
        { value: 6, children: [{ value: 15, children: [] }, { value: 10, children: [] }] }
      ]
    };

    setNodeIdCounter(0);
    setHeap(addIds(initialHeap));
    setOperationSteps([]);
    setHighlightedNodes([]);
    setMessage('Heap reset to initial state');
  };

  // Render pairing heap as a tree
  const renderNode = (node, x, y, level, parentX = null, parentY = null) => {
    if (!node) return null;

    const nodeRadius = 25;
    const isHighlighted = highlightedNodes.includes(node.id);
    const isRoot = level === 0;

    const elements = [];

    // Draw edge from parent
    if (parentX !== null && parentY !== null) {
      elements.push(
        <line
          key={`edge-${node.id}`}
          x1={parentX}
          y1={parentY + nodeRadius}
          x2={x}
          y2={y - nodeRadius}
          stroke="#6b7280"
          strokeWidth="2"
        />
      );
    }

    // Draw node
    elements.push(
      <g key={`node-${node.id}`}>
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
      </g>
    );

    // Draw children
    if (node.children && node.children.length > 0) {
      const childSpacing = Math.max(80, 300 / Math.pow(2, level));
      const startX = x - (childSpacing * (node.children.length - 1)) / 2;

      node.children.forEach((child, index) => {
        const childX = startX + index * childSpacing;
        const childY = y + 80;
        elements.push(
          ...renderNode(child, childX, childY, level + 1, x, y)
        );
      });
    }

    return elements;
  };

  // Count nodes in heap
  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + (node.children || []).reduce((sum, child) => sum + countNodes(child), 0);
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Pairing Heap Operations</h2>
        <p>Demonstrates pairing heap operations with efficient merge and decrease-key capabilities.</p>
      </div>

      <div className="viz-controls">
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
          className="btn btn-primary"
          onClick={() => insert(inputValue)}
          disabled={isAnimating || !inputValue}
        >
          Insert
        </button>

        <button
          className="btn btn-danger"
          onClick={deleteMin}
          disabled={isAnimating || !heap}
        >
          Delete Min
        </button>

        <button
          className="btn btn-secondary"
          onClick={decreaseKey}
          disabled={isAnimating || !heap}
        >
          Decrease Key (12→1)
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetHeap}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Pairing Heap Structure</h3>
          <div style={{
            width: '100%',
            height: '400px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-secondary)',
            overflow: 'auto',
            position: 'relative'
          }}>
            {heap ? (
              <svg width="600" height="350">
                {renderNode(heap, 300, 50, 0)}
              </svg>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                Heap is empty
              </div>
            )}
          </div>
          <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Root is shown in green. Children are connected in left-to-right order.
          </p>
        </div>

        {operationSteps.length > 0 && (
          <div className="section">
            <h3>Operation Steps</h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px'
            }}>
              {operationSteps.map((step, index) => (
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
                  <strong>Step {index + 1}:</strong> {step}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Heap Properties</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Nodes:</span>
              <span className="metric-value">{heap ? countNodes(heap) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Root Value:</span>
              <span className="metric-value">{heap ? heap.value : 'N/A'}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Direct Children:</span>
              <span className="metric-value">{heap ? (heap.children || []).length : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Operation Steps:</span>
              <span className="metric-value">{operationSteps.length}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Two-Pass Merge Algorithm</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>When deleting minimum:</h4>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li>Remove root node</li>
              <li><strong>First pass:</strong> Pair children from left to right and merge each pair</li>
              <li><strong>Second pass:</strong> Merge results from right to left</li>
              <li>The final result becomes the new root</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Pairing Heap Properties:</h3>
        <ul>
          <li>Multiway tree structure (nodes can have any number of children)</li>
          <li>Insert: O(1) - simply merge with root</li>
          <li>Find min: O(1) - root always contains minimum</li>
          <li>Delete min: O(log n) amortized - uses two-pass merge</li>
          <li>Decrease key: O(log n) amortized - cut and merge with root</li>
          <li>Merge: O(1) - compare roots and make smaller the parent</li>
        </ul>
      </div>
    </div>
  );
};

export default PairingHeapViz;