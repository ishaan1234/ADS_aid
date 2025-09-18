import React, { useState, useRef, useEffect } from 'react';
import './VisualizationBase.css';

const MatrixMultiplicationViz = () => {
  const [matrixSize, setMatrixSize] = useState(4);
  const [algorithm, setAlgorithm] = useState('standard');
  const [matrixA, setMatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [result, setResult] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState({ i: -1, j: -1, k: -1 });
  const [message, setMessage] = useState('Initialize matrices to start multiplication');
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, accesses: 0 });

  // Initialize random matrices
  const initializeMatrices = () => {
    const newMatrixA = Array(matrixSize).fill().map(() =>
      Array(matrixSize).fill().map(() => Math.floor(Math.random() * 10) + 1)
    );
    const newMatrixB = Array(matrixSize).fill().map(() =>
      Array(matrixSize).fill().map(() => Math.floor(Math.random() * 10) + 1)
    );
    const newResult = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));

    setMatrixA(newMatrixA);
    setMatrixB(newMatrixB);
    setResult(newResult);
    setCurrentStep({ i: -1, j: -1, k: -1 });
    setCacheStats({ hits: 0, misses: 0, accesses: 0 });
    setMessage('Matrices initialized. Choose algorithm and start multiplication.');
  };

  // Standard multiplication (row-major)
  const standardMultiplication = async () => {
    setIsAnimating(true);
    setMessage('Starting standard matrix multiplication (row-major order)');

    const newResult = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));
    let hits = 0, misses = 0, accesses = 0;

    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        setCurrentStep({ i, j, k: -1 });
        await new Promise(resolve => setTimeout(resolve, 300));

        for (let k = 0; k < matrixSize; k++) {
          setCurrentStep({ i, j, k });
          accesses += 3; // A[i][k], B[k][j], C[i][j]

          // Simulate cache behavior (simplified)
          if (k > 0) hits++; // A[i][k] likely in cache
          else misses++;

          if (j > 0 && k === 0) hits++; // C[i][j] likely in cache
          else if (k === 0) misses++;

          misses++; // B[k][j] often cache miss due to column access

          newResult[i][j] += matrixA[i][k] * matrixB[k][j];
          setCacheStats({ hits, misses, accesses });
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    setResult(newResult);
    setCurrentStep({ i: -1, j: -1, k: -1 });
    setMessage(`Standard multiplication complete. Cache hit rate: ${((hits/accesses)*100).toFixed(1)}%`);
    setIsAnimating(false);
  };

  // Cache-oblivious multiplication (recursive)
  const cacheObliviousMultiplication = async () => {
    setIsAnimating(true);
    setMessage('Starting cache-oblivious matrix multiplication (recursive divide-and-conquer)');

    const newResult = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));
    let hits = 0, misses = 0, accesses = 0;

    const multiply = async (ar, ac, br, bc, cr, cc, size) => {
      if (size <= 2) {
        // Base case: multiply small blocks
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            setCurrentStep({ i: ar + i, j: cc + j, k: -1 });
            await new Promise(resolve => setTimeout(resolve, 200));

            for (let k = 0; k < size; k++) {
              if (ar + i < matrixSize && ac + k < matrixSize &&
                  br + k < matrixSize && bc + j < matrixSize &&
                  cr + i < matrixSize && cc + j < matrixSize) {

                accesses += 3;
                hits += 2; // Better cache locality in small blocks
                misses += 1;

                newResult[cr + i][cc + j] += matrixA[ar + i][ac + k] * matrixB[br + k][bc + j];
                setCacheStats({ hits, misses, accesses });
                await new Promise(resolve => setTimeout(resolve, 50));
              }
            }
          }
        }
      } else {
        // Recursive case: divide into quadrants
        const halfSize = Math.floor(size / 2);

        // C11 = A11*B11 + A12*B21
        await multiply(ar, ac, br, bc, cr, cc, halfSize);
        await multiply(ar, ac + halfSize, br + halfSize, bc, cr, cc, halfSize);

        // C12 = A11*B12 + A12*B22
        await multiply(ar, ac, br, bc + halfSize, cr, cc + halfSize, halfSize);
        await multiply(ar, ac + halfSize, br + halfSize, bc + halfSize, cr, cc + halfSize, halfSize);

        // C21 = A21*B11 + A22*B21
        await multiply(ar + halfSize, ac, br, bc, cr + halfSize, cc, halfSize);
        await multiply(ar + halfSize, ac + halfSize, br + halfSize, bc, cr + halfSize, cc, halfSize);

        // C22 = A21*B12 + A22*B22
        await multiply(ar + halfSize, ac, br, bc + halfSize, cr + halfSize, cc + halfSize, halfSize);
        await multiply(ar + halfSize, ac + halfSize, br + halfSize, bc + halfSize, cr + halfSize, cc + halfSize, halfSize);
      }
    };

    await multiply(0, 0, 0, 0, 0, 0, matrixSize);

    setResult(newResult);
    setCurrentStep({ i: -1, j: -1, k: -1 });
    setMessage(`Cache-oblivious multiplication complete. Cache hit rate: ${((hits/accesses)*100).toFixed(1)}%`);
    setIsAnimating(false);
  };

  const startMultiplication = () => {
    if (algorithm === 'standard') {
      standardMultiplication();
    } else {
      cacheObliviousMultiplication();
    }
  };

  useEffect(() => {
    initializeMatrices();
  }, [matrixSize]);

  const renderMatrix = (matrix, name, highlight = null) => (
    <div className="section">
      <h3>{name}</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${matrixSize}, 40px)`,
        gap: '2px',
        marginBottom: '16px'
      }}>
        {matrix.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`${i}-${j}`}
              className={`value-item ${
                highlight &&
                ((highlight.type === 'row' && i === highlight.i) ||
                 (highlight.type === 'col' && j === highlight.j) ||
                 (highlight.type === 'cell' && i === highlight.i && j === highlight.j))
                  ? 'highlight' : ''
              }`}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {val}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Matrix Multiplication: Standard vs Cache-Oblivious</h2>
        <p>Compare standard row-major multiplication with cache-oblivious recursive divide-and-conquer approach.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Matrix Size</label>
          <select
            value={matrixSize}
            onChange={(e) => setMatrixSize(parseInt(e.target.value))}
            disabled={isAnimating}
          >
            <option value={2}>2x2</option>
            <option value={4}>4x4</option>
            <option value={8}>8x8</option>
          </select>
        </div>

        <div className="control-group">
          <label>Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isAnimating}
          >
            <option value="standard">Standard (Row-Major)</option>
            <option value="cache-oblivious">Cache-Oblivious</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={startMultiplication}
          disabled={isAnimating || matrixA.length === 0}
        >
          Start Multiplication
        </button>

        <button
          className="btn btn-secondary"
          onClick={initializeMatrices}
          disabled={isAnimating}
        >
          Reset Matrices
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {matrixA.length > 0 && renderMatrix(
            matrixA,
            'Matrix A',
            currentStep.i >= 0 ? { type: 'row', i: currentStep.i } : null
          )}

          {matrixB.length > 0 && renderMatrix(
            matrixB,
            'Matrix B',
            currentStep.j >= 0 ? { type: 'col', j: currentStep.j } : null
          )}

          {result.length > 0 && renderMatrix(
            result,
            'Result Matrix C',
            currentStep.i >= 0 && currentStep.j >= 0 ?
              { type: 'cell', i: currentStep.i, j: currentStep.j } : null
          )}
        </div>

        {currentStep.i >= 0 && (
          <div className="section">
            <h3>Current Operation</h3>
            <div className="viz-message">
              Computing C[{currentStep.i}][{currentStep.j}]
              {currentStep.k >= 0 && ` += A[${currentStep.i}][${currentStep.k}] * B[${currentStep.k}][${currentStep.j}]`}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Cache Performance</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Memory Accesses:</span>
              <span className="metric-value">{cacheStats.accesses}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Cache Hits:</span>
              <span className="metric-value">{cacheStats.hits}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Cache Misses:</span>
              <span className="metric-value">{cacheStats.misses}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Hit Rate:</span>
              <span className="metric-value">
                {cacheStats.accesses > 0 ? ((cacheStats.hits/cacheStats.accesses)*100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Algorithm Comparison:</h3>
        <ul>
          <li><strong>Standard:</strong> O(n³) time, poor cache locality due to column access pattern</li>
          <li><strong>Cache-Oblivious:</strong> O(n³) time, optimal cache performance for any cache size</li>
          <li>Cache-oblivious uses recursive divide-and-conquer to improve data locality</li>
          <li>For large matrices, cache-oblivious can be significantly faster in practice</li>
          <li>The recursive approach naturally adapts to the memory hierarchy</li>
        </ul>
      </div>
    </div>
  );
};

export default MatrixMultiplicationViz;