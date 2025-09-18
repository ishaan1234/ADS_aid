import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FiPlus, FiMinus, FiRefreshCw, FiZap } from 'react-icons/fi';
import './FibonacciHeapViz.css';

const FibonacciHeapViz = () => {
  const [heap, setHeap] = useState({
    min: null,
    roots: [],
    size: 0,
    nodes: new Map()
  });
  const [inputValue, setInputValue] = useState('');
  const [decreaseKeyNode, setDecreaseKeyNode] = useState('');
  const [decreaseKeyValue, setDecreaseKeyValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [operationSteps, setOperationSteps] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    initializeHeap();
  }, []);

  useEffect(() => {
    drawHeap();
  }, [heap, highlightedNodes]);

  const initializeHeap = () => {
    const initialNodes = [23, 7, 3, 17, 24, 26, 46, 30, 35];
    const newHeap = {
      min: null,
      roots: [],
      size: 0,
      nodes: new Map()
    };

    initialNodes.forEach(value => {
      const node = {
        id: `node-${value}`,
        key: value,
        degree: 0,
        parent: null,
        children: [],
        marked: false
      };

      newHeap.nodes.set(node.id, node);
      newHeap.roots.push(node);
      newHeap.size++;

      if (!newHeap.min || value < newHeap.min.key) {
        newHeap.min = node;
      }
    });

    setHeap(newHeap);
  };

  const insert = (value) => {
    if (!value || isNaN(value)) return;

    setIsAnimating(true);
    const steps = [];
    const newHeap = { ...heap, nodes: new Map(heap.nodes), roots: [...heap.roots] };

    const node = {
      id: `node-${value}-${Date.now()}`,
      key: parseInt(value),
      degree: 0,
      parent: null,
      children: [],
      marked: false
    };

    steps.push(`Creating new node with key ${value}`);
    newHeap.nodes.set(node.id, node);
    newHeap.roots.push(node);
    newHeap.size++;

    if (!newHeap.min || node.key < newHeap.min.key) {
      steps.push(`New minimum: ${node.key}`);
      newHeap.min = node;
    }

    setHighlightedNodes([node.id]);
    steps.push(`Inserted ${value} into root list`);

    setOperationSteps(steps);
    setHeap(newHeap);
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
    }, 1000);
  };

  const extractMin = () => {
    if (!heap.min) return;

    setIsAnimating(true);
    const steps = [];
    const newHeap = { ...heap, nodes: new Map(heap.nodes), roots: [...heap.roots] };

    const minNode = newHeap.min;
    steps.push(`Extracting minimum: ${minNode.key}`);
    setHighlightedNodes([minNode.id]);

    // Add children to root list
    if (minNode.children.length > 0) {
      steps.push(`Adding ${minNode.children.length} children to root list`);
      minNode.children.forEach(child => {
        child.parent = null;
        child.marked = false;
        newHeap.roots.push(child);
      });
    }

    // Remove min from roots
    newHeap.roots = newHeap.roots.filter(node => node.id !== minNode.id);
    newHeap.nodes.delete(minNode.id);
    newHeap.size--;

    if (newHeap.roots.length > 0) {
      // Consolidate trees
      steps.push('Consolidating trees...');
      const degreeTable = new Map();

      const rootsCopy = [...newHeap.roots];
      newHeap.roots = [];

      for (const root of rootsCopy) {
        let current = root;
        let degree = current.degree;

        while (degreeTable.has(degree)) {
          const other = degreeTable.get(degree);
          degreeTable.delete(degree);

          // Link trees
          if (current.key > other.key) {
            [current, other] = [other, current];
          }

          steps.push(`Linking trees with roots ${current.key} and ${other.key}`);
          other.parent = current;
          current.children.push(other);
          current.degree++;

          degree = current.degree;
        }

        degreeTable.set(degree, current);
      }

      // Update root list
      newHeap.roots = Array.from(degreeTable.values());

      // Find new minimum
      newHeap.min = newHeap.roots[0];
      for (const root of newHeap.roots) {
        if (root.key < newHeap.min.key) {
          newHeap.min = root;
        }
      }

      steps.push(`New minimum: ${newHeap.min.key}`);
    } else {
      newHeap.min = null;
    }

    setOperationSteps(steps);
    setHeap(newHeap);
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
    }, 1500);
  };

  const decreaseKey = () => {
    const nodeId = decreaseKeyNode;
    const newKey = parseInt(decreaseKeyValue);

    if (!nodeId || !newKey || isNaN(newKey)) return;

    const node = heap.nodes.get(nodeId);
    if (!node) return;

    if (newKey >= node.key) {
      alert('New key must be less than current key');
      return;
    }

    setIsAnimating(true);
    const steps = [];
    const newHeap = { ...heap, nodes: new Map(heap.nodes), roots: [...heap.roots] };

    steps.push(`Decreasing key of node ${node.key} to ${newKey}`);
    node.key = newKey;
    setHighlightedNodes([node.id]);

    const parent = node.parent;
    if (parent && node.key < parent.key) {
      steps.push(`Violated heap property, cutting node from parent`);
      cut(newHeap, node, parent, steps);
      cascadingCut(newHeap, parent, steps);
    }

    if (node.key < newHeap.min.key) {
      steps.push(`New minimum: ${node.key}`);
      newHeap.min = node;
    }

    setOperationSteps(steps);
    setHeap(newHeap);
    setTimeout(() => {
      setHighlightedNodes([]);
      setIsAnimating(false);
    }, 1500);
  };

  const cut = (heap, node, parent, steps) => {
    parent.children = parent.children.filter(child => child.id !== node.id);
    parent.degree--;

    node.parent = null;
    node.marked = false;
    heap.roots.push(node);

    steps.push(`Cut ${node.key} from parent ${parent.key}`);
  };

  const cascadingCut = (heap, node, steps) => {
    const parent = node.parent;
    if (parent) {
      if (!node.marked) {
        node.marked = true;
        steps.push(`Marked node ${node.key}`);
      } else {
        cut(heap, node, parent, steps);
        cascadingCut(heap, parent, steps);
      }
    }
  };

  const drawHeap = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (heap.roots.length === 0) return;

    const width = 1000;
    const height = 600;
    const nodeRadius = 25;

    svg.attr('width', width).attr('height', height);

    // Layout calculation
    let xOffset = 50;
    const yOffset = 100;
    const treeSpacing = 150;

    const positions = new Map();

    const layoutTree = (node, x, y, level = 0, parentX = null) => {
      positions.set(node.id, { x, y, node });

      const childSpacing = Math.max(40, 80 / (level + 1));
      let childX = x - (node.children.length - 1) * childSpacing / 2;

      node.children.forEach((child) => {
        layoutTree(child, childX, y + 80, level + 1, x);
        childX += childSpacing;
      });
    };

    // Layout each root tree
    heap.roots.forEach((root) => {
      layoutTree(root, xOffset, yOffset);
      const treeWidth = getTreeWidth(root, positions);
      xOffset += treeWidth + treeSpacing;
    });

    // Draw edges
    positions.forEach((pos) => {
      const node = pos.node;
      node.children.forEach((child) => {
        const childPos = positions.get(child.id);
        if (childPos) {
          svg.append('line')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', childPos.x)
            .attr('y2', childPos.y)
            .attr('stroke', 'var(--text-secondary)')
            .attr('stroke-width', 2)
            .attr('opacity', 0.6);
        }
      });
    });

    // Draw root list connections
    for (let i = 0; i < heap.roots.length - 1; i++) {
      const pos1 = positions.get(heap.roots[i].id);
      const pos2 = positions.get(heap.roots[i + 1].id);
      if (pos1 && pos2) {
        svg.append('line')
          .attr('x1', pos1.x + nodeRadius)
          .attr('y1', pos1.y)
          .attr('x2', pos2.x - nodeRadius)
          .attr('y2', pos2.y)
          .attr('stroke', 'var(--accent)')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.5);
      }
    }

    // Draw nodes
    positions.forEach((pos) => {
      const node = pos.node;
      const g = svg.append('g')
        .attr('transform', `translate(${pos.x}, ${pos.y})`);

      // Node circle
      g.append('circle')
        .attr('r', nodeRadius)
        .attr('fill', () => {
          if (node === heap.min) return 'var(--success)';
          if (highlightedNodes.includes(node.id)) return 'var(--accent)';
          return 'var(--bg-tertiary)';
        })
        .attr('stroke', () => {
          if (node === heap.min) return 'var(--success)';
          if (node.marked) return 'var(--error)';
          return 'var(--border)';
        })
        .attr('stroke-width', node.marked ? 3 : 2);

      // Node label
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 5)
        .attr('fill', node === heap.min || highlightedNodes.includes(node.id) ? 'white' : 'var(--text-primary)')
        .attr('font-weight', 600)
        .attr('font-size', 14)
        .text(node.key);

      // Degree label
      if (node.degree > 0) {
        g.append('text')
          .attr('x', nodeRadius - 5)
          .attr('y', -nodeRadius + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--text-secondary)')
          .attr('font-size', 11)
          .text(`d=${node.degree}`);
      }

      // Min pointer
      if (node === heap.min) {
        g.append('text')
          .attr('y', -nodeRadius - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'var(--success)')
          .attr('font-weight', 'bold')
          .attr('font-size', 12)
          .text('MIN');
      }
    });
  };

  const getTreeWidth = (root, positions) => {
    let minX = Infinity;
    let maxX = -Infinity;

    const traverse = (node) => {
      const pos = positions.get(node.id);
      if (pos) {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x);
      }
      node.children.forEach(traverse);
    };

    traverse(root);
    return maxX - minX + 50;
  };

  const reset = () => {
    initializeHeap();
    setOperationSteps([]);
    setHighlightedNodes([]);
    setInputValue('');
    setDecreaseKeyNode('');
    setDecreaseKeyValue('');
  };

  return (
    <div className="fibonacci-heap-viz">
      <div className="viz-header">
        <h2>Fibonacci Heap Operations</h2>
        <p>Amortized O(1) insert and decrease-key operations with lazy consolidation</p>
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
                insert(inputValue);
                setInputValue('');
              }}
              disabled={isAnimating || !inputValue}
            >
              <FiPlus /> Insert
            </button>
          </div>

          <button
            className="btn btn-secondary"
            onClick={extractMin}
            disabled={isAnimating || !heap.min}
          >
            <FiMinus /> Extract Min
          </button>

          <div className="input-group">
            <select
              value={decreaseKeyNode}
              onChange={(e) => setDecreaseKeyNode(e.target.value)}
              disabled={isAnimating}
            >
              <option value="">Select node</option>
              {Array.from(heap.nodes.values()).map(node => (
                <option key={node.id} value={node.id}>
                  Node {node.key}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="New value"
              value={decreaseKeyValue}
              onChange={(e) => setDecreaseKeyValue(e.target.value)}
              disabled={isAnimating}
            />
            <button
              className="btn btn-secondary"
              onClick={() => {
                decreaseKey();
                setDecreaseKeyNode('');
                setDecreaseKeyValue('');
              }}
              disabled={isAnimating || !decreaseKeyNode || !decreaseKeyValue}
            >
              <FiZap /> Decrease Key
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
        <div className="heap-stats">
          <h3>Heap Properties</h3>
          <ul>
            <li>Minimum: <strong>{heap.min ? heap.min.key : 'Empty'}</strong></li>
            <li>Total nodes: <strong>{heap.size}</strong></li>
            <li>Root list size: <strong>{heap.roots.length}</strong></li>
            <li>Max degree: <strong>{Math.max(...heap.roots.map(r => r.degree), 0)}</strong></li>
          </ul>
        </div>

        {operationSteps.length > 0 && (
          <div className="operation-steps">
            <h3>Operation Steps</h3>
            <ol>
              {operationSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="complexity-info">
          <h3>Amortized Complexity</h3>
          <ul>
            <li>Insert: O(1)</li>
            <li>Find Min: O(1)</li>
            <li>Extract Min: O(log n)</li>
            <li>Decrease Key: O(1)</li>
            <li>Delete: O(log n)</li>
            <li>Merge: O(1)</li>
          </ul>
        </div>

        <div className="features-info">
          <h3>Key Features</h3>
          <ul>
            <li>Lazy consolidation during extract-min</li>
            <li>Cascading cuts maintain O(log n) tree height</li>
            <li>Marked nodes indicate potential cascading cuts</li>
            <li>Optimal for algorithms with many decrease-key ops</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FibonacciHeapViz;