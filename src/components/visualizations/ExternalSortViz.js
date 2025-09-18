import React, { useState, useEffect } from 'react';
import { FiPlay, FiPause, FiRefreshCw, FiHardDrive, FiCpu } from 'react-icons/fi';
import './ExternalSortViz.css';

const ExternalSortViz = () => {
  const [data, setData] = useState([]);
  const [runs, setRuns] = useState([]);
  const [mergedRuns, setMergedRuns] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('initial');
  const [memorySize, setMemorySize] = useState(4);
  const [currentStep, setCurrentStep] = useState(0);
  const [operationLog, setOperationLog] = useState([]);
  const [highlightedElements, setHighlightedElements] = useState([]);

  useEffect(() => {
    generateRandomData();
  }, []);

  const generateRandomData = () => {
    const newData = Array.from({ length: 16 }, () => Math.floor(Math.random() * 100));
    setData(newData);
    setRuns([]);
    setMergedRuns([]);
    setCurrentPhase('initial');
    setOperationLog([]);
    setHighlightedElements([]);
    setCurrentStep(0);
  };

  const performExternalSort = async () => {
    setIsAnimating(true);
    const log = [];

    // Phase 1: Create initial runs
    log.push('Phase 1: Creating sorted runs using internal memory');
    setCurrentPhase('run-generation');

    const newRuns = [];
    for (let i = 0; i < data.length; i += memorySize) {
      const chunk = data.slice(i, Math.min(i + memorySize, data.length));
      setHighlightedElements(chunk.map((_, idx) => i + idx));

      log.push(`Loading elements ${i} to ${Math.min(i + memorySize - 1, data.length - 1)} into memory`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const sortedChunk = [...chunk].sort((a, b) => a - b);
      newRuns.push({
        id: `run-${newRuns.length}`,
        data: sortedChunk,
        level: 0
      });

      log.push(`Created sorted run ${newRuns.length}: [${sortedChunk.join(', ')}]`);
      setRuns([...newRuns]);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Phase 2: Merge runs
    log.push('Phase 2: Merging sorted runs');
    setCurrentPhase('merging');
    setHighlightedElements([]);

    let currentRuns = [...newRuns];
    let level = 1;

    while (currentRuns.length > 1) {
      const nextLevelRuns = [];

      for (let i = 0; i < currentRuns.length; i += 2) {
        if (i + 1 < currentRuns.length) {
          // Merge two runs
          const run1 = currentRuns[i];
          const run2 = currentRuns[i + 1];

          log.push(`Merging runs: [${run1.data.join(', ')}] and [${run2.data.join(', ')}]`);

          const merged = mergeTwoRuns(run1.data, run2.data);
          const newRun = {
            id: `run-${level}-${nextLevelRuns.length}`,
            data: merged,
            level: level
          };

          nextLevelRuns.push(newRun);
          log.push(`Result: [${merged.join(', ')}]`);

          setMergedRuns(prev => [...prev, newRun]);
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          // Odd run, carry forward
          nextLevelRuns.push({
            ...currentRuns[i],
            level: level
          });
        }
      }

      currentRuns = nextLevelRuns;
      level++;
    }

    log.push(`Final sorted array: [${currentRuns[0].data.join(', ')}]`);
    setCurrentPhase('complete');
    setOperationLog(log);
    setIsAnimating(false);
  };

  const mergeTwoRuns = (arr1, arr2) => {
    const result = [];
    let i = 0, j = 0;

    while (i < arr1.length && j < arr2.length) {
      if (arr1[i] <= arr2[j]) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }

    while (i < arr1.length) {
      result.push(arr1[i]);
      i++;
    }

    while (j < arr2.length) {
      result.push(arr2[j]);
      j++;
    }

    return result;
  };

  const reset = () => {
    generateRandomData();
  };

  return (
    <div className="external-sort-viz">
      <div className="viz-header">
        <h2>External Sorting (K-Way Merge)</h2>
        <p>Sorting data that doesn't fit in main memory using disk-based runs</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>
            Memory Size (elements):
            <input
              type="number"
              min="2"
              max="8"
              value={memorySize}
              onChange={(e) => setMemorySize(parseInt(e.target.value))}
              disabled={isAnimating}
            />
          </label>

          <button
            className="btn btn-primary"
            onClick={performExternalSort}
            disabled={isAnimating || currentPhase === 'complete'}
          >
            <FiPlay /> Start Sorting
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

      <div className="viz-display">
        {/* Original Data */}
        <div className="data-section">
          <h3><FiHardDrive /> Disk Storage (Unsorted Data)</h3>
          <div className="data-array">
            {data.map((value, idx) => (
              <div
                key={idx}
                className={`data-element ${highlightedElements.includes(idx) ? 'highlighted' : ''}`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Memory Buffer */}
        {currentPhase === 'run-generation' && (
          <div className="memory-section">
            <h3><FiCpu /> Main Memory (Size: {memorySize})</h3>
            <div className="memory-buffer">
              {highlightedElements.map(idx => (
                <div key={idx} className="memory-element">
                  {data[idx]}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Initial Runs */}
        {runs.length > 0 && (
          <div className="runs-section">
            <h3>Initial Sorted Runs</h3>
            <div className="runs-container">
              {runs.map((run, idx) => (
                <div key={run.id} className="run">
                  <div className="run-header">Run {idx + 1}</div>
                  <div className="run-data">
                    {run.data.map((value, i) => (
                      <span key={i} className="run-element">{value}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merge Tree */}
        {mergedRuns.length > 0 && (
          <div className="merge-tree-section">
            <h3>Merge Tree</h3>
            <div className="merge-levels">
              {Array.from(new Set(mergedRuns.map(r => r.level))).map(level => (
                <div key={level} className="merge-level">
                  <div className="level-label">Level {level}</div>
                  <div className="level-runs">
                    {mergedRuns.filter(r => r.level === level).map(run => (
                      <div key={run.id} className="merged-run">
                        <div className="run-data">
                          {run.data.map((value, i) => (
                            <span key={i} className="run-element">{value}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Result */}
        {currentPhase === 'complete' && mergedRuns.length > 0 && (
          <div className="result-section">
            <h3>Final Sorted Array</h3>
            <div className="final-array">
              {mergedRuns[mergedRuns.length - 1].data.map((value, idx) => (
                <div key={idx} className="final-element">
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="viz-details">
        <div className="operation-log">
          <h3>Operation Log</h3>
          <div className="log-entries">
            {operationLog.map((entry, idx) => (
              <div key={idx} className="log-entry">
                {entry}
              </div>
            ))}
          </div>
        </div>

        <div className="info-panels">
          <div className="algorithm-info">
            <h3>Algorithm Steps</h3>
            <ol>
              <li>Read M records into memory (M = memory size)</li>
              <li>Sort records using internal sorting</li>
              <li>Write sorted run to disk</li>
              <li>Repeat until all data processed</li>
              <li>Merge sorted runs using k-way merge</li>
            </ol>
          </div>

          <div className="complexity-info">
            <h3>Complexity Analysis</h3>
            <ul>
              <li>I/O Operations: O(N/B × log(N/M))</li>
              <li>CPU Time: O(N × log N)</li>
              <li>Runs Created: ⌈N/M⌉</li>
              <li>Merge Passes: ⌈log_k(N/M)⌉</li>
            </ul>
            <small>N=records, M=memory size, B=block size, k=merge order</small>
          </div>

          <div className="use-cases">
            <h3>Use Cases</h3>
            <ul>
              <li>Database sorting operations</li>
              <li>Large file processing</li>
              <li>Data warehousing ETL</li>
              <li>Big data processing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalSortViz;