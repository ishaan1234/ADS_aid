import React, { useState, useCallback } from 'react';
import './VisualizationBase.css';

const MinMaxHeapViz = () => {
  const [heap, setHeap] = useState([5, 70, 40, 30, 20, 55, 52, 15, 25, 18, 10]);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [operation, setOperation] = useState('');

  const getLevel = (index) => Math.floor(Math.log2(index + 1));

  const isMinLevel = (index) => getLevel(index) % 2 === 0;

  const getParent = (index) => Math.floor((index - 1) / 2);

  const getChildren = (index) => {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    return [left, right].filter(i => i < heap.length);
  };

  const getGrandchildren = (index) => {
    const children = getChildren(index);
    const grandchildren = [];
    children.forEach(child => {
      grandchildren.push(...getChildren(child));
    });
    return grandchildren.filter(i => i < heap.length);
  };

  const bubbleUp = (arr, index) => {
    if (index === 0) return arr;

    const parentIdx = getParent(index);
    const isMin = isMinLevel(index);
    const newArr = [...arr];

    if (isMin) {
      if (newArr[index] > newArr[parentIdx]) {
        [newArr[index], newArr[parentIdx]] = [newArr[parentIdx], newArr[index]];
        bubbleUpMax(newArr, parentIdx);
      } else {
        bubbleUpMin(newArr, index);
      }
    } else {
      if (newArr[index] < newArr[parentIdx]) {
        [newArr[index], newArr[parentIdx]] = [newArr[parentIdx], newArr[index]];
        bubbleUpMin(newArr, parentIdx);
      } else {
        bubbleUpMax(newArr, index);
      }
    }

    return newArr;
  };

  const bubbleUpMin = (arr, index) => {
    const grandparentIdx = getParent(getParent(index));
    if (grandparentIdx >= 0 && arr[index] < arr[grandparentIdx]) {
      [arr[index], arr[grandparentIdx]] = [arr[grandparentIdx], arr[index]];
      bubbleUpMin(arr, grandparentIdx);
    }
  };

  const bubbleUpMax = (arr, index) => {
    const grandparentIdx = getParent(getParent(index));
    if (grandparentIdx >= 0 && arr[index] > arr[grandparentIdx]) {
      [arr[index], arr[grandparentIdx]] = [arr[grandparentIdx], arr[index]];
      bubbleUpMax(arr, grandparentIdx);
    }
  };

  const insert = useCallback(() => {
    if (!inputValue) return;

    const value = parseInt(inputValue);
    setOperation(`Inserting ${value}`);
    setHighlightedIndices([heap.length]);

    const newHeap = [...heap, value];
    const finalHeap = bubbleUp(newHeap, newHeap.length - 1);

    setTimeout(() => {
      setHeap(finalHeap);
      setInputValue('');
      setHighlightedIndices([]);
      setOperation('');
    }, 500);
  }, [heap, inputValue]);

  const removeMin = useCallback(() => {
    if (heap.length === 0) return;

    setOperation('Removing minimum');
    setHighlightedIndices([0]);

    const newHeap = [...heap];
    newHeap[0] = newHeap[newHeap.length - 1];
    newHeap.pop();

    // Simplified trickle down for demonstration
    setTimeout(() => {
      setHeap(newHeap);
      setHighlightedIndices([]);
      setOperation('');
    }, 500);
  }, [heap]);

  const removeMax = useCallback(() => {
    if (heap.length <= 1) return;

    let maxIdx = 1;
    if (heap.length > 2 && heap[2] > heap[1]) {
      maxIdx = 2;
    }

    setOperation('Removing maximum');
    setHighlightedIndices([maxIdx]);

    const newHeap = [...heap];
    newHeap[maxIdx] = newHeap[newHeap.length - 1];
    newHeap.pop();

    setTimeout(() => {
      setHeap(newHeap);
      setHighlightedIndices([]);
      setOperation('');
    }, 500);
  }, [heap]);

  const reset = () => {
    setHeap([5, 70, 40, 30, 20, 55, 52, 15, 25, 18, 10]);
    setInputValue('');
    setHighlightedIndices([]);
    setOperation('');
  };

  const renderTree = () => {
    if (heap.length === 0) return null;

    const levels = [];
    let levelNodes = [0];

    while (levelNodes.length > 0) {
      levels.push([...levelNodes]);
      const nextLevel = [];
      levelNodes.forEach(idx => {
        const children = getChildren(idx);
        nextLevel.push(...children);
      });
      levelNodes = nextLevel;
    }

    return (
      <div className="tree-container">
        {levels.map((level, levelIdx) => (
          <div key={levelIdx} className="tree-level">
            <div className="level-label">
              Level {levelIdx} ({levelIdx % 2 === 0 ? 'MIN' : 'MAX'})
            </div>
            <div className="tree-nodes">
              {level.map((idx) => (
                <div
                  key={idx}
                  className={`tree-node ${isMinLevel(idx) ? 'min-level' : 'max-level'}
                            ${highlightedIndices.includes(idx) ? 'highlighted' : ''}`}
                >
                  <span className="node-value">{heap[idx]}</span>
                  <span className="node-index">i={idx}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getMin = () => heap.length > 0 ? heap[0] : null;
  const getMax = () => {
    if (heap.length === 1) return heap[0];
    if (heap.length === 2) return heap[1];
    return heap.length > 2 ? Math.max(heap[1], heap[2]) : null;
  };

  return (
    <div className="viz-container">
      <div className="viz-header">
        <h2>Min-Max Heap</h2>
        <p>Alternating min and max levels for double-ended priority queue operations</p>
      </div>

      <div className="viz-content">
        <div className="heap-info">
          <div className="info-card">
            <span className="info-label">Minimum</span>
            <span className="info-value">{getMin() ?? '-'}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Maximum</span>
            <span className="info-value">{getMax() ?? '-'}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Size</span>
            <span className="info-value">{heap.length}</span>
          </div>
        </div>

        {operation && (
          <div className="operation-status">
            {operation}
          </div>
        )}

        <div className="tree-visualization">
          {renderTree()}
        </div>

        <div className="controls-section">
          <div className="input-group">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
            />
            <button onClick={insert} disabled={!inputValue}>
              Insert
            </button>
            <button onClick={removeMin} disabled={heap.length === 0}>
              Remove Min
            </button>
            <button onClick={removeMax} disabled={heap.length === 0}>
              Remove Max
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="explanation-section">
          <h3>Min-Max Heap Properties</h3>
          <div className="properties-grid">
            <div className="property-card">
              <h4>Structure</h4>
              <ul>
                <li>Even levels (0, 2, 4...) are MIN levels</li>
                <li>Odd levels (1, 3, 5...) are MAX levels</li>
                <li>Complete binary tree structure</li>
              </ul>
            </div>
            <div className="property-card">
              <h4>Min Level Property</h4>
              <ul>
                <li>Node ≤ all descendants</li>
                <li>Root is global minimum</li>
                <li>Grandchildren follow min property</li>
              </ul>
            </div>
            <div className="property-card">
              <h4>Max Level Property</h4>
              <ul>
                <li>Node ≥ all descendants</li>
                <li>Level 1 contains global maximum</li>
                <li>Grandchildren follow max property</li>
              </ul>
            </div>
            <div className="property-card">
              <h4>Operations</h4>
              <ul>
                <li>Find Min/Max: O(1)</li>
                <li>Insert: O(log n)</li>
                <li>Delete Min/Max: O(log n)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heap-info {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .info-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .info-label {
          display: block;
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .info-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .operation-status {
          background: #ffc107;
          color: #333;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .tree-visualization {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
          min-height: 300px;
        }

        .tree-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          align-items: center;
        }

        .tree-level {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .level-label {
          font-size: 0.85rem;
          color: #666;
          font-weight: 600;
          text-transform: uppercase;
        }

        .tree-nodes {
          display: flex;
          gap: 1rem;
        }

        .tree-node {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .tree-node.min-level {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
        }

        .tree-node.max-level {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          box-shadow: 0 4px 6px rgba(245, 87, 108, 0.3);
        }

        .tree-node.highlighted {
          transform: scale(1.2);
          box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.5);
        }

        .node-value {
          font-size: 1.2rem;
        }

        .node-index {
          font-size: 0.7rem;
          opacity: 0.8;
        }

        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .property-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .property-card h4 {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .property-card ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .property-card li {
          margin: 0.5rem 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default MinMaxHeapViz;