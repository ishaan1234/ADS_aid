import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FiPlay, FiPause, FiRefreshCw, FiPlus, FiMinus } from 'react-icons/fi';
import './IntervalHeapViz.css';

const IntervalHeapViz = () => {
  const [heap, setHeap] = useState([
    { left: 10, right: 90 },
    { left: 15, right: 80 },
    { left: 20, right: 82 },
    { left: 30, right: 40 },
    { left: 35, right: 70 },
    { left: 45, right: 50 },
    { left: 60, right: 65 }
  ]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [message, setMessage] = useState('Interval Heap: Each node contains [min, max]. Left endpoints form min-heap, right endpoints form max-heap.');
  const [stepDetails, setStepDetails] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    drawHeap();
  }, [heap, highlightedNodes]);

  const verifyHeapProperty = () => {
    // Verify interval containment property
    for (let i = 0; i < heap.length; i++) {
      // Check interval validity
      if (heap[i].left > heap[i].right) {
        return `Error: Node ${i} has invalid interval [${heap[i].left}, ${heap[i].right}]`;
      }

      // Check parent-child containment
      const leftChild = 2 * i + 1;
      const rightChild = 2 * i + 2;

      if (leftChild < heap.length) {
        if (heap[leftChild].left < heap[i].left || heap[leftChild].right > heap[i].right) {
          return `Error: Child ${leftChild} not contained in parent ${i}`;
        }
      }

      if (rightChild < heap.length) {
        if (heap[rightChild].left < heap[i].left || heap[rightChild].right > heap[i].right) {
          return `Error: Child ${rightChild} not contained in parent ${i}`;
        }
      }
    }
    return 'Valid interval heap ✓';
  };

  const drawHeap = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 500;
    const nodeRadius = 40;
    const levelHeight = 100;

    svg.attr('width', width).attr('height', height);

    const levels = Math.ceil(Math.log2(heap.length + 1));
    const positions = [];

    // Calculate positions for complete binary tree
    for (let level = 0; level < levels; level++) {
      const nodesInLevel = Math.pow(2, level);
      const startIdx = Math.pow(2, level) - 1;
      const levelWidth = width / (nodesInLevel + 1);

      for (let i = 0; i < nodesInLevel && startIdx + i < heap.length; i++) {
        positions.push({
          x: levelWidth * (i + 1),
          y: 50 + level * levelHeight,
          index: startIdx + i
        });
      }
    }

    // Draw edges first (so they appear behind nodes)
    positions.forEach((pos, idx) => {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (parentIdx >= 0 && parentIdx < positions.length) {
        svg.append('line')
          .attr('x1', positions[parentIdx].x)
          .attr('y1', positions[parentIdx].y)
          .attr('x2', pos.x)
          .attr('y2', pos.y)
          .attr('stroke', 'var(--text-secondary)')
          .attr('stroke-width', 2)
          .attr('opacity', 0.5);
      }
    });

    // Draw nodes
    const nodeGroups = svg.selectAll('.node')
      .data(positions)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    // Node background
    nodeGroups.append('rect')
      .attr('x', -nodeRadius)
      .attr('y', -25)
      .attr('width', nodeRadius * 2)
      .attr('height', 50)
      .attr('rx', 10)
      .attr('fill', d => highlightedNodes.includes(d.index) ? 'var(--accent)' : 'var(--bg-tertiary)')
      .attr('stroke', d => highlightedNodes.includes(d.index) ? 'var(--accent)' : 'var(--border)')
      .attr('stroke-width', 2);

    // Vertical separator
    nodeGroups.append('line')
      .attr('x1', 0)
      .attr('y1', -20)
      .attr('x2', 0)
      .attr('y2', 20)
      .attr('stroke', 'var(--text-secondary)')
      .attr('stroke-width', 1)
      .attr('opacity', 0.5);

    // Left value
    nodeGroups.append('text')
      .attr('x', -20)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', d => highlightedNodes.includes(d.index) ? 'white' : 'var(--text-primary)')
      .attr('font-weight', 600)
      .attr('font-size', 16)
      .text(d => heap[d.index]?.left || '');

    // Right value
    nodeGroups.append('text')
      .attr('x', 20)
      .attr('y', 5)
      .attr('text-anchor', 'middle')
      .attr('fill', d => highlightedNodes.includes(d.index) ? 'white' : 'var(--text-primary)')
      .attr('font-weight', 600)
      .attr('font-size', 16)
      .text(d => heap[d.index]?.right || '');

    // Node index label
    nodeGroups.append('text')
      .attr('x', 0)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', 12)
      .text(d => `i=${d.index}`);
  };

  const insert = async (value) => {
    if (!value || isNaN(value)) return;

    setIsAnimating(true);
    const steps = [];
    const newHeap = [...heap];

    // Special case: empty heap
    if (newHeap.length === 0) {
      newHeap.push({ left: value, right: value });
      steps.push(`Created root with [${value}, ${value}]`);
    } else {
      // Find insertion position
      const lastIdx = newHeap.length;
      const parentIdx = Math.floor((lastIdx - 1) / 2);

      // Check if last node has space for single element
      const lastNode = newHeap[newHeap.length - 1];
      if (lastNode.left === lastNode.right && newHeap.length > 1) {
        // Last node has single element, can add second element
        if (value < lastNode.left) {
          newHeap[newHeap.length - 1] = { left: value, right: lastNode.left };
          steps.push(`Added ${value} as left endpoint to last node`);
        } else {
          newHeap[newHeap.length - 1] = { left: lastNode.left, right: value };
          steps.push(`Added ${value} as right endpoint to last node`);
        }
      } else {
        // Need new node
        newHeap.push({ left: value, right: value });
        let currentIdx = newHeap.length - 1;

        steps.push(`Created new node [${value}, ${value}] at position ${currentIdx}`);

        // Bubble up to maintain heap properties
        while (currentIdx > 0) {
          const parentIdx = Math.floor((currentIdx - 1) / 2);
          const parent = newHeap[parentIdx];
          const current = newHeap[currentIdx];

          // Fix min-heap property for left endpoints
          if (current.left < parent.left) {
            setHighlightedNodes([currentIdx, parentIdx]);
            steps.push(`Left endpoint ${current.left} < parent left ${parent.left}, swapping`);

            const temp = parent.left;
            newHeap[parentIdx].left = current.left;
            newHeap[currentIdx].left = temp;
          }

          // Fix max-heap property for right endpoints
          if (current.right > parent.right) {
            setHighlightedNodes([currentIdx, parentIdx]);
            steps.push(`Right endpoint ${current.right} > parent right ${parent.right}, swapping`);

            const temp = parent.right;
            newHeap[parentIdx].right = current.right;
            newHeap[currentIdx].right = temp;
          }

          // Check if we need to continue
          if (newHeap[currentIdx].left >= newHeap[parentIdx].left &&
              newHeap[currentIdx].right <= newHeap[parentIdx].right) {
            break;
          }

          currentIdx = parentIdx;
        }
      }
    }

    setStepDetails(steps);
    setHeap(newHeap);
    setMessage(`Inserted ${value}. ${verifyHeapProperty()}`);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const removeMin = async () => {
    if (heap.length === 0) return;

    setIsAnimating(true);
    const steps = [];
    const newHeap = [...heap];
    const min = newHeap[0].left;

    steps.push(`Removing minimum: ${min}`);
    setHighlightedNodes([0]);

    if (newHeap.length === 1) {
      if (newHeap[0].left === newHeap[0].right) {
        newHeap.pop();
        steps.push('Heap is now empty');
      } else {
        newHeap[0].left = newHeap[0].right;
        steps.push(`Root now contains single element [${newHeap[0].left}, ${newHeap[0].right}]`);
      }
    } else {
      // Get replacement from last node
      const lastNode = newHeap[newHeap.length - 1];
      let replacement;

      if (lastNode.left === lastNode.right) {
        replacement = lastNode.left;
        newHeap.pop();
        steps.push(`Taking ${replacement} from last node (removing last node)`);
      } else {
        replacement = lastNode.left;
        newHeap[newHeap.length - 1].left = lastNode.right;
        newHeap[newHeap.length - 1].right = lastNode.right;
        steps.push(`Taking left endpoint ${replacement} from last node`);
      }

      // Place replacement at root and bubble down
      newHeap[0].left = replacement;
      let currentIdx = 0;

      while (true) {
        const leftChild = 2 * currentIdx + 1;
        const rightChild = 2 * currentIdx + 2;
        let minIdx = currentIdx;

        // Find minimum among current and children
        if (leftChild < newHeap.length && newHeap[leftChild].left < newHeap[minIdx].left) {
          minIdx = leftChild;
        }
        if (rightChild < newHeap.length && newHeap[rightChild].left < newHeap[minIdx].left) {
          minIdx = rightChild;
        }

        if (minIdx !== currentIdx) {
          setHighlightedNodes([currentIdx, minIdx]);
          steps.push(`Swapping ${newHeap[currentIdx].left} with ${newHeap[minIdx].left}`);

          const temp = newHeap[currentIdx].left;
          newHeap[currentIdx].left = newHeap[minIdx].left;
          newHeap[minIdx].left = temp;
          currentIdx = minIdx;
        } else {
          break;
        }
      }

      // Ensure interval validity
      for (let i = 0; i < newHeap.length; i++) {
        if (newHeap[i].left > newHeap[i].right) {
          const temp = newHeap[i].left;
          newHeap[i].left = newHeap[i].right;
          newHeap[i].right = temp;
          steps.push(`Fixed interval order at node ${i}`);
        }
      }
    }

    setStepDetails(steps);
    setHeap(newHeap);
    setMessage(`Removed minimum: ${min}. ${verifyHeapProperty()}`);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const removeMax = async () => {
    if (heap.length === 0) return;

    setIsAnimating(true);
    const steps = [];
    const newHeap = [...heap];
    const max = newHeap[0].right;

    steps.push(`Removing maximum: ${max}`);
    setHighlightedNodes([0]);

    if (newHeap.length === 1) {
      if (newHeap[0].left === newHeap[0].right) {
        newHeap.pop();
        steps.push('Heap is now empty');
      } else {
        newHeap[0].right = newHeap[0].left;
        steps.push(`Root now contains single element [${newHeap[0].left}, ${newHeap[0].right}]`);
      }
    } else {
      // Similar to removeMin but for right endpoints
      const lastNode = newHeap[newHeap.length - 1];
      let replacement;

      if (lastNode.left === lastNode.right) {
        replacement = lastNode.right;
        newHeap.pop();
        steps.push(`Taking ${replacement} from last node (removing last node)`);
      } else {
        replacement = lastNode.right;
        newHeap[newHeap.length - 1].right = lastNode.left;
        newHeap[newHeap.length - 1].left = lastNode.left;
        steps.push(`Taking right endpoint ${replacement} from last node`);
      }

      // Place replacement at root and bubble down in max heap
      newHeap[0].right = replacement;
      let currentIdx = 0;

      while (true) {
        const leftChild = 2 * currentIdx + 1;
        const rightChild = 2 * currentIdx + 2;
        let maxIdx = currentIdx;

        if (leftChild < newHeap.length && newHeap[leftChild].right > newHeap[maxIdx].right) {
          maxIdx = leftChild;
        }
        if (rightChild < newHeap.length && newHeap[rightChild].right > newHeap[maxIdx].right) {
          maxIdx = rightChild;
        }

        if (maxIdx !== currentIdx) {
          setHighlightedNodes([currentIdx, maxIdx]);
          steps.push(`Swapping ${newHeap[currentIdx].right} with ${newHeap[maxIdx].right}`);

          const temp = newHeap[currentIdx].right;
          newHeap[currentIdx].right = newHeap[maxIdx].right;
          newHeap[maxIdx].right = temp;
          currentIdx = maxIdx;
        } else {
          break;
        }
      }

      // Ensure interval validity
      for (let i = 0; i < newHeap.length; i++) {
        if (newHeap[i].left > newHeap[i].right) {
          const temp = newHeap[i].left;
          newHeap[i].left = newHeap[i].right;
          newHeap[i].right = temp;
          steps.push(`Fixed interval order at node ${i}`);
        }
      }
    }

    setStepDetails(steps);
    setHeap(newHeap);
    setMessage(`Removed maximum: ${max}. ${verifyHeapProperty()}`);
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const reset = () => {
    setHeap([
      { left: 10, right: 90 },
      { left: 15, right: 80 },
      { left: 20, right: 82 },
      { left: 30, right: 40 },
      { left: 35, right: 70 },
      { left: 45, right: 50 },
      { left: 60, right: 65 }
    ]);
    setHighlightedNodes([]);
    setStepDetails([]);
    setMessage('Interval Heap: Each node contains [min, max]. Left endpoints form min-heap, right endpoints form max-heap.');
  };

  return (
    <div className="interval-heap-viz">
      <div className="viz-header">
        <h2>Interval Heap Operations (DEPQ)</h2>
        <p>A double-ended priority queue where each node stores an interval. Parent intervals contain child intervals.</p>
      </div>

      <div className="viz-controls">
        <div className="input-group">
          <input
            type="number"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnimating}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              insert(parseInt(inputValue));
              setInputValue('');
            }}
            disabled={isAnimating || !inputValue}
          >
            <FiPlus /> Insert
          </button>
        </div>

        <button
          className="btn btn-secondary"
          onClick={removeMin}
          disabled={isAnimating || heap.length === 0}
        >
          <FiMinus /> Remove Min
        </button>

        <button
          className="btn btn-secondary"
          onClick={removeMax}
          disabled={isAnimating || heap.length === 0}
        >
          <FiMinus /> Remove Max
        </button>

        <button
          className="btn btn-secondary"
          onClick={reset}
          disabled={isAnimating}
        >
          <FiRefreshCw /> Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-canvas">
        <svg ref={svgRef}></svg>
      </div>

      <div className="viz-details">
        <div className="viz-info">
          <h3>Heap Properties:</h3>
          <ul>
            <li>Min element: <strong>{heap.length > 0 ? heap[0].left : 'N/A'}</strong></li>
            <li>Max element: <strong>{heap.length > 0 ? heap[0].right : 'N/A'}</strong></li>
            <li>Total nodes: <strong>{heap.length}</strong></li>
            <li>Height: <strong>{Math.ceil(Math.log2(heap.length + 1))}</strong></li>
            <li>Status: <strong>{verifyHeapProperty()}</strong></li>
          </ul>
        </div>

        {stepDetails.length > 0 && (
          <div className="step-details">
            <h3>Operation Steps:</h3>
            <ol>
              {stepDetails.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        <div className="complexity-info">
          <h3>Time Complexity:</h3>
          <ul>
            <li>Insert: O(log n)</li>
            <li>Remove Min/Max: O(log n)</li>
            <li>Find Min/Max: O(1)</li>
            <li>Build Heap: O(n)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntervalHeapViz;