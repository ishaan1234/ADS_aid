import React, { useState } from 'react';
import './VisualizationBase.css';

const PotentialMethodViz = () => {
  const [operations, setOperations] = useState([]);
  const [currentPotential, setCurrentPotential] = useState(0);
  const [inputCost, setInputCost] = useState('');
  const [potentialChange, setPotentialChange] = useState('');

  const addOperation = () => {
    if (!inputCost) return;

    const actualCost = parseInt(inputCost);
    const deltaPhi = parseInt(potentialChange) || 0;
    const amortizedCost = actualCost + deltaPhi;
    const newPotential = currentPotential + deltaPhi;

    const newOp = {
      id: operations.length + 1,
      actualCost,
      deltaPhi,
      amortizedCost,
      potentialBefore: currentPotential,
      potentialAfter: newPotential
    };

    setOperations([...operations, newOp]);
    setCurrentPotential(newPotential);
    setInputCost('');
    setPotentialChange('');
  };

  const reset = () => {
    setOperations([]);
    setCurrentPotential(0);
    setInputCost('');
    setPotentialChange('');
  };

  const totalActual = operations.reduce((sum, op) => sum + op.actualCost, 0);
  const totalAmortized = operations.reduce((sum, op) => sum + op.amortizedCost, 0);

  return (
    <div className="viz-container">
      <div className="viz-header">
        <h2>Potential Method Visualization</h2>
        <p>Understanding amortized analysis through potential functions</p>
      </div>

      <div className="viz-content">
        <div className="potential-graph">
          <h3>Potential Function Graph</h3>
          <svg width="100%" height="300" viewBox="0 0 800 300">
            <defs>
              <linearGradient id="potentialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#667eea" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1={50 + i * 40}
                x2="750"
                y2={50 + i * 40}
                stroke="#e0e0e0"
                strokeDasharray="2,2"
              />
            ))}

            {/* Axes */}
            <line x1="50" y1="250" x2="750" y2="250" stroke="#333" strokeWidth="2" />
            <line x1="50" y1="50" x2="50" y2="250" stroke="#333" strokeWidth="2" />

            {/* Potential curve */}
            {operations.length > 0 && (
              <path
                d={`M 50 ${250 - Math.max(0, operations[0].potentialBefore) * 2} ` +
                   operations.map((op, i) => {
                     const x = 50 + (i + 1) * (700 / Math.max(10, operations.length + 1));
                     const y = 250 - Math.max(0, op.potentialAfter) * 2;
                     return `L ${x} ${y}`;
                   }).join(' ')}
                fill="none"
                stroke="#667eea"
                strokeWidth="3"
              />
            )}

            {/* Points */}
            {operations.map((op, i) => {
              const x = 50 + (i + 1) * (700 / Math.max(10, operations.length + 1));
              const y = 250 - Math.max(0, op.potentialAfter) * 2;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#667eea"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 15}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#333"
                  >
                    Φ={op.potentialAfter}
                  </text>
                </g>
              );
            })}

            {/* Labels */}
            <text x="400" y="290" textAnchor="middle" fontSize="14" fill="#666">
              Operations
            </text>
            <text x="25" y="150" textAnchor="middle" fontSize="14" fill="#666" transform="rotate(-90 25 150)">
              Potential Φ
            </text>
          </svg>
        </div>

        <div className="controls-section">
          <h3>Add Operation</h3>
          <div className="input-group">
            <input
              type="number"
              value={inputCost}
              onChange={(e) => setInputCost(e.target.value)}
              placeholder="Actual Cost"
            />
            <input
              type="number"
              value={potentialChange}
              onChange={(e) => setPotentialChange(e.target.value)}
              placeholder="ΔΦ (potential change)"
            />
            <button onClick={addOperation} disabled={!inputCost}>
              Add Operation
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>

        <div className="analysis-section">
          <h3>Cost Analysis</h3>
          <div className="cost-comparison">
            <div className="cost-card">
              <span className="label">Total Actual Cost</span>
              <span className="value">{totalActual}</span>
            </div>
            <div className="cost-card">
              <span className="label">Total Amortized Cost</span>
              <span className="value">{totalAmortized}</span>
            </div>
            <div className="cost-card highlight">
              <span className="label">Current Potential</span>
              <span className="value">{currentPotential}</span>
            </div>
          </div>

          <div className="operations-table">
            <h4>Operations Log</h4>
            <table>
              <thead>
                <tr>
                  <th>Op #</th>
                  <th>Actual Cost</th>
                  <th>Φ Before</th>
                  <th>ΔΦ</th>
                  <th>Φ After</th>
                  <th>Amortized Cost</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op) => (
                  <tr key={op.id}>
                    <td>{op.id}</td>
                    <td>{op.actualCost}</td>
                    <td>{op.potentialBefore}</td>
                    <td className={op.deltaPhi >= 0 ? 'positive' : 'negative'}>
                      {op.deltaPhi >= 0 ? '+' : ''}{op.deltaPhi}
                    </td>
                    <td>{op.potentialAfter}</td>
                    <td className="amortized">{op.amortizedCost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="explanation-section">
          <h3>Understanding the Potential Method</h3>
          <div className="formula-box">
            <h4>Key Formula</h4>
            <div className="formula">
              Amortized Cost = Actual Cost + ΔΦ
            </div>
            <div className="formula">
              ΔΦ = Φ(after) - Φ(before)
            </div>
          </div>
          <div className="explanation-grid">
            <div className="card">
              <h4>When ΔΦ {'>'} 0</h4>
              <p>Operation stores potential for future use. Amortized cost is higher than actual.</p>
            </div>
            <div className="card">
              <h4>When ΔΦ {'<'} 0</h4>
              <p>Operation uses stored potential. Amortized cost is lower than actual.</p>
            </div>
            <div className="card">
              <h4>Invariant</h4>
              <p>Φ(i) ≥ Φ(0) for all i ensures total amortized ≥ total actual cost.</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .potential-graph {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .cost-comparison {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .cost-card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .cost-card.highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .cost-card .label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }

        .cost-card .value {
          display: block;
          font-size: 2rem;
          font-weight: bold;
        }

        .operations-table {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f8f9fa;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: #666;
          border-bottom: 2px solid #e0e0e0;
        }

        td {
          padding: 0.75rem;
          border-bottom: 1px solid #f0f0f0;
        }

        td.positive {
          color: #28a745;
          font-weight: 600;
        }

        td.negative {
          color: #dc3545;
          font-weight: 600;
        }

        td.amortized {
          font-weight: 600;
          color: #667eea;
        }

        .formula-box {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .formula {
          font-size: 1.2rem;
          margin: 0.5rem 0;
          font-family: 'Courier New', monospace;
          color: #333;
        }

        .explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .explanation-grid .card {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .explanation-grid .card h4 {
          color: #667eea;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default PotentialMethodViz;