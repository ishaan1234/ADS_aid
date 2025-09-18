import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const WinnerTreeViz = () => {
  const [sequences, setSequences] = useState([
    { id: 0, values: [1, 4, 7, 10], index: 0, color: '#3b82f6' },
    { id: 1, values: [2, 5, 8, 11], index: 0, color: '#ef4444' },
    { id: 2, values: [3, 6, 9, 12], index: 0, color: '#10b981' },
    { id: 3, values: [13, 14, 15, 16], index: 0, color: '#f59e0b' }
  ]);
  const [tree, setTree] = useState([]);
  const [outputSequence, setOutputSequence] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Click "Initialize Tree" to build the winner tree');
  const [highlightedNode, setHighlightedNode] = useState(-1);
  const [step, setStep] = useState(0);

  // Initialize the winner tree
  const initializeTree = async () => {
    setIsAnimating(true);
    setMessage('Building winner tree...');
    setOutputSequence([]);
    setStep(0);

    // Reset sequence indices
    const resetSequences = sequences.map(seq => ({ ...seq, index: 0 }));
    setSequences(resetSequences);

    const n = sequences.length;
    const treeSize = 2 * n - 1;
    const newTree = new Array(treeSize).fill(null);

    // Initialize leaf nodes (external nodes)
    for (let i = 0; i < n; i++) {
      const leafIndex = n - 1 + i;
      newTree[leafIndex] = {
        isLeaf: true,
        sequenceId: i,
        value: resetSequences[i].values[0],
        winner: i
      };
    }

    setTree([...newTree]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Build internal nodes bottom-up
    for (let i = n - 2; i >= 0; i--) {
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      const leftWinner = newTree[leftChild].winner;
      const rightWinner = newTree[rightChild].winner;

      const leftValue = getCurrentValue(resetSequences, leftWinner);
      const rightValue = getCurrentValue(resetSequences, rightWinner);

      let winner;
      if (leftValue === null && rightValue === null) {
        winner = null;
      } else if (leftValue === null) {
        winner = rightWinner;
      } else if (rightValue === null) {
        winner = leftWinner;
      } else {
        winner = leftValue <= rightValue ? leftWinner : rightWinner;
      }

      newTree[i] = {
        isLeaf: false,
        winner: winner,
        leftChild,
        rightChild
      };

      setHighlightedNode(i);
      setTree([...newTree]);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setHighlightedNode(-1);
    setMessage('Winner tree built! Root contains the overall winner. Click "Extract Winner" to start merging.');
    setIsAnimating(false);
  };

  // Get current value for a sequence
  const getCurrentValue = (seqs, sequenceId) => {
    if (sequenceId === null || sequenceId === undefined) return null;
    const seq = seqs[sequenceId];
    if (seq.index >= seq.values.length) return null;
    return seq.values[seq.index];
  };

  // Extract winner and update tree
  const extractWinner = async () => {
    if (tree.length === 0 || tree[0].winner === null) return;

    setIsAnimating(true);
    const winnerId = tree[0].winner;
    const winnerValue = getCurrentValue(sequences, winnerId);

    setMessage(`Extracting winner: ${winnerValue} from sequence ${winnerId}`);
    setOutputSequence(prev => [...prev, { value: winnerValue, sourceSeq: winnerId }]);

    // Advance the winner sequence
    const newSequences = [...sequences];
    newSequences[winnerId].index++;
    setSequences(newSequences);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the tree from the leaf up to root
    await updateTreePath(winnerId, newSequences);

    setStep(prev => prev + 1);
    setMessage(`Winner ${winnerValue} extracted. Updated tree for next extraction.`);
    setIsAnimating(false);
  };

  // Update tree path from leaf to root
  const updateTreePath = async (sequenceId, newSequences) => {
    const n = sequences.length;
    const leafIndex = n - 1 + sequenceId;
    const newTree = [...tree];

    // Update leaf node
    const newValue = getCurrentValue(newSequences, sequenceId);
    newTree[leafIndex].value = newValue;
    setHighlightedNode(leafIndex);
    setTree([...newTree]);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update internal nodes from leaf to root
    let currentIndex = Math.floor((leafIndex - 1) / 2);

    while (currentIndex >= 0) {
      const leftChild = 2 * currentIndex + 1;
      const rightChild = 2 * currentIndex + 2;

      const leftWinner = newTree[leftChild].winner;
      const rightWinner = newTree[rightChild].winner;

      const leftValue = getCurrentValue(newSequences, leftWinner);
      const rightValue = getCurrentValue(newSequences, rightWinner);

      let winner;
      if (leftValue === null && rightValue === null) {
        winner = null;
      } else if (leftValue === null) {
        winner = rightWinner;
      } else if (rightValue === null) {
        winner = leftWinner;
      } else {
        winner = leftValue <= rightValue ? leftWinner : rightWinner;
      }

      newTree[currentIndex].winner = winner;

      setHighlightedNode(currentIndex);
      setTree([...newTree]);
      await new Promise(resolve => setTimeout(resolve, 300));

      if (currentIndex === 0) break;
      currentIndex = Math.floor((currentIndex - 1) / 2);
    }

    setHighlightedNode(-1);
  };

  // Extract all remaining winners
  const extractAllWinners = async () => {
    while (tree.length > 0 && tree[0].winner !== null) {
      await extractWinner();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    setMessage('All values extracted! Merge complete.');
  };

  const resetVisualization = () => {
    setTree([]);
    setOutputSequence([]);
    const resetSequences = sequences.map(seq => ({ ...seq, index: 0 }));
    setSequences(resetSequences);
    setHighlightedNode(-1);
    setStep(0);
    setMessage('Click "Initialize Tree" to build the winner tree');
  };

  // Render tree node
  const renderTreeNode = (node, index, level, position) => {
    if (!node) return null;

    const x = 50 + position * 100;
    const y = 50 + level * 80;

    const isHighlighted = index === highlightedNode;
    const nodeColor = node.isLeaf ?
      (node.sequenceId !== undefined ? sequences[node.sequenceId]?.color : '#64748b') :
      '#64748b';

    return (
      <g key={index}>
        <circle
          cx={x}
          cy={y}
          r="25"
          fill={isHighlighted ? '#fbbf24' : (node.winner !== null ? nodeColor : '#e5e7eb')}
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          fontSize="12"
          fill="white"
          fontWeight="bold"
        >
          {node.isLeaf ? `S${node.sequenceId}` : 'W'}
        </text>
        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          fontSize="10"
          fill="white"
        >
          {node.winner !== null ? getCurrentValue(sequences, node.winner) || 'END' : 'NULL'}
        </text>

        {/* Draw edges to children */}
        {!node.isLeaf && node.leftChild !== undefined && tree[node.leftChild] && (
          <>
            <line
              x1={x - 15}
              y1={y + 20}
              x2={50 + (position * 2) * 100 - 15}
              y2={50 + (level + 1) * 80 - 20}
              stroke="#6b7280"
              strokeWidth="2"
            />
            <line
              x1={x + 15}
              y1={y + 20}
              x2={50 + (position * 2 + 1) * 100 + 15}
              y2={50 + (level + 1) * 80 - 20}
              stroke="#6b7280"
              strokeWidth="2"
            />
          </>
        )}
      </g>
    );
  };

  // Calculate tree layout
  const getTreeLayout = () => {
    if (tree.length === 0) return [];

    const n = sequences.length;
    const levels = Math.ceil(Math.log2(n)) + 1;
    const layout = [];

    // Calculate positions for each level
    for (let level = 0; level < levels; level++) {
      const startIndex = level === levels - 1 ? n - 1 : Math.pow(2, level) - 1;
      const endIndex = level === levels - 1 ? 2 * n - 2 : Math.pow(2, level + 1) - 2;

      for (let i = startIndex; i <= endIndex && i < tree.length; i++) {
        const positionInLevel = level === levels - 1 ? i - (n - 1) : i - startIndex;
        layout.push({
          index: i,
          level: level,
          position: positionInLevel
        });
      }
    }

    return layout;
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Winner Tree for k-Way Merge</h2>
        <p>Demonstrates how a winner tree efficiently finds the minimum element in k-way merge operations.</p>
      </div>

      <div className="viz-controls">
        <button
          className="btn btn-primary"
          onClick={initializeTree}
          disabled={isAnimating}
        >
          Initialize Tree
        </button>

        <button
          className="btn btn-secondary"
          onClick={extractWinner}
          disabled={isAnimating || tree.length === 0 || tree[0]?.winner === null}
        >
          Extract Winner
        </button>

        <button
          className="btn btn-secondary"
          onClick={extractAllWinners}
          disabled={isAnimating || tree.length === 0 || tree[0]?.winner === null}
        >
          Extract All
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
          <h3>Input Sequences</h3>
          {sequences.map((seq, seqIndex) => (
            <div key={seq.id} className="run-display" style={{ marginBottom: '12px' }}>
              <strong style={{ color: seq.color }}>Sequence {seq.id}:</strong>
              <div className="value-list" style={{ marginTop: '8px' }}>
                {seq.values.map((value, index) => (
                  <div
                    key={index}
                    className={`value-item ${
                      index < seq.index ? 'sorted' :
                      index === seq.index ? 'highlight' : ''
                    }`}
                    style={{
                      borderColor: index === seq.index ? seq.color : undefined,
                      backgroundColor: index === seq.index ? seq.color : undefined,
                      color: index === seq.index ? 'white' : undefined
                    }}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {tree.length > 0 && (
          <div className="section">
            <h3>Winner Tree</h3>
            <div style={{
              width: '100%',
              height: '400px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'auto',
              background: 'var(--bg-secondary)'
            }}>
              <svg width="600" height="350">
                {getTreeLayout().map(({ index, level, position }) =>
                  renderTreeNode(tree[index], index, level, position)
                )}
              </svg>
            </div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Leaf nodes (S0-S3) represent sequences. Internal nodes (W) contain winners.
            </p>
          </div>
        )}

        <div className="section">
          <h3>Merged Output</h3>
          <div className="value-list">
            {outputSequence.map((item, index) => (
              <div
                key={index}
                className="value-item sorted"
                style={{
                  borderColor: sequences[item.sourceSeq]?.color,
                  position: 'relative'
                }}
              >
                {item.value}
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  fontSize: '10px',
                  background: sequences[item.sourceSeq]?.color,
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.sourceSeq}
                </span>
              </div>
            ))}
          </div>
          {outputSequence.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
              No values extracted yet
            </p>
          )}
        </div>

        <div className="section">
          <h3>Algorithm Statistics</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Extraction Steps:</span>
              <span className="metric-value">{step}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Values Remaining:</span>
              <span className="metric-value">
                {sequences.reduce((sum, seq) => sum + (seq.values.length - seq.index), 0)}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Tree Updates per Extract:</span>
              <span className="metric-value">O(log k) = {Math.ceil(Math.log2(sequences.length))}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Total Comparisons:</span>
              <span className="metric-value">{step * Math.ceil(Math.log2(sequences.length))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Winner Tree Properties:</h3>
        <ul>
          <li>Complete binary tree with k leaves for k sequences</li>
          <li>Each internal node stores the "winner" (smaller value) of its children</li>
          <li>Root always contains the global minimum</li>
          <li>Extract minimum: O(log k) time complexity</li>
          <li>More efficient than scanning all sequences: O(k) → O(log k)</li>
          <li>Essential for external sorting with limited memory</li>
        </ul>
      </div>
    </div>
  );
};

export default WinnerTreeViz;