import React, { useState } from 'react';
import * as d3 from 'd3';
import './VisualizationBase.css';

const LoserTreeViz = () => {
  const [values, setValues] = useState([8, 3, 9, 4, 7, 6, 2, 1, 5, 10, 11, 12]);
  const [currentRun, setCurrentRun] = useState([]);
  const [runs, setRuns] = useState([]);
  const [tree, setTree] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [memorySize, setMemorySize] = useState(4);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('Click "Generate Runs" to start the loser tree run generation');

  const generateRuns = async () => {
    setIsRunning(true);
    setRuns([]);
    setCurrentRun([]);

    let runList = [];
    let currentRunTemp = [];
    let loserTree = new Array(memorySize).fill(null);
    let minInTree = -Infinity;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];

      if (loserTree.filter(v => v !== null).length < memorySize) {
        loserTree[loserTree.findIndex(v => v === null)] = value;
        setTree([...loserTree]);
        setMessage(`Adding ${value} to loser tree`);
        await delay(1000);
      } else {
        const minIndex = loserTree.indexOf(Math.min(...loserTree.filter(v => v !== null)));
        const minValue = loserTree[minIndex];

        if (value >= minValue) {
          currentRunTemp.push(minValue);
          loserTree[minIndex] = value;
          minInTree = Math.min(...loserTree);
        } else {
          currentRunTemp.push(...loserTree.filter(v => v !== null).sort((a, b) => a - b));
          runList.push([...currentRunTemp]);
          currentRunTemp = [];
          loserTree = new Array(memorySize).fill(value);
          loserTree[0] = value;
          for (let j = 1; j < memorySize && i + j < values.length; j++) {
            loserTree[j] = values[i + j];
          }
          i += memorySize - 1;
        }

        setCurrentRun([...currentRunTemp]);
        setTree([...loserTree]);
        await delay(1000);
      }
    }

    if (currentRunTemp.length > 0 || loserTree.filter(v => v !== null).length > 0) {
      currentRunTemp.push(...loserTree.filter(v => v !== null).sort((a, b) => a - b));
      runList.push([...currentRunTemp]);
    }

    setRuns(runList);
    setMessage(`Generated ${runList.length} runs. Average run length: ${(values.length / runList.length).toFixed(1)}`);
    setIsRunning(false);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const reset = () => {
    setCurrentRun([]);
    setRuns([]);
    setTree([]);
    setStep(0);
    setMessage('Click "Generate Runs" to start the loser tree run generation');
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Loser Tree Run Generation</h2>
        <p>Generates sorted runs using a loser tree with limited memory. Elements that can extend the current run are added; others start a new run.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Input Values:</label>
          <input
            type="text"
            value={values.join(', ')}
            onChange={(e) => setValues(e.target.value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v)))}
            disabled={isRunning}
          />
        </div>

        <div className="control-group">
          <label>Memory Size (k):</label>
          <input
            type="number"
            value={memorySize}
            min="2"
            max="8"
            onChange={(e) => setMemorySize(parseInt(e.target.value) || 4)}
            disabled={isRunning}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={generateRuns}
          disabled={isRunning}
        >
          Generate Runs
        </button>

        <button
          className="btn btn-secondary"
          onClick={reset}
          disabled={isRunning}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Input Stream</h3>
          <div className="value-list">
            {values.map((val, idx) => (
              <span key={idx} className="value-item">{val}</span>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Loser Tree (Memory)</h3>
          <div className="tree-display">
            {tree.map((val, idx) => (
              <div key={idx} className="tree-node">
                {val !== null ? val : '—'}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Current Run</h3>
          <div className="value-list">
            {currentRun.map((val, idx) => (
              <span key={idx} className="value-item sorted">{val}</span>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Generated Runs</h3>
          {runs.map((run, runIdx) => (
            <div key={runIdx} className="run-display">
              <strong>Run {runIdx + 1}:</strong>
              <div className="value-list">
                {run.map((val, idx) => (
                  <span key={idx} className="value-item sorted">{val}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="viz-info">
        <h3>Algorithm Properties:</h3>
        <ul>
          <li>Memory capacity: {memorySize} elements</li>
          <li>Expected average run length: ≈ 2k = {2 * memorySize}</li>
          <li>Sorted input → 1 run</li>
          <li>Reverse sorted → n/k runs</li>
          <li>Time complexity: O(n log k)</li>
        </ul>
      </div>
    </div>
  );
};

export default LoserTreeViz;