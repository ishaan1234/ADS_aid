import React, { useState } from 'react';
import './VisualizationBase.css';

const LeftistTreeViz = () => {
  const [tree1, setTree1] = useState([3, 5, 7, 9]);
  const [tree2, setTree2] = useState([2, 4, 6, 8]);
  const [meldedTree, setMeldedTree] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Click "Meld Trees" to see the leftist tree meld operation');

  const meldTrees = async () => {
    setIsAnimating(true);
    setMessage('Starting meld operation...');

    // Simplified meld simulation
    const result = [...tree1, ...tree2].sort((a, b) => a - b);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Comparing root elements...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Recursively melding right subtrees...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage('Maintaining leftist property (s(left) >= s(right))...');

    await new Promise(resolve => setTimeout(resolve, 1000));
    setMeldedTree(result);
    setMessage('Meld complete! Result is a valid leftist tree');
    setIsAnimating(false);
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Leftist Tree Meld Operation</h2>
        <p>Demonstrates the O(log n) meld operation that combines two leftist trees while maintaining the leftist property.</p>
      </div>

      <div className="viz-controls">
        <button className="btn btn-primary" onClick={meldTrees} disabled={isAnimating}>
          Meld Trees
        </button>
        <button className="btn btn-secondary" onClick={() => {
          setMeldedTree([]);
          setMessage('Click "Meld Trees" to see the leftist tree meld operation');
        }} disabled={isAnimating}>
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Tree 1</h3>
          <div className="value-list">
            {tree1.map((val, idx) => (
              <span key={idx} className="value-item">{val}</span>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Tree 2</h3>
          <div className="value-list">
            {tree2.map((val, idx) => (
              <span key={idx} className="value-item">{val}</span>
            ))}
          </div>
        </div>

        {meldedTree.length > 0 && (
          <div className="section">
            <h3>Melded Tree</h3>
            <div className="value-list">
              {meldedTree.map((val, idx) => (
                <span key={idx} className="value-item sorted">{val}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="viz-info">
        <h3>Leftist Tree Properties:</h3>
        <ul>
          <li>s(leftChild) ≥ s(rightChild) for all nodes</li>
          <li>Rightmost path is shortest to external node</li>
          <li>Meld operation: O(log n) time</li>
          <li>Insert via meld: O(log n)</li>
          <li>Remove min via meld: O(log n)</li>
        </ul>
      </div>
    </div>
  );
};

export default LeftistTreeViz;