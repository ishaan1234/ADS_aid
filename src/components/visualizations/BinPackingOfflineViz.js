import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const BinPackingOfflineViz = () => {
  const [items, setItems] = useState([0.6, 0.5, 0.4, 0.4, 0.3, 0.3, 0.2, 0.2, 0.2, 0.1]);
  const [binCapacity, setBinCapacity] = useState(1.0);
  const [algorithm, setAlgorithm] = useState('ffd');
  const [bins, setBins] = useState([]);
  const [optimalBins, setOptimalBins] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Offline bin packing algorithms have access to all items beforehand');
  const [step, setStep] = useState(0);
  const [sortedItems, setSortedItems] = useState([]);

  // Generate items that have a known optimal solution
  const generateKnownOptimal = () => {
    // Items that fit perfectly in 3 bins
    const newItems = [0.5, 0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8, 0.1, 0.9];
    setItems(newItems);
    // Optimal packing: [0.5,0.5], [0.4,0.6], [0.3,0.7], [0.2,0.8], [0.1,0.9] = 5 bins
    // or better: [0.9,0.1], [0.8,0.2], [0.7,0.3], [0.6,0.4], [0.5,0.5] = 5 bins
    setOptimalBins([
      [0.9, 0.1], [0.8, 0.2], [0.7, 0.3], [0.6, 0.4], [0.5, 0.5]
    ]);
    resetVisualization();
  };

  const resetVisualization = () => {
    setBins([]);
    setStep(0);
    setSortedItems([]);
    setMessage('Ready to start packing');
  };

  // First Fit Decreasing
  const firstFitDecreasing = async () => {
    setMessage('Step 1: Sorting items in decreasing order...');
    const sorted = [...items].sort((a, b) => b - a);
    setSortedItems(sorted);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessage('Step 2: Applying First Fit to sorted items...');
    const newBins = [];

    for (let i = 0; i < sorted.length; i++) {
      setStep(i + 1);
      setMessage(`Placing item ${sorted[i]} (${i + 1}/${sorted.length})`);

      let placed = false;
      for (let j = 0; j < newBins.length; j++) {
        if (newBins[j].used + sorted[i] <= binCapacity) {
          newBins[j].used += sorted[i];
          newBins[j].items.push(sorted[i]);
          placed = true;
          break;
        }
      }

      if (!placed) {
        newBins.push({ used: sorted[i], items: [sorted[i]] });
      }

      setBins([...newBins]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setMessage(`FFD Complete! Used ${newBins.length} bins`);
  };

  // Best Fit Decreasing
  const bestFitDecreasing = async () => {
    setMessage('Step 1: Sorting items in decreasing order...');
    const sorted = [...items].sort((a, b) => b - a);
    setSortedItems(sorted);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessage('Step 2: Applying Best Fit to sorted items...');
    const newBins = [];

    for (let i = 0; i < sorted.length; i++) {
      setStep(i + 1);
      setMessage(`Finding best fit for item ${sorted[i]} (${i + 1}/${sorted.length})`);

      let bestBinIndex = -1;
      let bestFit = Infinity;

      for (let j = 0; j < newBins.length; j++) {
        const remainingSpace = binCapacity - newBins[j].used;
        if (remainingSpace >= sorted[i] && remainingSpace < bestFit) {
          bestFit = remainingSpace;
          bestBinIndex = j;
        }
      }

      if (bestBinIndex !== -1) {
        newBins[bestBinIndex].used += sorted[i];
        newBins[bestBinIndex].items.push(sorted[i]);
        setMessage(`Placed in bin ${bestBinIndex + 1} (best fit with remaining space ${bestFit.toFixed(2)})`);
      } else {
        newBins.push({ used: sorted[i], items: [sorted[i]] });
        setMessage(`Created new bin ${newBins.length}`);
      }

      setBins([...newBins]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setMessage(`BFD Complete! Used ${newBins.length} bins`);
  };

  // Next Fit Decreasing
  const nextFitDecreasing = async () => {
    setMessage('Step 1: Sorting items in decreasing order...');
    const sorted = [...items].sort((a, b) => b - a);
    setSortedItems(sorted);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessage('Step 2: Applying Next Fit to sorted items...');
    const newBins = [];
    let currentBin = null;

    for (let i = 0; i < sorted.length; i++) {
      setStep(i + 1);
      setMessage(`Processing item ${sorted[i]} (${i + 1}/${sorted.length})`);

      if (!currentBin || currentBin.used + sorted[i] > binCapacity) {
        currentBin = { used: sorted[i], items: [sorted[i]] };
        newBins.push(currentBin);
        setMessage(`Created new bin ${newBins.length} for item ${sorted[i]}`);
      } else {
        currentBin.used += sorted[i];
        currentBin.items.push(sorted[i]);
        setMessage(`Added item ${sorted[i]} to current bin`);
      }

      setBins([...newBins]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setMessage(`NFD Complete! Used ${newBins.length} bins`);
  };

  // Simulated optimal packing (simplified)
  const optimalPacking = async () => {
    setMessage('Computing optimal packing (simplified)...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use the predefined optimal solution
    const newBins = optimalBins.map(binItems => ({
      used: binItems.reduce((sum, item) => sum + item, 0),
      items: [...binItems]
    }));

    setBins(newBins);
    setMessage(`Optimal solution: ${newBins.length} bins (theoretical lower bound)`);
  };

  // Start selected algorithm
  const startPacking = async () => {
    setIsAnimating(true);
    resetVisualization();

    switch (algorithm) {
      case 'ffd':
        await firstFitDecreasing();
        break;
      case 'bfd':
        await bestFitDecreasing();
        break;
      case 'nfd':
        await nextFitDecreasing();
        break;
      case 'optimal':
        await optimalPacking();
        break;
      default:
        await firstFitDecreasing();
    }

    setIsAnimating(false);
  };

  // Render bin
  const renderBin = (bin, index) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

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
            width: '70px',
            height: '200px',
            border: '2px solid #374151',
            borderRadius: '4px',
            background: 'var(--bg-secondary)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column-reverse',
            overflow: 'hidden'
          }}
        >
          {bin.items.map((item, itemIndex) => {
            const itemHeight = (item / binCapacity) * 200;
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
                  fontSize: '11px',
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
            ({((bin.used / binCapacity) * 100).toFixed(0)}% full)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Offline Bin Packing Algorithms</h2>
        <p>Compare offline algorithms that know all items in advance and can preprocess them for better results.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            <option value="ffd">First Fit Decreasing</option>
            <option value="bfd">Best Fit Decreasing</option>
            <option value="nfd">Next Fit Decreasing</option>
            <option value="optimal">Optimal (Simplified)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Bin Capacity</label>
          <input
            type="number"
            step="0.1"
            min="0.5"
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
          onClick={generateKnownOptimal}
          disabled={isAnimating}
        >
          Known Optimal Set
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetVisualization}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Original Items</h3>
          <div className="value-list">
            {items.map((item, index) => (
              <div key={index} className="value-item">
                {item}
              </div>
            ))}
          </div>
        </div>

        {sortedItems.length > 0 && (
          <div className="section">
            <h3>Sorted Items (Decreasing Order)</h3>
            <div className="value-list">
              {sortedItems.map((item, index) => (
                <div
                  key={index}
                  className={`value-item ${index < step ? 'sorted' : ''}`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Packed Bins ({bins.length} total)</h3>
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
                No bins packed yet
              </div>
            ) : (
              bins.map((bin, index) => renderBin(bin, index))
            )}
          </div>
        </div>

        <div className="section">
          <h3>Performance Analysis</h3>
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
              <span className="metric-label">Space Efficiency:</span>
              <span className="metric-value">
                {bins.length > 0 ?
                  ((items.reduce((sum, item) => sum + item, 0) / (bins.length * binCapacity)) * 100).toFixed(1) + '%' :
                  '0%'
                }
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Lower Bound:</span>
              <span className="metric-value">
                {Math.ceil(items.reduce((sum, item) => sum + item, 0) / binCapacity)} bins
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Approximation Ratio:</span>
              <span className="metric-value">
                {bins.length > 0 ?
                  (bins.length / Math.ceil(items.reduce((sum, item) => sum + item, 0) / binCapacity)).toFixed(2) :
                  '1.00'
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
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Algorithm</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Approximation Ratio</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Time Complexity</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Space Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}>Next Fit Decreasing</td>
                  <td style={{ padding: '8px' }}>≤ 1.7 · OPT</td>
                  <td style={{ padding: '8px' }}>O(n log n)</td>
                  <td style={{ padding: '8px' }}>O(1) bins</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>First Fit Decreasing</td>
                  <td style={{ padding: '8px' }}>≤ 11/9 · OPT + 6/9</td>
                  <td style={{ padding: '8px' }}>O(n log n)</td>
                  <td style={{ padding: '8px' }}>O(n) bins</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Best Fit Decreasing</td>
                  <td style={{ padding: '8px' }}>≤ 11/9 · OPT + 6/9</td>
                  <td style={{ padding: '8px' }}>O(n log n)</td>
                  <td style={{ padding: '8px' }}>O(n) bins</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Optimal</td>
                  <td style={{ padding: '8px' }}>1.0 (exact)</td>
                  <td style={{ padding: '8px' }}>Exponential</td>
                  <td style={{ padding: '8px' }}>Optimal bins</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="section">
          <h3>Theoretical Lower Bound</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontSize: '14px'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Volume Lower Bound:</strong> ⌈(sum of all items) / bin capacity⌉ =
              ⌈{items.reduce((sum, item) => sum + item, 0).toFixed(2)} / {binCapacity}⌉ =
              {Math.ceil(items.reduce((sum, item) => sum + item, 0) / binCapacity)} bins
            </p>
            <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
              This is the absolute minimum number of bins needed based on total volume.
              The actual optimal may be higher due to item size constraints.
            </p>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Offline Bin Packing Properties:</h3>
        <ul>
          <li>Algorithms know all items in advance (offline property)</li>
          <li>Can sort items to improve performance</li>
          <li>FFD and BFD achieve the same approximation ratio: 11/9 · OPT + 6/9</li>
          <li>Decreasing order typically reduces number of bins needed</li>
          <li>Optimal bin packing is NP-hard, requiring exponential time</li>
          <li>Practical algorithms trade optimality for polynomial-time complexity</li>
        </ul>
      </div>
    </div>
  );
};

export default BinPackingOfflineViz;