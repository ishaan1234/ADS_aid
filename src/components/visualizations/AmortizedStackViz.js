import React, { useState, useCallback } from 'react';
import './VisualizationBase.css';

const AmortizedStackViz = () => {
  const [array, setArray] = useState([1, 2, 3]);
  const [capacity, setCapacity] = useState(4);
  const [operations, setOperations] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const push = useCallback(() => {
    if (!inputValue || isAnimating) return;

    setIsAnimating(true);
    const value = parseInt(inputValue);
    const newArray = [...array, value];
    let cost = 1; // Cost of adding one element
    let newCapacity = capacity;
    let operationType = 'Push';

    // Check if we need to resize
    if (newArray.length > capacity) {
      newCapacity = capacity * 2;
      cost = newArray.length; // Cost includes copying all elements
      operationType = 'Push (with resize)';
    }

    const newOp = {
      type: operationType,
      value: value,
      cost: cost,
      amortizedCost: 3, // Amortized cost is always 3
      newSize: newArray.length,
      newCapacity: newCapacity
    };

    setTimeout(() => {
      setArray(newArray);
      setCapacity(newCapacity);
      setOperations(prev => [...prev.slice(-9), newOp]);
      setTotalCost(prev => prev + cost);
      setInputValue('');
      setIsAnimating(false);
    }, 500);
  }, [array, capacity, inputValue, isAnimating]);

  const pop = useCallback(() => {
    if (array.length === 0 || isAnimating) return;

    setIsAnimating(true);
    const newArray = array.slice(0, -1);
    const cost = 1;

    const newOp = {
      type: 'Pop',
      value: array[array.length - 1],
      cost: cost,
      amortizedCost: 1,
      newSize: newArray.length,
      newCapacity: capacity
    };

    setTimeout(() => {
      setArray(newArray);
      setOperations(prev => [...prev.slice(-9), newOp]);
      setTotalCost(prev => prev + cost);
      setIsAnimating(false);
    }, 500);
  }, [array, capacity, isAnimating]);

  const reset = () => {
    setArray([1, 2, 3]);
    setCapacity(4);
    setOperations([]);
    setTotalCost(0);
    setInputValue('');
    setIsAnimating(false);
  };

  const amortizedAverage = operations.length > 0
    ? (totalCost / operations.length).toFixed(2)
    : '0';

  return (
    <div className="viz-container">
      <div className="viz-header">
        <h2>Dynamic Array (Amortized Analysis)</h2>
        <p>Visualize how array doubling achieves O(1) amortized time</p>
      </div>

      <div className="viz-content">
        <div className="array-visualization">
          <div className="array-info">
            <span>Size: {array.length}</span>
            <span>Capacity: {capacity}</span>
            <span>Load Factor: {((array.length / capacity) * 100).toFixed(0)}%</span>
          </div>

          <div className="array-container">
            <div className="array-cells" style={{ gridTemplateColumns: `repeat(${capacity}, 1fr)` }}>
              {Array.from({ length: capacity }).map((_, index) => (
                <div
                  key={index}
                  className={`array-cell ${index < array.length ? 'filled' : 'empty'}
                            ${index === array.length - 1 && isAnimating ? 'highlighting' : ''}`}
                >
                  {index < array.length ? array[index] : ''}
                </div>
              ))}
            </div>
            {capacity > array.length && (
              <div className="capacity-indicator">
                <span>Available: {capacity - array.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="controls-section">
          <div className="input-group">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              disabled={isAnimating}
            />
            <button onClick={push} disabled={!inputValue || isAnimating}>
              Push
            </button>
            <button onClick={pop} disabled={array.length === 0 || isAnimating}>
              Pop
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="analysis-section">
          <h3>Cost Analysis</h3>
          <div className="cost-summary">
            <div className="cost-card">
              <span className="cost-label">Total Actual Cost</span>
              <span className="cost-value">{totalCost}</span>
            </div>
            <div className="cost-card">
              <span className="cost-label">Operations</span>
              <span className="cost-value">{operations.length}</span>
            </div>
            <div className="cost-card highlight">
              <span className="cost-label">Average Cost</span>
              <span className="cost-value">{amortizedAverage}</span>
            </div>
          </div>

          <div className="operations-log">
            <h4>Recent Operations</h4>
            <div className="operations-list">
              {operations.length === 0 ? (
                <div className="empty-log">No operations yet. Try pushing some values!</div>
              ) : (
                operations.map((op, index) => (
                  <div key={index} className={`operation-item ${op.type.includes('resize') ? 'resize' : ''}`}>
                    <span className="op-type">{op.type}</span>
                    <span className="op-value">Value: {op.value}</span>
                    <span className="op-cost">Cost: {op.cost}</span>
                    <span className="op-amortized">Amortized: {op.amortizedCost}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="explanation-section">
          <h3>How Amortization Works</h3>
          <div className="explanation-grid">
            <div className="explanation-card">
              <h4>Accounting Method</h4>
              <p>Each push operation is charged 3 units:</p>
              <ul>
                <li>1 unit for the actual insertion</li>
                <li>1 unit saved for future copy of this element</li>
                <li>1 unit to help copy an old element</li>
              </ul>
            </div>
            <div className="explanation-card">
              <h4>Doubling Strategy</h4>
              <p>When the array is full:</p>
              <ul>
                <li>Allocate new array of double size</li>
                <li>Copy all n elements (cost: n)</li>
                <li>But we've saved 2n credits!</li>
              </ul>
            </div>
            <div className="explanation-card">
              <h4>Result</h4>
              <p>Even though resize is expensive (O(n)):</p>
              <ul>
                <li>Resizes happen rarely (every n operations)</li>
                <li>Average cost per operation: O(1)</li>
                <li>This is amortized O(1) complexity!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .array-visualization {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .array-info {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
          font-size: 1.1rem;
        }

        .array-info span {
          color: #666;
        }

        .array-container {
          position: relative;
        }

        .array-cells {
          display: grid;
          gap: 4px;
          margin-bottom: 1rem;
        }

        .array-cell {
          height: 60px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .array-cell.filled {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .array-cell.empty {
          background: #f8f9fa;
          border-style: dashed;
          color: #ccc;
        }

        .array-cell.highlighting {
          animation: pulse 0.5s ease;
          transform: scale(1.1);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.1); }
        }

        .capacity-indicator {
          text-align: center;
          color: #28a745;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }

        .cost-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .cost-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .cost-card.highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .cost-label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }

        .cost-value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
        }

        .operations-log {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .operations-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .operation-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
          font-size: 0.9rem;
        }

        .operation-item.resize {
          background: #fff3cd;
        }

        .empty-log {
          text-align: center;
          color: #999;
          padding: 2rem;
        }

        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .explanation-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .explanation-card h4 {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .explanation-card ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .explanation-card li {
          margin: 0.5rem 0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AmortizedStackViz;