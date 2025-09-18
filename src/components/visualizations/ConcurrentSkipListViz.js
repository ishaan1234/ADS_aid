import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const ConcurrentSkipListViz = () => {
  const [skipList, setSkipList] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState('insert');
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('Concurrent skip list allows multiple threads to operate safely');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);
  const [maxLevel, setMaxLevel] = useState(3);
  const [locks, setLocks] = useState(new Set());

  // Initialize skip list
  useEffect(() => {
    initializeSkipList();
  }, []);

  const initializeSkipList = () => {
    const head = {
      key: -Infinity,
      levels: Array(maxLevel + 1).fill(null).map(() => ({ next: null, locked: false })),
      isHead: true,
      id: 'head'
    };

    const tail = {
      key: Infinity,
      levels: Array(maxLevel + 1).fill(null).map(() => ({ next: null, locked: false })),
      isTail: true,
      id: 'tail'
    };

    // Connect head to tail at all levels
    for (let level = 0; level <= maxLevel; level++) {
      head.levels[level].next = tail;
    }

    // Add some initial nodes
    const initialNodes = [10, 20, 30, 50, 70];
    let currentList = { head, tail };

    initialNodes.forEach(value => {
      const height = Math.floor(Math.random() * maxLevel) + 1;
      const newNode = {
        key: value,
        levels: Array(height).fill(null).map(() => ({ next: null, locked: false })),
        id: `node-${value}`
      };

      // Insert at level 0
      let current = head;
      while (current.levels[0].next && current.levels[0].next.key < value) {
        current = current.levels[0].next;
      }

      for (let level = 0; level < height; level++) {
        if (level <= maxLevel) {
          // Find insertion point at this level
          let levelCurrent = head;
          while (levelCurrent.levels[level].next &&
                 levelCurrent.levels[level].next.key < value) {
            levelCurrent = levelCurrent.levels[level].next;
          }

          newNode.levels[level].next = levelCurrent.levels[level].next;
          levelCurrent.levels[level].next = newNode;
        }
      }
    });

    setSkipList(currentList);
  };

  // Simulate random height generation
  const generateRandomHeight = () => {
    let height = 1;
    while (Math.random() < 0.5 && height < maxLevel) {
      height++;
    }
    return height;
  };

  // Find operation with hand-over-hand locking
  const find = async (key) => {
    if (!skipList) return null;

    setMessage(`Thread ${currentThread?.id} searching for key ${key}`);
    const path = [];

    let pred = skipList.head;
    let curr = null;

    // Acquire lock on head
    setLocks(prev => new Set([...prev, pred.id]));
    path.push({ pred: pred.id, level: maxLevel });
    await new Promise(resolve => setTimeout(resolve, 500));

    for (let level = maxLevel; level >= 0; level--) {
      curr = pred.levels[level].next;

      while (curr && curr.key < key) {
        // Acquire lock on current node
        setLocks(prev => new Set([...prev, curr.id]));
        setHighlightedNodes([pred.id, curr.id]);
        await new Promise(resolve => setTimeout(resolve, 600));

        // Release lock on predecessor
        setLocks(prev => {
          const newLocks = new Set(prev);
          newLocks.delete(pred.id);
          return newLocks;
        });

        pred = curr;
        curr = pred.levels[level].next;
        path.push({ pred: pred.id, level });
      }

      if (level > 0 && curr) {
        // Acquire lock on current for next level
        setLocks(prev => new Set([...prev, curr.id]));
      }
    }

    // Found the position - curr should be the node we're looking for or the next larger
    const found = curr && curr.key === key;

    setMessage(`Search complete: key ${key} ${found ? 'found' : 'not found'}`);
    setHighlightedNodes(found ? [curr.id] : []);

    // Release remaining locks
    setTimeout(() => {
      setLocks(new Set());
      setHighlightedNodes([]);
    }, 1000);

    return { pred, curr, found };
  };

  // Insert operation
  const insert = async (key) => {
    if (!skipList) return;

    setIsAnimating(true);
    setCurrentThread({ id: 1, operation: 'insert', key });

    setMessage(`Thread 1 inserting key ${key}`);

    // Find insertion point
    const result = await find(key);
    if (result.found) {
      setMessage(`Key ${key} already exists`);
      setIsAnimating(false);
      return;
    }

    const height = generateRandomHeight();
    const newNode = {
      key: parseInt(key),
      levels: Array(height).fill(null).map(() => ({ next: null, locked: false })),
      id: `node-${key}`
    };

    setMessage(`Creating new node with height ${height}`);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Lock the predecessor and successor at each level
    const updates = [];
    let pred = skipList.head;

    for (let level = maxLevel; level >= 0; level--) {
      while (pred.levels[level].next && pred.levels[level].next.key < key) {
        pred = pred.levels[level].next;
      }
      if (level < height) {
        updates[level] = pred;
      }
    }

    // Acquire locks and insert
    for (let level = 0; level < height; level++) {
      setLocks(prev => new Set([...prev, updates[level].id]));
      setHighlightedNodes([updates[level].id, newNode.id]);

      newNode.levels[level].next = updates[level].levels[level].next;
      updates[level].levels[level].next = newNode;

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Update skip list
    setSkipList(prev => ({ ...prev }));

    setMessage(`Successfully inserted key ${key}`);
    setLocks(new Set());
    setHighlightedNodes([]);
    setCurrentThread(null);
    setIsAnimating(false);
  };

  // Delete operation
  const deleteKey = async (key) => {
    if (!skipList) return;

    setIsAnimating(true);
    setCurrentThread({ id: 2, operation: 'delete', key });

    const result = await find(key);
    if (!result.found) {
      setMessage(`Key ${key} not found`);
      setIsAnimating(false);
      return;
    }

    setMessage(`Deleting key ${key}`);

    // Find predecessors at each level
    const updates = [];
    let pred = skipList.head;

    for (let level = maxLevel; level >= 0; level--) {
      while (pred.levels[level].next && pred.levels[level].next.key < key) {
        pred = pred.levels[level].next;
      }
      updates[level] = pred;
    }

    const nodeToDelete = result.curr;

    // Remove node from each level
    for (let level = 0; level < nodeToDelete.levels.length; level++) {
      if (updates[level].levels[level].next === nodeToDelete) {
        setLocks(prev => new Set([...prev, updates[level].id]));
        setHighlightedNodes([updates[level].id, nodeToDelete.id]);

        updates[level].levels[level].next = nodeToDelete.levels[level].next;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setSkipList(prev => ({ ...prev }));
    setMessage(`Successfully deleted key ${key}`);
    setLocks(new Set());
    setHighlightedNodes([]);
    setCurrentThread(null);
    setIsAnimating(false);
  };

  // Start operation
  const startOperation = () => {
    if (!inputValue) return;

    if (operation === 'insert') {
      insert(inputValue);
    } else if (operation === 'delete') {
      deleteKey(inputValue);
    } else if (operation === 'find') {
      setIsAnimating(true);
      setCurrentThread({ id: 3, operation: 'find', key: inputValue });
      find(parseInt(inputValue)).then(() => {
        setCurrentThread(null);
        setIsAnimating(false);
      });
    }

    setInputValue('');
  };

  // Reset skip list
  const resetSkipList = () => {
    setLocks(new Set());
    setHighlightedNodes([]);
    setCurrentThread(null);
    initializeSkipList();
    setMessage('Skip list reset');
  };

  // Render skip list
  const renderSkipList = () => {
    if (!skipList) return null;

    const levels = [];

    for (let level = maxLevel; level >= 0; level--) {
      const levelNodes = [];
      let current = skipList.head;

      while (current) {
        if (current.levels[level]) {
          const isHighlighted = highlightedNodes.includes(current.id);
          const isLocked = locks.has(current.id);

          levelNodes.push(
            <div key={`${current.id}-${level}`} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor:
                    isHighlighted ? '#fbbf24' :
                    isLocked ? '#ef4444' :
                    current.isHead ? '#10b981' :
                    current.isTail ? '#6b7280' : '#3b82f6',
                  color: 'white',
                  borderRadius: '4px',
                  border: '2px solid #374151',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  position: 'relative'
                }}
              >
                {current.isHead ? 'HEAD' :
                 current.isTail ? 'TAIL' : current.key}

                {isLocked && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#dc2626',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    🔒
                  </div>
                )}
              </div>

              {current.levels[level].next && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor: '#6b7280',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    top: '-4px',
                    width: '0',
                    height: '0',
                    borderLeft: '8px solid #6b7280',
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent'
                  }} />
                </div>
              )}
            </div>
          );

          current = current.levels[level].next;
        } else {
          break;
        }
      }

      levels.push(
        <div key={level} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{
            width: '60px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginRight: '8px'
          }}>
            Level {level}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {levelNodes}
          </div>
        </div>
      );
    }

    return levels;
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Concurrent Skip List</h2>
        <p>Demonstrates thread-safe skip list operations using hand-over-hand locking for concurrent access.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Operation</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            disabled={isAnimating}
          >
            <option value="insert">Insert</option>
            <option value="delete">Delete</option>
            <option value="find">Find</option>
          </select>
        </div>

        <div className="control-group">
          <label>Key</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAnimating}
            placeholder="Enter key"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={startOperation}
          disabled={isAnimating || !inputValue}
        >
          Execute
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetSkipList}
          disabled={isAnimating}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        {currentThread && (
          <div className="section">
            <h3>Active Thread</h3>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                T{currentThread.id}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Thread {currentThread.id}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Operation: {currentThread.operation} | Key: {currentThread.key}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="section">
          <h3>Skip List Structure</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '20px',
            overflowX: 'auto',
            minHeight: '300px'
          }}>
            {renderSkipList()}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#10b981' }}>■ Head</span>
            {' | '}
            <span style={{ color: '#6b7280' }}>■ Tail</span>
            {' | '}
            <span style={{ color: '#3b82f6' }}>■ Node</span>
            {' | '}
            <span style={{ color: '#fbbf24' }}>■ Highlighted</span>
            {' | '}
            <span style={{ color: '#ef4444' }}>■ Locked</span>
          </div>
        </div>

        <div className="section">
          <h3>Concurrency Control</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <h4 style={{ marginBottom: '12px', fontSize: '16px' }}>Hand-over-Hand Locking Protocol</h4>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <li>Start by locking the head node</li>
              <li>At each level, traverse while curr.key &lt; search_key</li>
              <li>Before moving to next node, acquire its lock</li>
              <li>Release the lock on the previous node</li>
              <li>Maintain locks on at most two nodes at a time</li>
              <li>For modifications, lock all affected predecessors</li>
            </ol>
          </div>
        </div>

        <div className="section">
          <h3>Lock Status</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Currently Locked Nodes:</span>
              <span className="metric-value">
                {locks.size === 0 ? 'None' : Array.from(locks).join(', ')}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Active Threads:</span>
              <span className="metric-value">{currentThread ? 1 : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Max Levels:</span>
              <span className="metric-value">{maxLevel + 1}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Thread Safety:</span>
              <span className="metric-value">Lock-based</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Concurrent Operations</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '14px' }}>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Insert</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Search for insertion point</li>
                  <li>Generate random height</li>
                  <li>Lock predecessors at all levels</li>
                  <li>Insert and release locks</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Delete</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Search for node to delete</li>
                  <li>Lock node and predecessors</li>
                  <li>Update pointers at all levels</li>
                  <li>Release locks and free node</li>
                </ul>
              </div>
              <div>
                <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Find</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: 'var(--text-secondary)' }}>
                  <li>Use hand-over-hand locking</li>
                  <li>Traverse from top to bottom</li>
                  <li>No structural modifications</li>
                  <li>Release all locks when done</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Concurrent Skip List Properties:</h3>
        <ul>
          <li>Probabilistic data structure allowing O(log n) search with high probability</li>
          <li>Hand-over-hand locking enables multiple threads to operate concurrently</li>
          <li>Lock-free alternatives exist but are more complex to implement</li>
          <li>Each thread holds at most a constant number of locks</li>
          <li>Deadlock-free due to consistent lock ordering (left to right)</li>
          <li>Used in concurrent databases and parallel computing systems</li>
        </ul>
      </div>
    </div>
  );
};

export default ConcurrentSkipListViz;