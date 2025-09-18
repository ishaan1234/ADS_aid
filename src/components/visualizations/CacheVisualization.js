import React, { useState } from 'react';
import './VisualizationBase.css';

const CacheVisualization = () => {
  const [heapType, setHeapType] = useState('binary');
  const [cacheLineSize, setCacheLineSize] = useState(4);
  const [operation, setOperation] = useState('insert');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Select heap type and operation to see cache behavior');
  const [cacheMisses, setCacheMisses] = useState(0);

  const runSimulation = async () => {
    setIsAnimating(true);
    setCacheMisses(0);

    const height = 5;
    let misses = 0;

    if (heapType === 'binary') {
      misses = Math.floor(Math.log2(Math.pow(2, height)));
      setMessage(`Binary heap: Accessing nodes at different levels causes cache misses`);
    } else if (heapType === '4-ary') {
      misses = Math.floor(Math.log2(Math.pow(2, height)) / 2);
      setMessage(`4-ary heap: Siblings in same cache line, fewer cache misses`);
    } else {
      misses = Math.floor(Math.log2(Math.pow(2, height)) / 2) - 1;
      setMessage(`Cache-aligned 4-heap: Optimal cache utilization with array shift`);
    }

    for (let i = 0; i <= misses; i++) {
      setCacheMisses(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setMessage(`Operation complete. Total cache misses: ${misses}`);
    setIsAnimating(false);
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Cache-Optimized Heap Structures</h2>
        <p>Demonstrates how d-ary heaps and cache alignment reduce cache misses compared to binary heaps.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Heap Type:</label>
          <select value={heapType} onChange={(e) => setHeapType(e.target.value)} disabled={isAnimating}>
            <option value="binary">Binary Heap</option>
            <option value="4-ary">4-ary Heap</option>
            <option value="aligned">Cache-Aligned 4-Heap</option>
          </select>
        </div>

        <div className="control-group">
          <label>Cache Line Size:</label>
          <select value={cacheLineSize} onChange={(e) => setCacheLineSize(Number(e.target.value))} disabled={isAnimating}>
            <option value="2">2 nodes</option>
            <option value="4">4 nodes</option>
            <option value="8">8 nodes</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={runSimulation} disabled={isAnimating}>
          Simulate Operation
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Memory Layout</h3>
          <div className="memory-grid" style={{ gridTemplateColumns: `repeat(${cacheLineSize}, 1fr)` }}>
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                className={`memory-cell ${Math.floor(i / cacheLineSize) % 2 === 0 ? 'even-line' : 'odd-line'}`}
              >
                {i}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Cache Performance</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Heap Type:</span>
              <span className="metric-value">{heapType}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Cache Misses:</span>
              <span className="metric-value" style={{ color: 'var(--error)' }}>{cacheMisses}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Cache Line Size:</span>
              <span className="metric-value">{cacheLineSize} nodes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Cache Optimization Benefits:</h3>
        <ul>
          <li>Binary heap: ~log₂n cache misses</li>
          <li>4-heap: ~log₄n cache misses (50% reduction)</li>
          <li>Cache-aligned: siblings always in same line</li>
          <li>Heapsort speedup: 1.5x to 1.8x</li>
          <li>Better spatial locality</li>
        </ul>
      </div>
    </div>
  );
};

export default CacheVisualization;