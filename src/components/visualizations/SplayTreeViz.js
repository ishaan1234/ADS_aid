import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FiSearch, FiPlus, FiRefreshCw, FiRotateCw } from 'react-icons/fi';
import './SplayTreeViz.css';

const SplayTreeViz = () => {
  const [tree, setTree] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationSteps, setOperationSteps] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [rotationCount, setRotationCount] = useState(0);
  const svgRef = useRef(null);

  useEffect(() => {
    initializeTree();
  }, []);

  useEffect(() => {
    drawTree();
  }, [tree, highlightedNodes]);

  class SplayNode {
    constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
      this.parent = null;
      this.id = `node-${key}-${Date.now()}`;
    }
  }

  const initializeTree = () => {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];
    let root = null;

    values.forEach(val => {
      root = insertNode(root, val);
    });

    setTree(root);
    setRotationCount(0);
  };

  const insertNode = (root, key) => {
    if (!root) return new SplayNode(key);

    if (key < root.key) {
      root.left = insertNode(root.left, key);
      root.left.parent = root;
    } else if (key > root.key) {
      root.right = insertNode(root.right, key);
      root.right.parent = root;
    }

    return root;
  };

  const rightRotate = (x) => {
    const y = x.left;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.right = x;
    y.parent = x.parent;
    x.parent = y;
    return y;
  };

  const leftRotate = (x) => {
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.left = x;
    y.parent = x.parent;
    x.parent = y;
    return y;
  };

  const splay = async (root, key, steps = []) => {
    if (!root || root.key === key) return root;

    setHighlightedNodes([]);
    let rotations = 0;

    // Key in left subtree
    if (key < root.key) {
      if (!root.left) return root;

      // Zig-Zig (Left-Left)
      if (key < root.left.key) {
        steps.push(`Zig-Zig case: ${key} < ${root.left.key} < ${root.key}`);
        root.left.left = await splay(root.left.left, key, steps);
        root = rightRotate(root);
        rotations++;
        steps.push(`Right rotation at ${root.right.key}`);
        setHighlightedNodes([root.id, root.right.id]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      // Zig-Zag (Left-Right)
      else if (key > root.left.key) {
        steps.push(`Zig-Zag case: ${root.left.key} < ${key} < ${root.key}`);
        root.left.right = await splay(root.left.right, key, steps);
        if (root.left.right) {
          root.left = leftRotate(root.left);
          rotations++;
          steps.push(`Left rotation at ${root.left.right ? root.left.right.key : 'null'}`);
          setHighlightedNodes([root.left.id]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Final rotation
      if (root.left) {
        root = rightRotate(root);
        rotations++;
        steps.push(`Final right rotation at ${root.right ? root.right.key : 'root'}`);
        setHighlightedNodes([root.id]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    // Key in right subtree
    else {
      if (!root.right) return root;

      // Zag-Zig (Right-Left)
      if (key < root.right.key) {
        steps.push(`Zag-Zig case: ${root.key} < ${key} < ${root.right.key}`);
        root.right.left = await splay(root.right.left, key, steps);
        if (root.right.left) {
          root.right = rightRotate(root.right);
          rotations++;
          steps.push(`Right rotation at ${root.right.left ? root.right.left.key : 'null'}`);
          setHighlightedNodes([root.right.id]);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      // Zag-Zag (Right-Right)
      else if (key > root.right.key) {
        steps.push(`Zag-Zag case: ${root.key} < ${root.right.key} < ${key}`);
        root.right.right = await splay(root.right.right, key, steps);
        root = leftRotate(root);
        rotations++;
        steps.push(`Left rotation at ${root.left.key}`);
        setHighlightedNodes([root.id, root.left.id]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Final rotation
      if (root.right) {
        root = leftRotate(root);
        rotations++;
        steps.push(`Final left rotation at ${root.left ? root.left.key : 'root'}`);
        setHighlightedNodes([root.id]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setRotationCount(prev => prev + rotations);
    return root;
  };

  const search = async () => {
    const key = parseInt(searchValue);
    if (!key || isNaN(key) || !tree) return;

    setIsAnimating(true);
    const steps = [];
    steps.push(`Searching for ${key}`);

    // Splay operation brings searched node to root
    const newRoot = await splay(tree, key, steps);

    if (newRoot && newRoot.key === key) {
      steps.push(`Found ${key} and splayed to root`);
      setHighlightedNodes([newRoot.id]);
    } else {
      steps.push(`${key} not found, splayed nearest node to root`);
    }

    setOperationSteps(steps);
    setTree(newRoot);
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
    }, 1000);
  };

  const insert = async () => {
    const key = parseInt(inputValue);
    if (!key || isNaN(key)) return;

    setIsAnimating(true);
    const steps = [];
    steps.push(`Inserting ${key}`);

    if (!tree) {
      const newNode = new SplayNode(key);
      steps.push(`Created root node with ${key}`);
      setTree(newNode);
      setOperationSteps(steps);
      setIsAnimating(false);
      return;
    }

    // Splay tree to prepare for insertion
    const newRoot = await splay(tree, key, steps);

    if (newRoot && newRoot.key === key) {
      steps.push(`${key} already exists in tree`);
      setTree(newRoot);
    } else {
      const newNode = new SplayNode(key);

      if (key < newRoot.key) {
        newNode.right = newRoot;
        newNode.left = newRoot.left;
        newRoot.left = null;
        if (newNode.left) newNode.left.parent = newNode;
        newRoot.parent = newNode;
        steps.push(`Inserted ${key} as new root, previous root ${newRoot.key} becomes right child`);
      } else {
        newNode.left = newRoot;
        newNode.right = newRoot.right;
        newRoot.right = null;
        if (newNode.right) newNode.right.parent = newNode;
        newRoot.parent = newNode;
        steps.push(`Inserted ${key} as new root, previous root ${newRoot.key} becomes left child`);
      }

      setHighlightedNodes([newNode.id]);
      setTree(newNode);
    }

    setOperationSteps(steps);
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
    }, 1000);
  };

  const drawTree = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (!tree) return;

    const width = 900;
    const height = 500;
    const nodeRadius = 25;

    svg.attr('width', width).attr('height', height);

    // Convert to d3 hierarchy
    const convertToHierarchy = (node) => {
      if (!node) return null;
      return {
        data: node,
        children: [convertToHierarchy(node.left), convertToHierarchy(node.right)].filter(Boolean)
      };
    };

    const hierarchyRoot = convertToHierarchy(tree);
    if (!hierarchyRoot) return;

    const root = d3.hierarchy(hierarchyRoot);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    treeLayout(root);

    // Adjust positions
    root.descendants().forEach(d => {
      d.x += 50;
      d.y += 50;
    });

    // Draw edges
    const links = root.links();
    svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', 'var(--text-secondary)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6);

    // Draw nodes
    const nodes = root.descendants();
    const nodeGroups = svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node circles
    nodeGroups.append('circle')
      .attr('r', nodeRadius)
      .attr('fill', d => {
        if (d.depth === 0) return 'var(--accent)';
        if (highlightedNodes.includes(d.data.data.id)) return 'var(--success)';
        return 'var(--bg-tertiary)';
      })
      .attr('stroke', d => {
        if (d.depth === 0) return 'var(--accent)';
        if (highlightedNodes.includes(d.data.data.id)) return 'var(--success)';
        return 'var(--border)';
      })
      .attr('stroke-width', 2);

    // Node labels
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 5)
      .attr('fill', d => {
        if (d.depth === 0 || highlightedNodes.includes(d.data.data.id)) return 'white';
        return 'var(--text-primary)';
      })
      .attr('font-weight', 600)
      .attr('font-size', 14)
      .text(d => d.data.data.key);

    // Root indicator
    const rootNode = nodes.find(n => n.depth === 0);
    if (rootNode) {
      svg.append('text')
        .attr('x', rootNode.x)
        .attr('y', rootNode.y - 40)
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--accent)')
        .attr('font-weight', 'bold')
        .attr('font-size', 12)
        .text('ROOT');
    }

    // Depth labels
    nodeGroups.append('text')
      .attr('x', nodeRadius + 10)
      .attr('y', -nodeRadius)
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', 10)
      .text(d => `d=${d.depth}`);
  };

  const getTreeHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
  };

  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  const reset = () => {
    initializeTree();
    setOperationSteps([]);
    setHighlightedNodes([]);
    setInputValue('');
    setSearchValue('');
    setRotationCount(0);
  };

  return (
    <div className="splay-tree-viz">
      <div className="viz-header">
        <h2>Splay Tree Operations</h2>
        <p>Self-adjusting BST with splaying - frequently accessed elements move to root</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <div className="input-group">
            <input
              type="number"
              placeholder="Value to insert"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isAnimating}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                insert();
                setInputValue('');
              }}
              disabled={isAnimating || !inputValue}
            >
              <FiPlus /> Insert
            </button>
          </div>

          <div className="input-group">
            <input
              type="number"
              placeholder="Value to search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isAnimating}
            />
            <button
              className="btn btn-secondary"
              onClick={() => {
                search();
                setSearchValue('');
              }}
              disabled={isAnimating || !searchValue}
            >
              <FiSearch /> Search & Splay
            </button>
          </div>

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
        <div className="tree-stats">
          <h3>Tree Properties</h3>
          <ul>
            <li>Root: <strong>{tree ? tree.key : 'Empty'}</strong></li>
            <li>Height: <strong>{getTreeHeight(tree)}</strong></li>
            <li>Total Nodes: <strong>{countNodes(tree)}</strong></li>
            <li>Total Rotations: <strong>{rotationCount}</strong></li>
          </ul>
        </div>

        {operationSteps.length > 0 && (
          <div className="operation-steps">
            <h3>Splaying Steps</h3>
            <ol>
              {operationSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="splay-cases">
          <h3>Splay Cases</h3>
          <div className="cases-grid">
            <div className="case">
              <strong>Zig:</strong> Single rotation when parent is root
            </div>
            <div className="case">
              <strong>Zig-Zig:</strong> Two right/left rotations in same direction
            </div>
            <div className="case">
              <strong>Zig-Zag:</strong> Right then left (or left then right) rotation
            </div>
          </div>
        </div>

        <div className="complexity-info">
          <h3>Amortized Complexity</h3>
          <ul>
            <li>Search: O(log n)</li>
            <li>Insert: O(log n)</li>
            <li>Delete: O(log n)</li>
            <li>Space: O(n)</li>
            <li>Sequential Access: O(n)</li>
          </ul>
        </div>

        <div className="advantages">
          <h3>Advantages</h3>
          <ul>
            <li>Good locality of reference</li>
            <li>Frequently accessed items near root</li>
            <li>No need to store balance information</li>
            <li>Simple implementation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SplayTreeViz;