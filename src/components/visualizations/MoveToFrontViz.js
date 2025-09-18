import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const MoveToFrontViz = () => {
  const [list, setList] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  const [searchSequence, setSearchSequence] = useState('BACBACAC');
  const [currentSearch, setCurrentSearch] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Move-to-Front list reorganizes elements based on access patterns');
  const [accessHistory, setAccessHistory] = useState([]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [staticList, setStaticList] = useState([]);
  const [statistics, setStatistics] = useState({
    mtfComparisons: 0,
    staticComparisons: 0,
    mtfMoves: 0
  });

  // Initialize lists
  useEffect(() => {
    setStaticList([...list]);
  }, [list]);

  // Perform search in Move-to-Front list
  const searchInMTF = async (element, listCopy) => {
    let comparisons = 0;
    let found = false;
    let foundIndex = -1;

    for (let i = 0; i < listCopy.length; i++) {
      comparisons++;
      if (listCopy[i] === element) {
        found = true;
        foundIndex = i;
        break;
      }
    }

    if (found && foundIndex > 0) {
      // Move to front
      const foundElement = listCopy.splice(foundIndex, 1)[0];
      listCopy.unshift(foundElement);
    }

    return { found, comparisons, moves: found && foundIndex > 0 ? 1 : 0 };
  };

  // Perform search in static list
  const searchInStatic = (element, listCopy) => {
    let comparisons = 0;

    for (let i = 0; i < listCopy.length; i++) {
      comparisons++;
      if (listCopy[i] === element) {
        return { found: true, comparisons };
      }
    }

    return { found: false, comparisons };
  };

  // Animate single search
  const animateSearch = async (element, index) => {
    setCurrentSearch(index);
    setMessage(`Searching for element: ${element}`);

    const listCopy = [...list];
    let comparisons = 0;
    let foundIndex = -1;

    // Show search process
    for (let i = 0; i < listCopy.length; i++) {
      comparisons++;

      // Highlight current comparison
      const highlightedList = listCopy.map((item, idx) => ({
        value: item,
        highlighted: idx === i,
        compared: idx < i
      }));

      setMessage(`Comparing with position ${i}: ${listCopy[i]} ${listCopy[i] === element ? '= ' + element + ' ✓' : '≠ ' + element + ' ✗'}`);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (listCopy[i] === element) {
        foundIndex = i;
        break;
      }
    }

    // Update statistics
    setStatistics(prev => ({
      ...prev,
      mtfComparisons: prev.mtfComparisons + comparisons,
      staticComparisons: prev.staticComparisons + comparisons
    }));

    if (foundIndex !== -1) {
      if (foundIndex > 0) {
        setMessage(`Found ${element} at position ${foundIndex}. Moving to front...`);

        // Animate move to front
        const foundElement = listCopy.splice(foundIndex, 1)[0];
        listCopy.unshift(foundElement);

        setStatistics(prev => ({
          ...prev,
          mtfMoves: prev.mtfMoves + 1
        }));

        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        setMessage(`Found ${element} already at front. No move needed.`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setList([...listCopy]);
    } else {
      setMessage(`Element ${element} not found in list.`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Add to access history
    setAccessHistory(prev => [...prev, {
      element,
      position: foundIndex,
      comparisons,
      listState: [...listCopy]
    }]);
  };

  // Start search sequence
  const startSearchSequence = async () => {
    setIsAnimating(true);
    setAccessHistory([]);
    setStatistics({ mtfComparisons: 0, staticComparisons: 0, mtfMoves: 0 });
    setCurrentSearch(-1);

    // Reset lists
    const initialList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    setList([...initialList]);
    setStaticList([...initialList]);

    for (let i = 0; i < searchSequence.length; i++) {
      await animateSearch(searchSequence[i], i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Calculate comparison savings
    const savings = statistics.staticComparisons - statistics.mtfComparisons;
    const savingsPercent = statistics.staticComparisons > 0 ?
      ((savings / statistics.staticComparisons) * 100).toFixed(1) : 0;

    setMessage(`Search complete! MTF saved ${savings} comparisons (${savingsPercent}% reduction)`);
    setCurrentSearch(-1);
    setIsAnimating(false);
  };

  // Compare with static list
  const compareWithStatic = async () => {
    setComparisonMode(true);
    setIsAnimating(true);

    const mtfList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const staticListCopy = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    let mtfComparisons = 0;
    let staticComparisons = 0;
    let mtfMoves = 0;

    for (let i = 0; i < searchSequence.length; i++) {
      const element = searchSequence[i];

      setMessage(`Comparing search for: ${element}`);
      await new Promise(resolve => setTimeout(resolve, 800));

      // MTF search
      const mtfResult = await searchInMTF(element, mtfList);
      mtfComparisons += mtfResult.comparisons;
      mtfMoves += mtfResult.moves;

      // Static search
      const staticResult = searchInStatic(element, staticListCopy);
      staticComparisons += staticResult.comparisons;

      setStatistics({
        mtfComparisons,
        staticComparisons,
        mtfMoves
      });

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setList([...mtfList]);
    setMessage('Comparison complete! See statistics below.');
    setIsAnimating(false);
  };

  // Reset visualization
  const resetVisualization = () => {
    const initialList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    setList([...initialList]);
    setStaticList([...initialList]);
    setAccessHistory([]);
    setCurrentSearch(-1);
    setComparisonMode(false);
    setStatistics({ mtfComparisons: 0, staticComparisons: 0, mtfMoves: 0 });
    setMessage('Move-to-Front list reorganizes elements based on access patterns');
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Move-to-Front List</h2>
        <p>Demonstrates how move-to-front strategy improves search performance for frequently accessed elements.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Search Sequence</label>
          <input
            type="text"
            value={searchSequence}
            onChange={(e) => setSearchSequence(e.target.value.toUpperCase())}
            disabled={isAnimating}
            placeholder="e.g., BACBACAC"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={startSearchSequence}
          disabled={isAnimating || !searchSequence}
        >
          Start Search
        </button>

        <button
          className="btn btn-secondary"
          onClick={compareWithStatic}
          disabled={isAnimating || !searchSequence}
        >
          Compare with Static
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
          <h3>Search Sequence</h3>
          <div className="value-list">
            {searchSequence.split('').map((char, index) => (
              <div
                key={index}
                className={`value-item ${
                  index < currentSearch ? 'sorted' :
                  index === currentSearch ? 'highlight' : ''
                }`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Move-to-Front List</h3>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Front →</span>
            <div className="value-list">
              {list.map((item, index) => (
                <div
                  key={index}
                  className="value-item"
                  style={{
                    position: 'relative',
                    backgroundColor: index === 0 ? 'var(--success)' : 'var(--bg-tertiary)',
                    color: index === 0 ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {item}
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
              ))}
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>← Back</span>
          </div>
        </div>

        {comparisonMode && (
          <div className="section">
            <h3>Static List (for comparison)</h3>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Front →</span>
              <div className="value-list">
                {staticList.map((item, index) => (
                  <div
                    key={index}
                    className="value-item"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {item}
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
                ))}
              </div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>← Back</span>
            </div>
          </div>
        )}

        <div className="section">
          <h3>Performance Statistics</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">MTF Total Comparisons:</span>
              <span className="metric-value">{statistics.mtfComparisons}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Static Total Comparisons:</span>
              <span className="metric-value">{statistics.staticComparisons}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Comparisons Saved:</span>
              <span className="metric-value">
                {statistics.staticComparisons - statistics.mtfComparisons}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">MTF Moves:</span>
              <span className="metric-value">{statistics.mtfMoves}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Efficiency Gain:</span>
              <span className="metric-value">
                {statistics.staticComparisons > 0 ?
                  (((statistics.staticComparisons - statistics.mtfComparisons) / statistics.staticComparisons) * 100).toFixed(1) + '%' :
                  '0%'
                }
              </span>
            </div>
          </div>
        </div>

        {accessHistory.length > 0 && (
          <div className="section">
            <h3>Access History</h3>
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px'
            }}>
              {accessHistory.map((access, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px',
                    marginBottom: '4px',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius)',
                    fontSize: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>
                    <strong>Search {index + 1}:</strong> Found '{access.element}' at position {access.position}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {access.comparisons} comparisons
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Sample Search Patterns</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            {[
              { pattern: 'AAAAA', description: 'High locality' },
              { pattern: 'ABABABAB', description: 'Alternating access' },
              { pattern: 'ABCDEFGH', description: 'Sequential access' },
              { pattern: 'HGFEDCBA', description: 'Reverse sequential' },
              { pattern: 'BACBACAC', description: 'Mixed pattern' },
              { pattern: 'ACEGBDFH', description: 'Random access' }
            ].map((sample, index) => (
              <button
                key={index}
                className="btn btn-secondary"
                onClick={() => !isAnimating && setSearchSequence(sample.pattern)}
                disabled={isAnimating}
                style={{
                  fontSize: '12px',
                  padding: '8px',
                  textAlign: 'left',
                  height: 'auto'
                }}
              >
                <div style={{ fontFamily: 'monospace', marginBottom: '4px' }}>
                  {sample.pattern}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Move-to-Front Strategy:</h3>
        <ul>
          <li>After each access, move the accessed element to the front of the list</li>
          <li>Frequently accessed elements naturally migrate toward the front</li>
          <li>Worst-case search time: O(n), but average case improves with locality</li>
          <li>Competitive ratio: At most 2 times optimal offline algorithm</li>
          <li>No additional memory overhead - just reorganizes existing list</li>
          <li>Used in caching, data compression, and self-organizing data structures</li>
        </ul>
      </div>
    </div>
  );
};

export default MoveToFrontViz;