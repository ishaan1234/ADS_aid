import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const AdaptiveHuffmanViz = () => {
  const [inputText, setInputText] = useState('ABACABAD');
  const [tree, setTree] = useState(null);
  const [codes, setCodes] = useState({});
  const [encodedBits, setEncodedBits] = useState([]);
  const [step, setStep] = useState(0);
  const [currentChar, setCurrentChar] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Enter text and click "Start Encoding" to begin adaptive Huffman coding');
  const [nodeIdCounter, setNodeIdCounter] = useState(0);

  // Create a new node
  const createNode = (char = null, weight = 0, left = null, right = null) => {
    const id = nodeIdCounter;
    setNodeIdCounter(prev => prev + 1);
    return {
      id,
      char,
      weight,
      left,
      right,
      isNYT: char === null && left === null && right === null
    };
  };

  // Initialize with NYT (Not Yet Transmitted) node
  const initializeTree = () => {
    setNodeIdCounter(1);
    const nytNode = {
      id: 0,
      char: null,
      weight: 0,
      left: null,
      right: null,
      isNYT: true
    };
    setTree(nytNode);
    setCodes({});
    setEncodedBits([]);
    setStep(0);
    setCurrentChar('');
    setMessage('Initialized with NYT (Not Yet Transmitted) node. Ready to encode.');
  };

  // Find node in tree by character
  const findNode = (node, char) => {
    if (!node) return null;
    if (node.char === char) return node;

    const leftResult = findNode(node.left, char);
    if (leftResult) return leftResult;

    return findNode(node.right, char);
  };

  // Get path to NYT node
  const getNYTPath = (node, path = '') => {
    if (!node) return null;
    if (node.isNYT) return path;

    const leftPath = getNYTPath(node.left, path + '0');
    if (leftPath !== null) return leftPath;

    const rightPath = getNYTPath(node.right, path + '1');
    if (rightPath !== null) return rightPath;

    return null;
  };

  // Get path to character in tree
  const getCharPath = (node, char, path = '') => {
    if (!node) return null;
    if (node.char === char) return path;

    const leftPath = getCharPath(node.left, char, path + '0');
    if (leftPath !== null) return leftPath;

    const rightPath = getCharPath(node.right, char, path + '1');
    if (rightPath !== null) return rightPath;

    return null;
  };

  // Update weights in tree
  const updateWeights = (node) => {
    if (!node) return 0;

    if (node.left === null && node.right === null) {
      // Leaf node
      return node.weight;
    } else {
      // Internal node
      const leftWeight = updateWeights(node.left);
      const rightWeight = updateWeights(node.right);
      node.weight = leftWeight + rightWeight;
      return node.weight;
    }
  };

  // Add new character to tree
  const addCharToTree = (currentTree, char) => {
    // Find NYT node
    const findNYT = (node) => {
      if (!node) return null;
      if (node.isNYT) return node;

      const leftResult = findNYT(node.left);
      if (leftResult) return leftResult;

      return findNYT(node.right);
    };

    const nytNode = findNYT(currentTree);
    if (!nytNode) return currentTree;

    // Create new internal node
    const newInternal = {
      id: nodeIdCounter,
      char: null,
      weight: 1,
      left: null,
      right: null,
      isNYT: false
    };
    setNodeIdCounter(prev => prev + 1);

    // Create new NYT node
    const newNYT = {
      id: nodeIdCounter,
      char: null,
      weight: 0,
      left: null,
      right: null,
      isNYT: true
    };
    setNodeIdCounter(prev => prev + 1);

    // Create new character node
    const newChar = {
      id: nodeIdCounter,
      char: char,
      weight: 1,
      left: null,
      right: null,
      isNYT: false
    };
    setNodeIdCounter(prev => prev + 1);

    // Set up structure
    newInternal.left = newNYT;
    newInternal.right = newChar;

    // Replace NYT node with new internal node
    nytNode.char = newInternal.char;
    nytNode.weight = newInternal.weight;
    nytNode.left = newInternal.left;
    nytNode.right = newInternal.right;
    nytNode.isNYT = newInternal.isNYT;

    return currentTree;
  };

  // Increment weight of character node
  const incrementWeight = (currentTree, char) => {
    const charNode = findNode(currentTree, char);
    if (charNode) {
      charNode.weight++;
    }
    updateWeights(currentTree);
    return currentTree;
  };

  // Process single character
  const processCharacter = async (char) => {
    setCurrentChar(char);

    const existingNode = findNode(tree, char);
    let bits = [];
    let newTree = JSON.parse(JSON.stringify(tree)); // Deep copy

    if (existingNode) {
      // Character exists in tree
      const path = getCharPath(newTree, char);
      bits = path.split('').map(bit => ({ bit, type: 'code' }));
      setMessage(`Character '${char}' found in tree. Code: ${path || 'root'}`);

      // Increment weight
      newTree = incrementWeight(newTree, char);
    } else {
      // New character
      const nytPath = getNYTPath(newTree);
      bits = nytPath.split('').map(bit => ({ bit, type: 'nyt' }));

      // Add 8-bit ASCII representation
      const ascii = char.charCodeAt(0).toString(2).padStart(8, '0');
      bits = bits.concat(ascii.split('').map(bit => ({ bit, type: 'ascii' })));

      setMessage(`New character '${char}'. NYT path: ${nytPath}, ASCII: ${ascii}`);

      // Add character to tree
      newTree = addCharToTree(newTree, char);
      updateWeights(newTree);
    }

    setEncodedBits(prev => [...prev, ...bits]);
    setTree(newTree);

    // Update codes for display
    const newCodes = {};
    const buildCodes = (node, path = '') => {
      if (!node) return;
      if (node.char && !node.isNYT) {
        newCodes[node.char] = path || 'root';
      }
      if (node.left) buildCodes(node.left, path + '0');
      if (node.right) buildCodes(node.right, path + '1');
    };
    buildCodes(newTree);
    setCodes(newCodes);

    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  // Start encoding process
  const startEncoding = async () => {
    setIsAnimating(true);
    initializeTree();
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let i = 0; i < inputText.length; i++) {
      setStep(i + 1);
      await processCharacter(inputText[i]);
    }

    setCurrentChar('');
    setMessage(`Encoding complete! Total bits: ${encodedBits.length}`);
    setIsAnimating(false);
  };

  const resetVisualization = () => {
    setIsAnimating(false);
    initializeTree();
    setMessage('Enter text and click "Start Encoding" to begin adaptive Huffman coding');
  };

  // Render tree recursively
  const renderTreeNode = (node, x, y, level, angle, radius) => {
    if (!node) return null;

    const nodeSize = 30;
    const fontSize = node.char ? 12 : 10;

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeSize}
          fill={node.isNYT ? '#ef4444' : node.char ? '#10b981' : '#6b7280'}
          stroke="#374151"
          strokeWidth="2"
        />

        <text
          x={x}
          y={y - 5}
          textAnchor="middle"
          fontSize={fontSize}
          fill="white"
          fontWeight="bold"
        >
          {node.isNYT ? 'NYT' : node.char || 'INT'}
        </text>

        <text
          x={x}
          y={y + 8}
          textAnchor="middle"
          fontSize="10"
          fill="white"
        >
          {node.weight}
        </text>

        {/* Render children */}
        {node.left && (
          <>
            <line
              x1={x - 15}
              y1={y + 25}
              x2={x - radius}
              y2={y + 80}
              stroke="#6b7280"
              strokeWidth="2"
            />
            <text
              x={x - radius/2}
              y={y + 55}
              textAnchor="middle"
              fontSize="12"
              fill="#3b82f6"
              fontWeight="bold"
            >
              0
            </text>
            {renderTreeNode(node.left, x - radius, y + 80, level + 1, angle - Math.PI/4, radius * 0.7)}
          </>
        )}

        {node.right && (
          <>
            <line
              x1={x + 15}
              y1={y + 25}
              x2={x + radius}
              y2={y + 80}
              stroke="#6b7280"
              strokeWidth="2"
            />
            <text
              x={x + radius/2}
              y={y + 55}
              textAnchor="middle"
              fontSize="12"
              fill="#3b82f6"
              fontWeight="bold"
            >
              1
            </text>
            {renderTreeNode(node.right, x + radius, y + 80, level + 1, angle + Math.PI/4, radius * 0.7)}
          </>
        )}
      </g>
    );
  };

  useEffect(() => {
    initializeTree();
  }, []);

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Adaptive Huffman Coding</h2>
        <p>Demonstrates dynamic Huffman tree construction with NYT (Not Yet Transmitted) nodes.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Input Text</label>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value.toUpperCase())}
            disabled={isAnimating}
            placeholder="Enter text to encode"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={startEncoding}
          disabled={isAnimating || !inputText}
        >
          Start Encoding
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
          <h3>Progress: Character {step} of {inputText.length}</h3>
          <div className="value-list">
            {inputText.split('').map((char, index) => (
              <div
                key={index}
                className={`value-item ${
                  index < step ? 'sorted' :
                  index === step - 1 ? 'highlight' : ''
                }`}
              >
                {char}
              </div>
            ))}
          </div>
          {currentChar && (
            <p style={{ marginTop: '8px', color: 'var(--accent)' }}>
              Currently processing: <strong>{currentChar}</strong>
            </p>
          )}
        </div>

        <div className="section">
          <h3>Adaptive Huffman Tree</h3>
          <div style={{
            width: '100%',
            height: '400px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'auto',
            background: 'var(--bg-secondary)'
          }}>
            <svg width="600" height="350">
              {tree && renderTreeNode(tree, 300, 50, 0, 0, 100)}
            </svg>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#ef4444' }}>■ NYT Node</span>
            {' | '}
            <span style={{ color: '#10b981' }}>■ Character Node</span>
            {' | '}
            <span style={{ color: '#6b7280' }}>■ Internal Node</span>
          </div>
        </div>

        <div className="section">
          <h3>Current Code Table</h3>
          <div className="performance-display">
            {Object.keys(codes).length > 0 ? (
              Object.entries(codes).map(([char, code]) => (
                <div key={char} className="metric">
                  <span className="metric-label">'{char}':</span>
                  <span className="metric-value" style={{ fontFamily: 'monospace' }}>
                    {code}
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No codes yet - tree only has NYT node
              </p>
            )}
          </div>
        </div>

        <div className="section">
          <h3>Encoded Bit Stream</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            padding: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {encodedBits.map((bit, index) => (
              <span
                key={index}
                style={{
                  padding: '2px 4px',
                  borderRadius: '3px',
                  backgroundColor:
                    bit.type === 'code' ? '#3b82f6' :
                    bit.type === 'nyt' ? '#ef4444' :
                    '#10b981',
                  color: 'white',
                  fontSize: '12px'
                }}
              >
                {bit.bit}
              </span>
            ))}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#3b82f6' }}>■ Character Code</span>
            {' | '}
            <span style={{ color: '#ef4444' }}>■ NYT Path</span>
            {' | '}
            <span style={{ color: '#10b981' }}>■ ASCII Bits</span>
          </div>
        </div>

        <div className="section">
          <h3>Compression Statistics</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Input Characters:</span>
              <span className="metric-value">{inputText.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Output Bits:</span>
              <span className="metric-value">{encodedBits.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Fixed-Length Bits:</span>
              <span className="metric-value">{inputText.length * 8}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Compression Ratio:</span>
              <span className="metric-value">
                {inputText.length > 0 && encodedBits.length > 0 ?
                  ((1 - encodedBits.length / (inputText.length * 8)) * 100).toFixed(1) + '%' :
                  '0%'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Adaptive Huffman Coding:</h3>
        <ul>
          <li>Builds Huffman tree dynamically as characters are processed</li>
          <li>Starts with single NYT (Not Yet Transmitted) node</li>
          <li>New characters: output NYT path + 8-bit ASCII, then add to tree</li>
          <li>Existing characters: output current Huffman code, increment weight</li>
          <li>Tree adapts to character frequencies without prior knowledge</li>
          <li>Used in compression algorithms like DEFLATE</li>
        </ul>
      </div>
    </div>
  );
};

export default AdaptiveHuffmanViz;