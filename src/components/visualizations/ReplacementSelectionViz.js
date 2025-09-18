import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const ReplacementSelectionViz = () => {
  const [inputData, setInputData] = useState([4, 2, 8, 1, 9, 3, 7, 5, 6, 10, 11, 12]);
  const [memorySize, setMemorySize] = useState(4);
  const [memory, setMemory] = useState([]);
  const [outputRuns, setOutputRuns] = useState([]);
  const [currentRun, setCurrentRun] = useState([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('Click "Start Replacement Selection" to begin the algorithm');
  const [highlightedMemory, setHighlightedMemory] = useState(-1);

  // Initialize memory with first few elements
  const initializeMemory = () => {
    const initialMemory = inputData.slice(0, memorySize).map((value, index) => ({
      value,
      canOutput: true,
      index
    }));
    setMemory(initialMemory);
    setInputIndex(memorySize);
    setOutputRuns([]);
    setCurrentRun([]);
    setStep(0);
    setHighlightedMemory(-1);
    setMessage('Memory initialized. Ready to start replacement selection.');
  };

  // Find minimum element that can be output
  const findMinOutput = () => {
    const outputable = memory.filter(item => item.canOutput);
    if (outputable.length === 0) return -1;

    let minIndex = -1;
    let minValue = Infinity;

    memory.forEach((item, index) => {
      if (item.canOutput && item.value < minValue) {
        minValue = item.value;
        minIndex = index;
      }
    });

    return minIndex;
  };

  // Replacement selection step
  const performStep = async () => {
    const minIndex = findMinOutput();

    if (minIndex === -1) {
      // Start new run - reset all items to be outputable
      const newMemory = memory.map(item => ({ ...item, canOutput: true }));
      setMemory(newMemory);

      if (currentRun.length > 0) {
        setOutputRuns(prev => [...prev, [...currentRun]]);
        setCurrentRun([]);
        setMessage(`Run completed! Starting new run. Total runs so far: ${outputRuns.length + 1}`);
      }
      return;
    }

    const outputValue = memory[minIndex].value;
    const lastOutput = currentRun.length > 0 ? currentRun[currentRun.length - 1] : -1;

    // Highlight the selected memory position
    setHighlightedMemory(minIndex);
    setMessage(`Outputting minimum value: ${outputValue} from memory position ${minIndex}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Add to current run
    setCurrentRun(prev => [...prev, outputValue]);

    // Replace with next input value if available
    if (inputIndex < inputData.length) {
      const newValue = inputData[inputIndex];
      const newMemory = [...memory];

      newMemory[minIndex] = {
        value: newValue,
        canOutput: newValue >= outputValue, // Can only output if >= last output
        index: inputIndex
      };

      setMemory(newMemory);
      setInputIndex(prev => prev + 1);
      setMessage(`Replaced with ${newValue}. ${newValue >= outputValue ? 'Can' : 'Cannot'} be output in current run.`);
    } else {
      // No more input, mark as unusable
      const newMemory = memory.filter((_, index) => index !== minIndex);
      setMemory(newMemory);
      setMessage(`No more input. Removed memory position ${minIndex}.`);
    }

    setStep(prev => prev + 1);
    setHighlightedMemory(-1);
  };

  // Start the algorithm
  const startAlgorithm = async () => {
    setIsAnimating(true);
    initializeMemory();

    await new Promise(resolve => setTimeout(resolve, 500));

    while (memory.length > 0 || inputIndex < inputData.length) {
      await performStep();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Check if we need to continue
      if (memory.length === 0 && inputIndex >= inputData.length) break;
      if (memory.every(item => !item.canOutput) && inputIndex >= inputData.length) break;
    }

    // Finalize last run
    if (currentRun.length > 0) {
      setOutputRuns(prev => [...prev, [...currentRun]]);
      setCurrentRun([]);
    }

    setMessage(`Replacement Selection complete! Generated ${outputRuns.length + (currentRun.length > 0 ? 1 : 0)} sorted runs.`);
    setIsAnimating(false);
  };

  // Manual step
  const manualStep = () => {
    if (!isAnimating && memory.length > 0) {
      performStep();
    }
  };

  useEffect(() => {
    initializeMemory();
  }, [memorySize, inputData]);

  const resetAlgorithm = () => {
    setIsAnimating(false);
    initializeMemory();
    setMessage('Algorithm reset. Click "Start" to begin replacement selection.');
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Replacement Selection for External Sorting</h2>
        <p>Demonstrates how replacement selection generates sorted runs longer than available memory.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Memory Size</label>
          <select
            value={memorySize}
            onChange={(e) => setMemorySize(parseInt(e.target.value))}
            disabled={isAnimating}
          >
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div className="control-group">
          <label>Input Data</label>
          <input
            type="text"
            value={inputData.join(', ')}
            onChange={(e) => {
              const values = e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
              setInputData(values);
            }}
            disabled={isAnimating}
            placeholder="Comma-separated numbers"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={startAlgorithm}
          disabled={isAnimating}
        >
          Start Replacement Selection
        </button>

        <button
          className="btn btn-secondary"
          onClick={manualStep}
          disabled={isAnimating || memory.length === 0}
        >
          Manual Step
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetAlgorithm}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Input Data</h3>
          <div className="value-list">
            {inputData.map((value, index) => (
              <div
                key={index}
                className={`value-item ${index < inputIndex ? 'sorted' : ''}`}
              >
                {value}
              </div>
            ))}
          </div>
          <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Processed: {inputIndex} / {inputData.length}
          </p>
        </div>

        <div className="section">
          <h3>Memory Buffer (Size: {memorySize})</h3>
          <div className="value-list">
            {memory.map((item, index) => (
              <div
                key={index}
                className={`value-item ${
                  index === highlightedMemory ? 'highlight' :
                  !item.canOutput ? 'sorted' : ''
                }`}
                style={{
                  position: 'relative',
                  backgroundColor: !item.canOutput ? 'var(--danger)' : undefined,
                  color: !item.canOutput ? 'white' : undefined
                }}
              >
                {item.value}
                {!item.canOutput && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    fontSize: '10px',
                    background: 'var(--danger)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    ✗
                  </span>
                )}
              </div>
            ))}
          </div>
          <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Red items cannot be output in current run
          </p>
        </div>

        <div className="section">
          <h3>Current Run</h3>
          <div className="value-list">
            {currentRun.map((value, index) => (
              <div key={index} className="value-item highlight">
                {value}
              </div>
            ))}
          </div>
          {currentRun.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No values in current run</p>
          )}
        </div>

        <div className="section">
          <h3>Completed Runs</h3>
          {outputRuns.map((run, runIndex) => (
            <div key={runIndex} className="run-display">
              <strong>Run {runIndex + 1} (Length: {run.length}):</strong>
              <div className="value-list" style={{ marginTop: '8px' }}>
                {run.map((value, index) => (
                  <div key={index} className="value-item sorted">
                    {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {outputRuns.length === 0 && (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No completed runs yet</p>
          )}
        </div>

        <div className="section">
          <h3>Algorithm Statistics</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Steps:</span>
              <span className="metric-value">{step}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Runs Generated:</span>
              <span className="metric-value">{outputRuns.length + (currentRun.length > 0 ? 1 : 0)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Average Run Length:</span>
              <span className="metric-value">
                {outputRuns.length > 0 ?
                  (outputRuns.reduce((sum, run) => sum + run.length, 0) / outputRuns.length).toFixed(1) :
                  currentRun.length || 0
                }
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Memory Efficiency:</span>
              <span className="metric-value">
                {outputRuns.length > 0 ?
                  ((outputRuns.reduce((sum, run) => sum + run.length, 0) / memorySize)).toFixed(1) + 'x' :
                  '-'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Replacement Selection Algorithm:</h3>
        <ul>
          <li>Always outputs the minimum value that can be output</li>
          <li>Replaces output values with new input when available</li>
          <li>New values can only be output if they're ≥ the last output in current run</li>
          <li>Generates runs typically 2x memory size on random data</li>
          <li>Essential for external sorting when data doesn't fit in memory</li>
          <li>Better than simple k-way merge for initial run generation</li>
        </ul>
      </div>
    </div>
  );
};

export default ReplacementSelectionViz;