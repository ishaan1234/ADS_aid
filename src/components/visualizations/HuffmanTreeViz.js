import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FiPlay, FiRefreshCw, FiCode } from 'react-icons/fi';
import './HuffmanTreeViz.css';

const HuffmanTreeViz = () => {
  const [text, setText] = useState('ABRACADABRA');
  const [tree, setTree] = useState(null);
  const [frequencies, setFrequencies] = useState([]);
  const [codes, setCodes] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [buildSteps, setBuildSteps] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (text) {
      buildHuffmanTree();
    }
  }, []);

  useEffect(() => {
    if (tree) {
      drawTree();
    }
  }, [tree, highlightedNodes]);

  const calculateFrequencies = (text) => {
    const freq = {};
    for (const char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return Object.entries(freq)
      .map(([char, count]) => ({ char, count, freq: count / text.length }))
      .sort((a, b) => a.count - b.count);
  };

  const buildHuffmanTree = async () => {
    if (!text) return;

    setIsAnimating(true);
    const steps = [];

    // Calculate frequencies
    const freq = calculateFrequencies(text);
    setFrequencies(freq);
    steps.push(`Calculated frequencies for "${text}"`);

    // Create initial nodes
    let nodes = freq.map((item, idx) => ({
      id: `leaf-${idx}`,
      char: item.char,
      freq: item.count,
      left: null,
      right: null,
      isLeaf: true
    }));

    steps.push(`Created ${nodes.length} leaf nodes`);

    // Build tree using min heap
    let nodeId = 0;
    while (nodes.length > 1) {
      // Sort to simulate min heap
      nodes.sort((a, b) => a.freq - b.freq);

      // Extract two minimum nodes
      const left = nodes.shift();
      const right = nodes.shift();

      setHighlightedNodes([left.id, right.id]);
      steps.push(`Merging nodes with frequencies ${left.freq} and ${right.freq}`);

      // Create parent node
      const parent = {
        id: `internal-${nodeId++}`,
        char: null,
        freq: left.freq + right.freq,
        left,
        right,
        isLeaf: false
      };

      nodes.push(parent);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const root = nodes[0];
    setTree(root);

    // Generate codes
    const huffmanCodes = {};
    const generateCodes = (node, code = '') => {
      if (!node) return;
      if (node.isLeaf) {
        huffmanCodes[node.char] = code || '0';
        return;
      }
      generateCodes(node.left, code + '0');
      generateCodes(node.right, code + '1');
    };

    generateCodes(root);
    setCodes(huffmanCodes);

    steps.push('Huffman tree construction complete');
    setBuildSteps(steps);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const drawTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!tree) return;

    const width = 900;
    const height = 500;
    const nodeRadius = 25;

    svg.attr('width', width).attr('height', height);

    // Create hierarchical layout
    const treeLayout = d3.tree().size([width - 100, height - 100]);

    // Convert tree to d3 hierarchy
    const root = d3.hierarchy(tree, d => d.left || d.right ? [d.left, d.right].filter(Boolean) : null);
    treeLayout(root);

    // Adjust positions
    root.descendants().forEach(d => {
      d.x += 50;
      d.y += 50;
    });

    // Draw edges
    const link = svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('g')
      .attr('class', 'link');

    link.append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', 'var(--text-secondary)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Add edge labels (0 or 1)
    link.append('text')
      .attr('x', d => (d.source.x + d.target.x) / 2)
      .attr('y', d => (d.source.y + d.target.y) / 2 - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--accent)')
      .attr('font-weight', 'bold')
      .attr('font-size', 14)
      .text(d => d.target === d.source.children[0] ? '0' : '1');

    // Draw nodes
    const node = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles
    node.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => {
        if (highlightedNodes.includes(d.data.id)) return 'var(--accent)';
        return d.data.isLeaf ? 'var(--success)' : 'var(--bg-tertiary)';
      })
      .attr('stroke', d => {
        if (highlightedNodes.includes(d.data.id)) return 'var(--accent)';
        return d.data.isLeaf ? 'var(--success)' : 'var(--border)';
      })
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('y', d => d.data.isLeaf ? 0 : 5)
      .attr('text-anchor', 'middle')
      .attr('fill', d => {
        if (highlightedNodes.includes(d.data.id)) return 'white';
        return d.data.isLeaf ? 'white' : 'var(--text-primary)';
      })
      .attr('font-weight', 600)
      .attr('font-size', d => d.data.isLeaf ? 16 : 12)
      .text(d => d.data.isLeaf ? d.data.char : d.data.freq);

    // Frequency labels for leaf nodes
    node.filter(d => d.data.isLeaf)
      .append('text')
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', 11)
      .text(d => `f=${d.data.freq}`);
  };

  const encodeText = () => {
    if (!codes || !text) return '';
    return text.split('').map(char => codes[char] || '').join(' ');
  };

  const calculateCompression = () => {
    if (!codes || !text) return { original: 0, compressed: 0, ratio: 0 };

    const originalBits = text.length * 8;
    const compressedBits = text.split('').reduce((sum, char) => sum + (codes[char]?.length || 0), 0);
    const ratio = ((originalBits - compressedBits) / originalBits * 100).toFixed(2);

    return { originalBits, compressedBits, ratio };
  };

  const reset = () => {
    setText('ABRACADABRA');
    setTree(null);
    setFrequencies([]);
    setCodes({});
    setHighlightedNodes([]);
    setBuildSteps([]);
    setCurrentStep('');
  };

  const compression = calculateCompression();

  return (
    <div className="huffman-tree-viz">
      <div className="viz-header">
        <h2>Huffman Coding Tree</h2>
        <p>Variable-length prefix coding for lossless data compression</p>
      </div>

      <div className="viz-controls">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter text to encode"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase())}
            disabled={isAnimating}
          />
          <button
            className="btn btn-primary"
            onClick={buildHuffmanTree}
            disabled={isAnimating || !text}
          >
            <FiPlay /> Build Tree
          </button>
          <button
            className="btn btn-secondary"
            onClick={reset}
            disabled={isAnimating}
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </div>

      <div className="viz-canvas">
        <svg ref={svgRef}></svg>
      </div>

      <div className="viz-details">
        <div className="frequency-table">
          <h3>Character Frequencies</h3>
          <table>
            <thead>
              <tr>
                <th>Character</th>
                <th>Frequency</th>
                <th>Huffman Code</th>
                <th>Bits</th>
              </tr>
            </thead>
            <tbody>
              {frequencies.map((item, idx) => (
                <tr key={idx}>
                  <td className="char-cell">{item.char}</td>
                  <td>{item.count}</td>
                  <td className="code-cell">{codes[item.char] || '-'}</td>
                  <td>{codes[item.char]?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="encoding-section">
          <h3>Encoded Text</h3>
          <div className="encoded-text">
            {encodeText() || 'Build tree to see encoding'}
          </div>
        </div>

        <div className="compression-stats">
          <h3>Compression Statistics</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-label">Original Size:</span>
              <span className="stat-value">{compression.originalBits} bits</span>
            </div>
            <div className="stat">
              <span className="stat-label">Compressed Size:</span>
              <span className="stat-value">{compression.compressedBits} bits</span>
            </div>
            <div className="stat">
              <span className="stat-label">Compression Ratio:</span>
              <span className="stat-value highlight">{compression.ratio}%</span>
            </div>
          </div>
        </div>

        {buildSteps.length > 0 && (
          <div className="build-steps">
            <h3>Tree Construction Steps</h3>
            <ol>
              {buildSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="complexity-info">
          <h3>Algorithm Complexity</h3>
          <ul>
            <li>Build Tree: O(n log n)</li>
            <li>Encode Text: O(n)</li>
            <li>Decode Text: O(n)</li>
            <li>Space: O(n)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HuffmanTreeViz;