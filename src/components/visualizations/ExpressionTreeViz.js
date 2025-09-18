import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const ExpressionTreeViz = () => {
  const [expression, setExpression] = useState('(3+4)*(5-2)');
  const [tree, setTree] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('Enter an expression to build its tree representation');
  const [evaluation, setEvaluation] = useState(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [highlightedNode, setHighlightedNode] = useState(null);

  // Tokenize expression
  const tokenize = (expr) => {
    const tokens = [];
    let i = 0;
    while (i < expr.length) {
      const char = expr[i];
      if (char === ' ') {
        i++;
        continue;
      }
      if (['+', '-', '*', '/', '(', ')'].includes(char)) {
        tokens.push({ type: 'operator', value: char });
      } else if (/\d/.test(char)) {
        let num = '';
        while (i < expr.length && /[\d.]/.test(expr[i])) {
          num += expr[i];
          i++;
        }
        tokens.push({ type: 'number', value: parseFloat(num) });
        continue;
      }
      i++;
    }
    return tokens;
  };

  // Get operator precedence
  const getPrecedence = (op) => {
    switch (op) {
      case '+':
      case '-':
        return 1;
      case '*':
      case '/':
        return 2;
      default:
        return 0;
    }
  };

  // Check if operator is left associative
  const isLeftAssociative = (op) => {
    return ['+', '-', '*', '/'].includes(op);
  };

  // Convert to postfix using Shunting Yard algorithm
  const toPostfix = (tokens) => {
    const output = [];
    const operators = [];

    for (const token of tokens) {
      if (token.type === 'number') {
        output.push(token);
      } else if (token.value === '(') {
        operators.push(token);
      } else if (token.value === ')') {
        while (operators.length > 0 && operators[operators.length - 1].value !== '(') {
          output.push(operators.pop());
        }
        operators.pop(); // Remove '('
      } else if (token.type === 'operator') {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].value !== '(' &&
          (getPrecedence(operators[operators.length - 1].value) > getPrecedence(token.value) ||
           (getPrecedence(operators[operators.length - 1].value) === getPrecedence(token.value) &&
            isLeftAssociative(token.value)))
        ) {
          output.push(operators.pop());
        }
        operators.push(token);
      }
    }

    while (operators.length > 0) {
      output.push(operators.pop());
    }

    return output;
  };

  // Build expression tree from postfix
  const buildTreeFromPostfix = (postfixTokens) => {
    const stack = [];

    for (const token of postfixTokens) {
      const node = {
        id: nodeIdCounter,
        value: token.value,
        type: token.type,
        left: null,
        right: null
      };
      setNodeIdCounter(prev => prev + 1);

      if (token.type === 'number') {
        stack.push(node);
      } else {
        const right = stack.pop();
        const left = stack.pop();
        node.left = left;
        node.right = right;
        stack.push(node);
      }
    }

    return stack[0];
  };

  // Build tree step by step
  const buildTreeAnimated = async () => {
    setIsBuilding(true);
    setCurrentStep(0);
    setTree(null);
    setEvaluation(null);
    setNodeIdCounter(0);

    const tokenList = tokenize(expression);
    setTokens(tokenList);
    setMessage('Tokenized expression. Converting to postfix notation...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const postfixTokens = toPostfix(tokenList);
    setMessage(`Postfix: ${postfixTokens.map(t => t.value).join(' ')}`);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setMessage('Building tree from postfix expression...');
    const stack = [];

    for (let i = 0; i < postfixTokens.length; i++) {
      setCurrentStep(i + 1);
      const token = postfixTokens[i];

      const node = {
        id: nodeIdCounter,
        value: token.value,
        type: token.type,
        left: null,
        right: null
      };
      setNodeIdCounter(prev => prev + 1);

      if (token.type === 'number') {
        stack.push(node);
        setMessage(`Push operand ${token.value} onto stack`);
      } else {
        const right = stack.pop();
        const left = stack.pop();
        node.left = left;
        node.right = right;
        stack.push(node);
        setMessage(`Create operator node ${token.value} with children ${left?.value} and ${right?.value}`);
      }

      // Show current tree (top of stack)
      setTree(stack[stack.length - 1]);
      await new Promise(resolve => setTimeout(resolve, 1200));
    }

    const finalTree = stack[0];
    setTree(finalTree);
    setMessage('Expression tree built successfully! Click "Evaluate" to compute the result.');
    setIsBuilding(false);
  };

  // Evaluate tree
  const evaluateTree = async (node = tree) => {
    if (!node) return 0;

    setHighlightedNode(node.id);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (node.type === 'number') {
      setMessage(`Evaluating leaf node: ${node.value}`);
      setHighlightedNode(null);
      return node.value;
    }

    setMessage(`Evaluating operator: ${node.value}`);

    const leftVal = await evaluateTree(node.left);
    const rightVal = await evaluateTree(node.right);

    setHighlightedNode(node.id);
    let result;
    switch (node.value) {
      case '+':
        result = leftVal + rightVal;
        break;
      case '-':
        result = leftVal - rightVal;
        break;
      case '*':
        result = leftVal * rightVal;
        break;
      case '/':
        result = rightVal !== 0 ? leftVal / rightVal : 0;
        break;
      default:
        result = 0;
    }

    setMessage(`${leftVal} ${node.value} ${rightVal} = ${result}`);
    await new Promise(resolve => setTimeout(resolve, 800));

    setHighlightedNode(null);
    return result;
  };

  // Start evaluation
  const startEvaluation = async () => {
    if (!tree) return;

    setIsBuilding(true);
    setMessage('Starting tree evaluation...');
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await evaluateTree();
    setEvaluation(result);
    setMessage(`Final result: ${result}`);
    setIsBuilding(false);
  };

  // Reset
  const resetTree = () => {
    setTree(null);
    setTokens([]);
    setCurrentStep(0);
    setEvaluation(null);
    setHighlightedNode(null);
    setNodeIdCounter(0);
    setMessage('Enter an expression to build its tree representation');
  };

  // Render tree node
  const renderNode = (node, x, y, spacing) => {
    if (!node) return null;

    const nodeRadius = 25;
    const isHighlighted = highlightedNode === node.id;
    const isOperator = node.type === 'operator';

    return (
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isHighlighted ? '#fbbf24' : isOperator ? '#ef4444' : '#10b981'}
          stroke="#374151"
          strokeWidth="2"
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fontSize="14"
          fill="white"
          fontWeight="bold"
        >
          {node.value}
        </text>

        {/* Left child */}
        {node.left && (
          <>
            <line
              x1={x - 15}
              y1={y + 20}
              x2={x - spacing}
              y2={y + 70}
              stroke="#6b7280"
              strokeWidth="2"
            />
            {renderNode(node.left, x - spacing, y + 80, spacing * 0.6)}
          </>
        )}

        {/* Right child */}
        {node.right && (
          <>
            <line
              x1={x + 15}
              y1={y + 20}
              x2={x + spacing}
              y2={y + 70}
              stroke="#6b7280"
              strokeWidth="2"
            />
            {renderNode(node.right, x + spacing, y + 80, spacing * 0.6)}
          </>
        )}
      </g>
    );
  };

  // Count nodes
  const countNodes = (node) => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };

  // Get tree height
  const getHeight = (node) => {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Expression Tree Builder</h2>
        <p>Build and evaluate expression trees from mathematical expressions using postfix conversion.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Mathematical Expression</label>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            disabled={isBuilding}
            placeholder="e.g., (3+4)*(5-2)"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={buildTreeAnimated}
          disabled={isBuilding || !expression}
        >
          Build Tree
        </button>

        <button
          className="btn btn-secondary"
          onClick={startEvaluation}
          disabled={isBuilding || !tree}
        >
          Evaluate Tree
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetTree}
          disabled={isBuilding}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        {tokens.length > 0 && (
          <div className="section">
            <h3>Tokenization</h3>
            <div className="value-list">
              {tokens.map((token, index) => (
                <div
                  key={index}
                  className={`value-item ${token.type === 'operator' ? 'highlight' : ''}`}
                >
                  {token.value}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section">
          <h3>Expression Tree</h3>
          <div style={{
            width: '100%',
            height: '400px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--bg-secondary)',
            overflow: 'auto',
            position: 'relative'
          }}>
            {tree ? (
              <svg width="600" height="350">
                {renderNode(tree, 300, 50, 100)}
              </svg>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'var(--text-secondary)',
                fontStyle: 'italic'
              }}>
                No tree built yet
              </div>
            )}
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#ef4444' }}>■ Operators</span>
            {' | '}
            <span style={{ color: '#10b981' }}>■ Operands</span>
            {' | '}
            <span style={{ color: '#fbbf24' }}>■ Current Evaluation</span>
          </div>
        </div>

        <div className="section">
          <h3>Tree Properties</h3>
          <div className="performance-display">
            <div className="metric">
              <span className="metric-label">Total Nodes:</span>
              <span className="metric-value">{tree ? countNodes(tree) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Tree Height:</span>
              <span className="metric-value">{tree ? getHeight(tree) : 0}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Build Steps:</span>
              <span className="metric-value">{currentStep}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Evaluation Result:</span>
              <span className="metric-value">{evaluation !== null ? evaluation : 'Not evaluated'}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Sample Expressions</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '12px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            {[
              '3 + 4 * 2',
              '(3 + 4) * 2',
              '2 * 3 + 4 * 5',
              '((2 + 3) * 4) - 1',
              '15 / (3 + 2) * 2',
              '(8 - 3) * (6 + 4) / 2'
            ].map((expr, index) => (
              <button
                key={index}
                className="btn btn-secondary"
                onClick={() => !isBuilding && setExpression(expr)}
                disabled={isBuilding}
                style={{
                  fontSize: '12px',
                  padding: '8px',
                  textAlign: 'left',
                  fontFamily: 'monospace'
                }}
              >
                {expr}
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Algorithm Steps</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px',
            fontSize: '14px'
          }}>
            <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              <li><strong>Tokenization:</strong> Break expression into operators and operands</li>
              <li><strong>Infix to Postfix:</strong> Use Shunting Yard algorithm to convert</li>
              <li><strong>Tree Construction:</strong> Build tree from postfix using stack</li>
              <li><strong>Evaluation:</strong> Recursively evaluate from leaves to root</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Expression Tree Properties:</h3>
        <ul>
          <li>Binary tree where leaves are operands and internal nodes are operators</li>
          <li>In-order traversal gives original infix expression (with parentheses)</li>
          <li>Post-order traversal gives postfix (RPN) expression</li>
          <li>Pre-order traversal gives prefix expression</li>
          <li>Evaluation follows post-order traversal pattern</li>
          <li>Used in compilers for expression parsing and optimization</li>
        </ul>
      </div>
    </div>
  );
};

export default ExpressionTreeViz;