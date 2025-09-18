import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const DeapViz = () => {
  const [deap, setDeap] = useState([null, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 10, 14, 18, 22]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('DEAP (Double-Ended Array Priority queue) - supports both min and max operations');
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [operation, setOperation] = useState('');

  // Check if index is in min heap (left side)
  const isMinHeap = (index) => {
    if (index <= 1) return false;
    if (index === 2) return true;

    let level = Math.floor(Math.log2(index));
    let minPartStart = Math.pow(2, level);
    let maxPartStart = Math.pow(2, level) + Math.pow(2, level - 1);

    return index < maxPartStart;
  };

  // Get corresponding index in the other heap
  const getCorrespondingIndex = (index) => {
    if (index <= 1) return null;
    if (index === 2) return 3;
    if (index === 3) return 2;

    let level = Math.floor(Math.log2(index));
    let levelStart = Math.pow(2, level);
    let positionInLevel = index - levelStart;
    let halfLevelSize = Math.pow(2, level - 1);

    if (isMinHeap(index)) {
      // Move from min heap to max heap
      return levelStart + halfLevelSize + positionInLevel;
    } else {
      // Move from max heap to min heap
      return levelStart + positionInLevel - halfLevelSize;
    }
  };

  // Get parent index
  const getParent = (index) => {
    if (index <= 3) return null;
    return Math.floor(index / 2);
  };

  // Get children indices
  const getChildren = (index) => {
    const left = 2 * index;
    const right = 2 * index + 1;
    return [
      left < deap.length ? left : null,
      right < deap.length ? right : null
    ].filter(child => child !== null);
  };

  // Bubble up in min heap
  const bubbleUpMin = async (newDeap, index) => {
    let current = index;

    while (current > 2) {
      const parent = getParent(current);
      if (!parent || parent < 2) break;

      if (newDeap[current] < newDeap[parent]) {
        setHighlightedIndices([current, parent]);
        await new Promise(resolve => setTimeout(resolve, 500));

        [newDeap[current], newDeap[parent]] = [newDeap[parent], newDeap[current]];
        setDeap([...newDeap]);
        await new Promise(resolve => setTimeout(resolve, 500));

        current = parent;
      } else {
        break;
      }
    }
  };

  // Bubble up in max heap
  const bubbleUpMax = async (newDeap, index) => {
    let current = index;

    while (current > 3) {
      const parent = getParent(current);
      if (!parent || parent < 3) break;

      if (newDeap[current] > newDeap[parent]) {
        setHighlightedIndices([current, parent]);
        await new Promise(resolve => setTimeout(resolve, 500));

        [newDeap[current], newDeap[parent]] = [newDeap[parent], newDeap[current]];
        setDeap([...newDeap]);
        await new Promise(resolve => setTimeout(resolve, 500));

        current = parent;
      } else {
        break;
      }
    }
  };

  // Bubble down in min heap
  const bubbleDownMin = async (newDeap, index) => {
    let current = index;

    while (true) {
      const children = getChildren(current);
      if (children.length === 0) break;

      let smallest = current;
      for (const child of children) {
        if (isMinHeap(child) && newDeap[child] < newDeap[smallest]) {
          smallest = child;
        }
      }

      if (smallest !== current) {
        setHighlightedIndices([current, smallest]);
        await new Promise(resolve => setTimeout(resolve, 500));

        [newDeap[current], newDeap[smallest]] = [newDeap[smallest], newDeap[current]];
        setDeap([...newDeap]);
        await new Promise(resolve => setTimeout(resolve, 500));

        current = smallest;
      } else {
        break;
      }
    }
  };

  // Bubble down in max heap
  const bubbleDownMax = async (newDeap, index) => {
    let current = index;

    while (true) {
      const children = getChildren(current);
      if (children.length === 0) break;

      let largest = current;
      for (const child of children) {
        if (!isMinHeap(child) && newDeap[child] > newDeap[largest]) {
          largest = child;
        }
      }

      if (largest !== current) {
        setHighlightedIndices([current, largest]);
        await new Promise(resolve => setTimeout(resolve, 500));

        [newDeap[current], newDeap[largest]] = [newDeap[largest], newDeap[current]];
        setDeap([...newDeap]);
        await new Promise(resolve => setTimeout(resolve, 500));

        current = largest;
      } else {
        break;
      }
    }
  };

  // Insert operation
  const insert = async (value) => {
    if (!value) return;

    setIsAnimating(true);
    setOperation('insert');
    setMessage(`Inserting ${value} into DEAP...`);

    const newDeap = [...deap, parseInt(value)];
    const newIndex = newDeap.length - 1;
    setDeap(newDeap);
    setHighlightedIndices([newIndex]);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Determine which heap this element should go to
    const correspondingIndex = getCorrespondingIndex(newIndex);

    if (correspondingIndex && correspondingIndex < newDeap.length) {
      const correspondingValue = newDeap[correspondingIndex];

      if (isMinHeap(newIndex)) {
        // In min heap side
        if (parseInt(value) > correspondingValue) {
          // Should be in max heap instead
          setMessage(`${value} > ${correspondingValue}, swapping to max heap side`);
          setHighlightedIndices([newIndex, correspondingIndex]);
          await new Promise(resolve => setTimeout(resolve, 800));

          [newDeap[newIndex], newDeap[correspondingIndex]] = [newDeap[correspondingIndex], newDeap[newIndex]];
          setDeap([...newDeap]);
          await new Promise(resolve => setTimeout(resolve, 500));

          await bubbleUpMax(newDeap, correspondingIndex);
        } else {
          await bubbleUpMin(newDeap, newIndex);
        }
      } else {
        // In max heap side
        if (parseInt(value) < correspondingValue) {
          // Should be in min heap instead
          setMessage(`${value} < ${correspondingValue}, swapping to min heap side`);
          setHighlightedIndices([newIndex, correspondingIndex]);
          await new Promise(resolve => setTimeout(resolve, 800));

          [newDeap[newIndex], newDeap[correspondingIndex]] = [newDeap[correspondingIndex], newDeap[newIndex]];
          setDeap([...newDeap]);
          await new Promise(resolve => setTimeout(resolve, 500));

          await bubbleUpMin(newDeap, correspondingIndex);
        } else {
          await bubbleUpMax(newDeap, newIndex);
        }
      }
    } else {
      // First element in this level
      if (isMinHeap(newIndex)) {
        await bubbleUpMin(newDeap, newIndex);
      } else {
        await bubbleUpMax(newDeap, newIndex);
      }
    }

    setHighlightedIndices([]);
    setMessage(`Successfully inserted ${value}`);
    setInputValue('');
    setIsAnimating(false);
  };

  // Find minimum (root of min heap)
  const findMin = async () => {
    if (deap.length <= 2) {
      setMessage('DEAP is empty');
      return;
    }

    setHighlightedIndices([2]);
    setMessage(`Minimum element: ${deap[2]}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHighlightedIndices([]);
  };

  // Find maximum (root of max heap)
  const findMax = async () => {
    if (deap.length <= 3) {
      setMessage('DEAP has no max element yet');
      return;
    }

    setHighlightedIndices([3]);
    setMessage(`Maximum element: ${deap[3]}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHighlightedIndices([]);
  };

  // Delete minimum
  const deleteMin = async () => {
    if (deap.length <= 2) {
      setMessage('DEAP is empty');
      return;
    }

    setIsAnimating(true);
    setOperation('deleteMin');

    const minValue = deap[2];
    setMessage(`Deleting minimum: ${minValue}`);
    setHighlightedIndices([2]);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newDeap = [...deap];
    // Move last element to root of min heap
    newDeap[2] = newDeap[newDeap.length - 1];
    newDeap.pop();
    setDeap(newDeap);

    if (newDeap.length > 2) {
      await bubbleDownMin(newDeap, 2);
    }

    setHighlightedIndices([]);
    setMessage(`Deleted minimum: ${minValue}`);
    setIsAnimating(false);
  };

  // Delete maximum
  const deleteMax = async () => {
    if (deap.length <= 3) {
      setMessage('DEAP has no max element to delete');
      return;
    }

    setIsAnimating(true);
    setOperation('deleteMax');

    const maxValue = deap[3];
    setMessage(`Deleting maximum: ${maxValue}`);
    setHighlightedIndices([3]);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newDeap = [...deap];
    // Move last element to root of max heap
    newDeap[3] = newDeap[newDeap.length - 1];
    newDeap.pop();
    setDeap(newDeap);

    if (newDeap.length > 3) {
      await bubbleDownMax(newDeap, 3);
    }

    setHighlightedIndices([]);
    setMessage(`Deleted maximum: ${maxValue}`);
    setIsAnimating(false);
  };

  // Reset DEAP
  const resetDeap = () => {
    setDeap([null, 5, 15, 3, 7, 12, 20, 1, 4, 6, 8, 10, 14, 18, 22]);
    setHighlightedIndices([]);
    setMessage('DEAP reset to initial state');
  };

  // Render DEAP as a tree
  const renderDeapTree = () => {
    const levels = Math.ceil(Math.log2(deap.length));
    const nodeSize = 35;
    const levelHeight = 80;

    return (
      <svg width="800" height="400" style={{ overflow: 'visible' }}>
        {/* Render nodes */}
        {deap.map((value, index) => {
          if (index === 0 || value === null) return null;

          const level = Math.floor(Math.log2(index));
          const positionInLevel = index - Math.pow(2, level);
          const nodesInLevel = Math.pow(2, level);
          const spacing = 600 / (nodesInLevel + 1);

          const x = spacing * (positionInLevel + 1);
          const y = 50 + level * levelHeight;

          const isHighlighted = highlightedIndices.includes(index);
          const isMin = isMinHeap(index);
          const isRoot = index === 2 || index === 3;

          let fillColor = '#6b7280';
          if (isHighlighted) fillColor = '#fbbf24';
          else if (isRoot && isMin) fillColor = '#10b981';
          else if (isRoot && !isMin) fillColor = '#ef4444';
          else if (isMin) fillColor = '#3b82f6';
          else fillColor = '#f59e0b';

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={nodeSize}
                fill={fillColor}
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
                {value}
              </text>
              <text
                x={x}
                y={y - 45}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                [{index}]
              </text>

              {/* Draw edges to children */}
              {[2 * index, 2 * index + 1].map(childIndex => {
                if (childIndex >= deap.length || !deap[childIndex]) return null;

                const childLevel = Math.floor(Math.log2(childIndex));
                const childPositionInLevel = childIndex - Math.pow(2, childLevel);
                const childNodesInLevel = Math.pow(2, childLevel);
                const childSpacing = 600 / (childNodesInLevel + 1);

                const childX = childSpacing * (childPositionInLevel + 1);
                const childY = 50 + childLevel * levelHeight;

                return (
                  <line
                    key={childIndex}
                    x1={x}
                    y1={y + nodeSize}
                    x2={childX}
                    y2={childY - nodeSize}
                    stroke="#6b7280"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(50, 350)">
          <text x="0" y="0" fontSize="12" fontWeight="bold" fill="#374151">Legend:</text>
          <circle cx="10" cy="15" r="8" fill="#10b981"/>
          <text x="25" y="20" fontSize="10" fill="#374151">Min Root</text>
          <circle cx="90" cy="15" r="8" fill="#ef4444"/>
          <text x="105" y="20" fontSize="10" fill="#374151">Max Root</text>
          <circle cx="170" cy="15" r="8" fill="#3b82f6"/>
          <text x="185" y="20" fontSize="10" fill="#374151">Min Heap</text>
          <circle cx="250" cy="15" r="8" fill="#f59e0b"/>
          <text x="265" y="20" fontSize="10" fill="#374151">Max Heap</text>
        </g>
      </svg>
    );
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>DEAP (Double-Ended Array Priority queue)</h2>
        <p>A data structure that supports both minimum and maximum operations efficiently in a single array.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Insert Value</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnimating}
            placeholder="Enter number to insert"
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
          className="btn btn-secondary"
          onClick={findMin}
          disabled={isAnimating}
        >
          Find Min
        </button>

        <button
          className="btn btn-secondary"
          onClick={findMax}
          disabled={isAnimating}
        >
          Find Max
        </button>

        <button
          className="btn btn-danger"
          onClick={deleteMin}
          disabled={isAnimating}
        >
          Delete Min
        </button>

        <button
          className="btn btn-danger"
          onClick={deleteMax}
          disabled={isAnimating}
        >
          Delete Max
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetDeap}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>DEAP Structure</h3>
          <div style={{
            width: '100%',
            height: '450px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'auto',
            background: 'var(--bg-secondary)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '20px'
          }}>
            {renderDeapTree()}
          </div>
        </div>

        <div className="section">
          <h3>Array Representation</h3>
          <div className="value-list" style={{ marginBottom: '16px' }}>
            {deap.map((value, index) => (
              <div
                key={index}
                className={`value-item ${
                  highlightedIndices.includes(index) ? 'highlight' :
                  index === 0 ? 'sorted' :
                  index === 2 || index === 3 ? 'highlight' : ''
                }`}
                style={{
                  position: 'relative',
                  backgroundColor:
                    index === 0 ? '#e5e7eb' :
                    highlightedIndices.includes(index) ? '#fbbf24' :
                    index === 2 ? '#10b981' :
                    index === 3 ? '#ef4444' :
                    isMinHeap(index) ? '#3b82f6' : '#f59e0b',
                  color: index === 0 ? '#374151' : 'white'
                }}
              >
                {index === 0 ? 'null' : value}
                <span style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '10px',
                  color: '#6b7280'
                }}>
                  [{index}]
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>DEAP Properties</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Elements:</span>
              <span className="metric-value">{deap.length - 1}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Min Heap Elements:</span>
              <span className="metric-value">
                {deap.slice(1).filter((_, index) => isMinHeap(index + 1)).length}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Max Heap Elements:</span>
              <span className="metric-value">
                {deap.slice(1).filter((_, index) => !isMinHeap(index + 1)).length}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Current Min:</span>
              <span className="metric-value">{deap.length > 2 ? deap[2] : 'N/A'}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Current Max:</span>
              <span className="metric-value">{deap.length > 3 ? deap[3] : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>DEAP Properties:</h3>
        <ul>
          <li>Index 0 is unused, indices 2-3 are roots of min and max heaps</li>
          <li>Left subtree (even levels) forms a min heap</li>
          <li>Right subtree (odd levels) forms a max heap</li>
          <li>Insert: O(log n) - may require swap between heaps</li>
          <li>Find min/max: O(1) - roots are at indices 2 and 3</li>
          <li>Delete min/max: O(log n) - standard heap deletion</li>
        </ul>
      </div>
    </div>
  );
};

export default DeapViz;