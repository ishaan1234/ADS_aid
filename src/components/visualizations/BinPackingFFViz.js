import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const BinPackingFFViz = () => {
  const [items, setItems] = useState([0.7, 0.5, 0.3, 0.2, 0.8, 0.4, 0.6, 0.1, 0.9, 0.35]);
  const [binCapacity, setBinCapacity] = useState(1.0);
  const [algorithm, setAlgorithm] = useState('first-fit');
  const [bins, setBins] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Click "Start Packing" to begin bin packing simulation');
  const [highlightedBin, setHighlightedBin] = useState(-1);
  const [packingStats, setPackingStats] = useState({ comparisons: 0, moves: 0 });

  // Generate random items
  const generateRandomItems = () => {
    const newItems = Array.from({ length: 10 }, () =>
      Math.round((Math.random() * 0.8 + 0.1) * 100) / 100
    );
    setItems(newItems);
    resetPacking();
  };

  // Reset packing state
  const resetPacking = () => {
    setBins([]);
    setCurrentItemIndex(-1);
    setHighlightedBin(-1);
    setPackingStats({ comparisons: 0, moves: 0 });
    setMessage('Ready to start packing');
  };

  // First Fit algorithm
  const firstFit = async (itemSize) => {
    let placed = false;
    let comparisons = 0;

    for (let i = 0; i < bins.length; i++) {
      comparisons++;
      setHighlightedBin(i);
      setMessage(`Checking bin ${i + 1}: used ${bins[i].used.toFixed(2)}/${binCapacity}, need ${itemSize}`);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (bins[i].used + itemSize <= binCapacity) {
        bins[i].used += itemSize;
        bins[i].items.push(itemSize);
        setMessage(`Item ${itemSize} placed in bin ${i + 1}`);
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newBin = { used: itemSize, items: [itemSize] };
      setBins(prev => [...prev, newBin]);
      setHighlightedBin(bins.length);
      setMessage(`Item ${itemSize} placed in new bin ${bins.length + 1}`);
    }

    return comparisons;
  };

  // Best Fit algorithm
  const bestFit = async (itemSize) => {
    let bestBinIndex = -1;
    let bestFit = Infinity;
    let comparisons = 0;

    setMessage(`Finding best fit for item ${itemSize}...`);

    for (let i = 0; i < bins.length; i++) {
      comparisons++;
      setHighlightedBin(i);
      setMessage(`Checking bin ${i + 1}: used ${bins[i].used.toFixed(2)}/${binCapacity}, remaining space ${(binCapacity - bins[i].used).toFixed(2)}`);
      await new Promise(resolve => setTimeout(resolve, 600));

      const remainingSpace = binCapacity - bins[i].used;
      if (remainingSpace >= itemSize && remainingSpace < bestFit) {
        bestFit = remainingSpace;
        bestBinIndex = i;
        setMessage(`New best fit: bin ${i + 1} with remaining space ${remainingSpace.toFixed(2)}`);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }

    if (bestBinIndex !== -1) {
      setHighlightedBin(bestBinIndex);
      bins[bestBinIndex].used += itemSize;
      bins[bestBinIndex].items.push(itemSize);
      setMessage(`Item ${itemSize} placed in best fit bin ${bestBinIndex + 1}`);
    } else {
      const newBin = { used: itemSize, items: [itemSize] };
      setBins(prev => [...prev, newBin]);
      setHighlightedBin(bins.length);
      setMessage(`Item ${itemSize} placed in new bin ${bins.length + 1}`);
    }

    return comparisons;
  };

  // First Fit Decreasing
  const firstFitDecreasing = async () => {
    setMessage('Sorting items in decreasing order...');
    const sortedItems = [...items].sort((a, b) => b - a);
    setItems(sortedItems);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return await runAlgorithm(sortedItems, firstFit);
  };

  // Best Fit Decreasing
  const bestFitDecreasing = async () => {
    setMessage('Sorting items in decreasing order...');
    const sortedItems = [...items].sort((a, b) => b - a);
    setItems(sortedItems);
    await new Promise(resolve => setTimeout(resolve, 1000));

    return await runAlgorithm(sortedItems, bestFit);
  };

  // Run algorithm helper
  const runAlgorithm = async (itemList, algorithm) => {
    let totalComparisons = 0;
    let totalMoves = 0;

    for (let i = 0; i < itemList.length; i++) {
      setCurrentItemIndex(i);
      setMessage(`Processing item ${i + 1}: size ${itemList[i]}`);
      await new Promise(resolve => setTimeout(resolve, 500));

      const comparisons = await algorithm(itemList[i]);
      totalComparisons += comparisons;
      totalMoves++;

      setPackingStats({ comparisons: totalComparisons, moves: totalMoves });
      setBins([...bins]); // Force re-render
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setHighlightedBin(-1);
    setCurrentItemIndex(-1);
    return { comparisons: totalComparisons, moves: totalMoves };
  };

  // Start packing process
  const startPacking = async () => {
    setIsAnimating(true);
    resetPacking();

    let result;
    switch (algorithm) {
      case 'first-fit':
        result = await runAlgorithm(items, firstFit);
        break;
      case 'best-fit':
        result = await runAlgorithm(items, bestFit);
        break;
      case 'first-fit-decreasing':
        result = await firstFitDecreasing();
        break;
      case 'best-fit-decreasing':
        result = await bestFitDecreasing();
        break;
      default:
        result = await runAlgorithm(items, firstFit);
    }

    const efficiency = (items.reduce((sum, item) => sum + item, 0) / (bins.length * binCapacity) * 100).toFixed(1);
    setMessage(`Packing complete! Used ${bins.length} bins with ${efficiency}% efficiency`);
    setIsAnimating(false);
  };

  // Render bin visualization
  const renderBin = (bin, index) => {
    const isHighlighted = index === highlightedBin;
    const fillHeight = (bin.used / binCapacity) * 200;

    return (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 8px'
        }}
      >
        <div
          style={{
            width: '60px',
            height: '220px',
            border: `2px solid ${isHighlighted ? '#fbbf24' : '#374151'}`,
            borderRadius: '4px',
            background: 'var(--bg-secondary)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflow: 'hidden'
          }}
        >
          {/* Items stacked in bin */}
          {bin.items.map((item, itemIndex) => {
            const itemHeight = (item / binCapacity) * 200;
            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
            return (
              <div
                key={itemIndex}
                style={{
                  height: `${itemHeight}px`,
                  backgroundColor: colors[itemIndex % colors.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                {item}
              </div>
            );
          })}
        </div>

        <div style={{
          marginTop: '8px',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <div><strong>Bin {index + 1}</strong></div>
          <div style={{ color: 'var(--text-secondary)' }}>
            {bin.used.toFixed(2)}/{binCapacity}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            ({((bin.used / binCapacity) * 100).toFixed(1)}%)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Bin Packing: First Fit vs Best Fit</h2>
        <p>Compare different bin packing algorithms and their efficiency in minimizing the number of bins used.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            <option value="first-fit">First Fit</option>
            <option value="best-fit">Best Fit</option>
            <option value="first-fit-decreasing">First Fit Decreasing</option>
            <option value="best-fit-decreasing">Best Fit Decreasing</option>
          </select>
        </div>

        <div className="control-group">
          <label>Bin Capacity</label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            max="2.0"
            value={binCapacity}
            onChange={(e) => setBinCapacity(parseFloat(e.target.value))}
            disabled={isAnimating}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={startPacking}
          disabled={isAnimating}
        >
          Start Packing
        </button>

        <button
          className="btn btn-secondary"
          onClick={generateRandomItems}
          disabled={isAnimating}
        >
          Random Items
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetPacking}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Items to Pack</h3>
          <div className="value-list">
            {items.map((item, index) => (
              <div
                key={index}
                className={`value-item ${
                  index < currentItemIndex ? 'sorted' :
                  index === currentItemIndex ? 'highlight' : ''
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              placeholder="Enter comma-separated sizes (e.g., 0.5,0.3,0.8)"
              value={items.join(',')}
              onChange={(e) => {
                const values = e.target.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v) && v > 0);
                if (values.length > 0) setItems(values);
              }}
              disabled={isAnimating}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-primary)'
              }}
            />
          </div>
        </div>

        <div className="section">
          <h3>Bins ({bins.length} total)</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '20px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            minHeight: '280px',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            overflowX: 'auto'
          }}>
            {bins.length === 0 ? (
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                No bins created yet
              </div>
            ) : (
              bins.map((bin, index) => renderBin(bin, index))
            )}
          </div>
        </div>

        <div className="section">
          <h3>Algorithm Statistics</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Items:</span>
              <span className="metric-value">{items.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Bins Used:</span>
              <span className="metric-value">{bins.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Bin Comparisons:</span>
              <span className="metric-value">{packingStats.comparisons}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Space Efficiency:</span>
              <span className="metric-value">
                {bins.length > 0 ?
                  ((items.reduce((sum, item) => sum + item, 0) / (bins.length * binCapacity)) * 100).toFixed(1) + '%' :
                  '0%'
                }
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Wasted Space:</span>
              <span className="metric-value">
                {bins.length > 0 ?
                  (bins.length * binCapacity - items.reduce((sum, item) => sum + item, 0)).toFixed(2) :
                  '0'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Algorithm Comparison</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>First Fit</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>O(n) comparisons per item in worst case</li>
                  <li>Simple and fast</li>
                  <li>May not find optimal placement</li>
                  <li>Creates bins sequentially</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Best Fit</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>O(n) comparisons per item always</li>
                  <li>Finds tightest fit</li>
                  <li>Better space utilization</li>
                  <li>More computational overhead</li>
                </ul>
              </div>
            </div>
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <strong>Decreasing variants:</strong> Sort items largest-first before packing for better results
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Bin Packing Algorithms:</h3>
        <ul>
          <li><strong>First Fit:</strong> Place item in first bin that fits</li>
          <li><strong>Best Fit:</strong> Place item in bin with smallest remaining space after fitting</li>
          <li><strong>First/Best Fit Decreasing:</strong> Sort items largest-first, then apply algorithm</li>
          <li>All online algorithms are approximation algorithms</li>
          <li>FFD and BFD achieve 11/9 * OPT + 6/9 approximation ratio</li>
          <li>Optimal bin packing is NP-hard</li>
        </ul>
      </div>
    </div>
  );
};

export default BinPackingFFViz;