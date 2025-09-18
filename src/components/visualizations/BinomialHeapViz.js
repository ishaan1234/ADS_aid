import React, { useState } from 'react';
import './VisualizationBase.css';

const BinomialHeapViz = () => {
  const [trees, setTrees] = useState([
    { degree: 0, nodes: 1, root: 5 },
    { degree: 0, nodes: 1, root: 8 },
    { degree: 1, nodes: 2, root: 3 },
    { degree: 1, nodes: 2, root: 7 },
    { degree: 2, nodes: 4, root: 2 },
    { degree: 2, nodes: 4, root: 6 }
  ]);
  const [combinedTrees, setCombinedTrees] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Click "Pairwise Combine" to see the tree consolidation');

  const pairwiseCombine = async () => {
    setIsAnimating(true);
    setMessage('Starting pairwise combine...');

    const treeTable = new Map();
    const result = [];

    for (const tree of trees) {
      let currentTree = tree;
      let degree = currentTree.degree;

      setMessage(`Processing tree with degree ${degree} and root ${currentTree.root}`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      while (treeTable.has(degree)) {
        const existingTree = treeTable.get(degree);
        treeTable.delete(degree);

        setMessage(`Combining trees of degree ${degree}: roots ${existingTree.root} and ${currentTree.root}`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const newRoot = Math.min(existingTree.root, currentTree.root);
        currentTree = {
          degree: degree + 1,
          nodes: existingTree.nodes + currentTree.nodes,
          root: newRoot
        };
        degree++;
      }

      treeTable.set(degree, currentTree);
    }

    treeTable.forEach(tree => result.push(tree));
    result.sort((a, b) => a.degree - b.degree);

    setCombinedTrees(result);
    setMessage(`Combine complete! Reduced from ${trees.length} to ${result.length} trees`);
    setIsAnimating(false);
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Binomial Heap Pairwise Combine</h2>
        <p>Demonstrates the pairwise combination of binomial trees with equal degrees during removeMin operation.</p>
      </div>

      <div className="viz-controls">
        <button className="btn btn-primary" onClick={pairwiseCombine} disabled={isAnimating}>
          Pairwise Combine
        </button>
        <button className="btn btn-secondary" onClick={() => {
          setCombinedTrees([]);
          setMessage('Click "Pairwise Combine" to see the tree consolidation');
        }} disabled={isAnimating}>
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Initial Trees (After Remove Min)</h3>
          <div className="tree-display">
            {trees.map((tree, idx) => (
              <div key={idx} className="tree-node">
                <div>B{tree.degree}</div>
                <div style={{ fontSize: '12px' }}>root: {tree.root}</div>
              </div>
            ))}
          </div>
        </div>

        {combinedTrees.length > 0 && (
          <div className="section">
            <h3>After Pairwise Combine</h3>
            <div className="tree-display">
              {combinedTrees.map((tree, idx) => (
                <div key={idx} className="tree-node active">
                  <div>B{tree.degree}</div>
                  <div style={{ fontSize: '12px' }}>root: {tree.root}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="viz-info">
        <h3>Binomial Heap Properties:</h3>
        <ul>
          <li>Binomial tree Bk has exactly 2^k nodes</li>
          <li>At most one tree of each degree</li>
          <li>Number representation: n items → binary representation</li>
          <li>Insert: O(1) amortized</li>
          <li>Remove min: O(log n) with pairwise combine</li>
        </ul>
      </div>
    </div>
  );
};

export default BinomialHeapViz;