import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const ParallelMergeViz = () => {
  const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10, 15, 21, 4, 55, 91, 33, 67, 12, 88]);
  const [sortingSteps, setSortingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Parallel merge sort divides work across multiple processors');
  const [processors, setProcessors] = useState(4);
  const [highlightedRanges, setHighlightedRanges] = useState([]);
  const [parallelSteps, setParallelSteps] = useState([]);

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: 16 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    resetVisualization();
  };

  // Reset visualization
  const resetVisualization = () => {
    setSortingSteps([]);
    setCurrentStep(0);
    setHighlightedRanges([]);
    setParallelSteps([]);
    setMessage('Parallel merge sort divides work across multiple processors');
  };

  // Sequential merge function
  const merge = (arr, left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;
    const result = [...arr];

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        result[k] = leftArr[i];
        i++;
      } else {
        result[k] = rightArr[j];
        j++;
      }
      k++;
    }

    while (i < leftArr.length) {
      result[k] = leftArr[i];
      i++;
      k++;
    }

    while (j < rightArr.length) {
      result[k] = rightArr[j];
      j++;
      k++;
    }

    return result;
  };

  // Parallel merge sort simulation
  const parallelMergeSort = async () => {
    setIsAnimating(true);
    setMessage('Starting parallel merge sort...');

    const steps = [];
    const n = array.length;
    let currentArray = [...array];

    // Phase 1: Divide into chunks for parallel processing
    const chunkSize = Math.ceil(n / processors);
    const chunks = [];

    for (let i = 0; i < processors; i++) {
      const start = i * chunkSize;
      const end = Math.min((i + 1) * chunkSize, n);
      if (start < n) {
        chunks.push({ start, end: end - 1, processor: i });
      }
    }

    steps.push({
      phase: 'divide',
      description: `Divide array into ${chunks.length} chunks for ${processors} processors`,
      array: [...currentArray],
      chunks: [...chunks],
      level: 0
    });

    // Phase 2: Sort chunks in parallel (simulated)
    setMessage('Phase 1: Sorting chunks in parallel...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (const chunk of chunks) {
      const chunkArray = currentArray.slice(chunk.start, chunk.end + 1);
      chunkArray.sort((a, b) => a - b);

      for (let i = 0; i < chunkArray.length; i++) {
        currentArray[chunk.start + i] = chunkArray[i];
      }

      steps.push({
        phase: 'sort_chunk',
        description: `Processor ${chunk.processor} sorted chunk [${chunk.start}-${chunk.end}]`,
        array: [...currentArray],
        chunk: chunk,
        level: 1
      });
    }

    // Phase 3: Parallel merge (bottom-up)
    setMessage('Phase 2: Merging sorted chunks...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    let level = 2;
    let mergeSize = chunkSize;

    while (mergeSize < n) {
      const mergeSteps = [];

      for (let left = 0; left < n; left += mergeSize * 2) {
        const mid = Math.min(left + mergeSize - 1, n - 1);
        const right = Math.min(left + mergeSize * 2 - 1, n - 1);

        if (mid < right) {
          mergeSteps.push({ left, mid, right });
        }
      }

      // Simulate parallel merging
      for (const mergeStep of mergeSteps) {
        const { left, mid, right } = mergeStep;
        currentArray = merge(currentArray, left, mid, right);

        steps.push({
          phase: 'merge',
          description: `Merge [${left}-${mid}] and [${mid + 1}-${right}]`,
          array: [...currentArray],
          mergeRange: { left, mid, right },
          level: level
        });
      }

      mergeSize *= 2;
      level++;
    }

    setSortingSteps(steps);
    setParallelSteps(steps);
    setMessage('Parallel merge sort complete! Array is now sorted.');
    setIsAnimating(false);
  };

  // Step through animation
  const stepThrough = async () => {
    setIsAnimating(true);

    for (let i = 0; i < sortingSteps.length; i++) {
      setCurrentStep(i);
      const step = sortingSteps[i];

      setArray([...step.array]);
      setMessage(step.description);

      // Highlight current operation
      if (step.chunk) {
        setHighlightedRanges([{
          start: step.chunk.start,
          end: step.chunk.end,
          color: `hsl(${step.chunk.processor * 60}, 70%, 60%)`
        }]);
      } else if (step.mergeRange) {
        setHighlightedRanges([
          {
            start: step.mergeRange.left,
            end: step.mergeRange.mid,
            color: '#3b82f6'
          },
          {
            start: step.mergeRange.mid + 1,
            end: step.mergeRange.right,
            color: '#ef4444'
          }
        ]);
      } else if (step.chunks) {
        setHighlightedRanges(step.chunks.map(chunk => ({
          start: chunk.start,
          end: chunk.end,
          color: `hsl(${chunk.processor * 60}, 70%, 60%)`
        })));
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setHighlightedRanges([]);
    setCurrentStep(sortingSteps.length);
    setIsAnimating(false);
  };

  // Get processor colors
  const getProcessorColors = () => {
    const colors = [];
    for (let i = 0; i < processors; i++) {
      colors.push(`hsl(${i * 60}, 70%, 60%)`);
    }
    return colors;
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Parallel Merge Sort</h2>
        <p>Demonstrates how merge sort can be parallelized across multiple processors for improved performance.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Number of Processors</label>
          <select
            value={processors}
            onChange={(e) => setProcessors(parseInt(e.target.value))}
            disabled={isAnimating}
          >
            <option value={2}>2 Processors</option>
            <option value={4}>4 Processors</option>
            <option value={8}>8 Processors</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={parallelMergeSort}
          disabled={isAnimating}
        >
          Generate Parallel Plan
        </button>

        <button
          className="btn btn-secondary"
          onClick={stepThrough}
          disabled={isAnimating || sortingSteps.length === 0}
        >
          Step Through
        </button>

        <button
          className="btn btn-secondary"
          onClick={generateRandomArray}
          disabled={isAnimating}
        >
          Random Array
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
          <h3>Array Visualization</h3>
          <div style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            {array.map((value, index) => {
              const highlight = highlightedRanges.find(range =>
                index >= range.start && index <= range.end
              );

              return (
                <div
                  key={index}
                  className="value-item"
                  style={{
                    backgroundColor: highlight ? highlight.color : 'var(--bg-tertiary)',
                    color: highlight ? 'white' : 'var(--text-primary)',
                    position: 'relative',
                    minWidth: '40px'
                  }}
                >
                  {value}
                  <span style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: 'var(--text-secondary)'
                  }}>
                    {index}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="section">
          <h3>Processor Assignment</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${processors}, 1fr)`,
            gap: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            {Array.from({ length: processors }, (_, i) => {
              const chunkSize = Math.ceil(array.length / processors);
              const start = i * chunkSize;
              const end = Math.min((i + 1) * chunkSize, array.length);
              const color = `hsl(${i * 60}, 70%, 60%)`;

              return (
                <div key={i} style={{
                  padding: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius)',
                  textAlign: 'center'
                }}>
                  <h4 style={{
                    margin: '0 0 8px 0',
                    color: color,
                    fontSize: '14px'
                  }}>
                    Processor {i}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Elements [{start}-{end - 1}]
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Count: {end - start}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {parallelSteps.length > 0 && (
          <div className="section">
            <h3>Parallel Execution Plan</h3>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px'
            }}>
              {parallelSteps.map((step, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    marginBottom: '4px',
                    background: index === currentStep ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: index === currentStep ? 'white' : 'var(--text-primary)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>
                    <strong>Step {index + 1}:</strong> {step.description}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    opacity: 0.8,
                    background: 'rgba(255,255,255,0.1)',
                    padding: '2px 6px',
                    borderRadius: '3px'
                  }}>
                    Level {step.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Performance Analysis</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Array Size:</span>
              <span className="metric-value">{array.length}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Processors Used:</span>
              <span className="metric-value">{processors}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Sequential Time:</span>
              <span className="metric-value">O(n log n)</span>
            </div>
            <div className="metric">
              <span className="metric-label">Parallel Time:</span>
              <span className="metric-value">O((n/p) log n + log p)</span>
            </div>
            <div className="metric">
              <span className="metric-label">Speedup Factor:</span>
              <span className="metric-value">~{(processors * 0.8).toFixed(1)}x</span>
            </div>
            <div className="metric">
              <span className="metric-label">Efficiency:</span>
              <span className="metric-value">{((0.8) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Parallel Algorithm Phases</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Phase 1: Divide</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Split array into p chunks</li>
                  <li>Assign each chunk to a processor</li>
                  <li>Load balancing consideration</li>
                  <li>Time: O(1)</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Phase 2: Local Sort</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Each processor sorts its chunk</li>
                  <li>Can use any sorting algorithm</li>
                  <li>Independent parallel execution</li>
                  <li>Time: O((n/p) log(n/p))</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Phase 3: Merge</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Bottom-up merging of sorted chunks</li>
                  <li>Pairs of processors cooperate</li>
                  <li>log p merge levels</li>
                  <li>Time: O((n/p) log p)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Complexity Analysis</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontSize: '14px'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Metric</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Sequential</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Parallel</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '8px' }}>Time Complexity</td>
                  <td style={{ padding: '8px' }}>O(n log n)</td>
                  <td style={{ padding: '8px' }}>O((n/p) log n + log p)</td>
                  <td style={{ padding: '8px' }}>p = number of processors</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Space Complexity</td>
                  <td style={{ padding: '8px' }}>O(n)</td>
                  <td style={{ padding: '8px' }}>O(n)</td>
                  <td style={{ padding: '8px' }}>Same auxiliary space</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Communication</td>
                  <td style={{ padding: '8px' }}>None</td>
                  <td style={{ padding: '8px' }}>O(n log p)</td>
                  <td style={{ padding: '8px' }}>Data transfer between processors</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}>Scalability</td>
                  <td style={{ padding: '8px' }}>N/A</td>
                  <td style={{ padding: '8px' }}>Limited by O(log p)</td>
                  <td style={{ padding: '8px' }}>Diminishing returns with more processors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Parallel Merge Sort Properties:</h3>
        <ul>
          <li>Divide-and-conquer approach suitable for parallelization</li>
          <li>Each processor sorts a portion of the array independently</li>
          <li>Merging phase requires coordination between processors</li>
          <li>Theoretical speedup: O(p) but limited by merge synchronization</li>
          <li>Communication overhead increases with processor count</li>
          <li>Optimal processor count depends on array size and architecture</li>
        </ul>
      </div>
    </div>
  );
};

export default ParallelMergeViz;