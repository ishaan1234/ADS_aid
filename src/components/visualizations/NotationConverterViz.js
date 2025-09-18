import React, { useState, useEffect } from 'react';
import './VisualizationBase.css';

const NotationConverterViz = () => {
  const [inputExpression, setInputExpression] = useState('A + B * C');
  const [inputNotation, setInputNotation] = useState('infix');
  const [conversions, setConversions] = useState({
    infix: '',
    prefix: '',
    postfix: ''
  });
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSteps, setConversionSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('Enter an expression to convert between notations');
  const [highlightedToken, setHighlightedToken] = useState(-1);

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
      if (['+', '-', '*', '/', '^', '(', ')'].includes(char)) {
        tokens.push({ type: 'operator', value: char });
      } else if (/[A-Za-z0-9]/.test(char)) {
        let operand = '';
        while (i < expr.length && /[A-Za-z0-9.]/.test(expr[i])) {
          operand += expr[i];
          i++;
        }
        tokens.push({ type: 'operand', value: operand });
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
      case '^':
        return 3;
      default:
        return 0;
    }
  };

  // Check if operator is right associative
  const isRightAssociative = (op) => {
    return op === '^';
  };

  // Infix to Postfix (Shunting Yard Algorithm)
  const infixToPostfix = async (tokens) => {
    const output = [];
    const operators = [];
    const steps = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      setHighlightedToken(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (token.type === 'operand') {
        output.push(token);
        steps.push({
          step: i + 1,
          action: `Add operand '${token.value}' to output`,
          output: output.map(t => t.value).join(' '),
          stack: operators.map(t => t.value).join(' ')
        });
      } else if (token.value === '(') {
        operators.push(token);
        steps.push({
          step: i + 1,
          action: `Push '(' to operator stack`,
          output: output.map(t => t.value).join(' '),
          stack: operators.map(t => t.value).join(' ')
        });
      } else if (token.value === ')') {
        while (operators.length > 0 && operators[operators.length - 1].value !== '(') {
          const op = operators.pop();
          output.push(op);
        }
        operators.pop(); // Remove '('
        steps.push({
          step: i + 1,
          action: `Pop operators until '(' and add to output`,
          output: output.map(t => t.value).join(' '),
          stack: operators.map(t => t.value).join(' ')
        });
      } else {
        while (
          operators.length > 0 &&
          operators[operators.length - 1].value !== '(' &&
          (getPrecedence(operators[operators.length - 1].value) > getPrecedence(token.value) ||
           (getPrecedence(operators[operators.length - 1].value) === getPrecedence(token.value) &&
            !isRightAssociative(token.value)))
        ) {
          const op = operators.pop();
          output.push(op);
        }
        operators.push(token);
        steps.push({
          step: i + 1,
          action: `Process operator '${token.value}'`,
          output: output.map(t => t.value).join(' '),
          stack: operators.map(t => t.value).join(' ')
        });
      }

      setConversionSteps([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    while (operators.length > 0) {
      const op = operators.pop();
      output.push(op);
      steps.push({
        step: tokens.length + 1,
        action: `Pop remaining operator '${op.value}'`,
        output: output.map(t => t.value).join(' '),
        stack: operators.map(t => t.value).join(' ')
      });
      setConversionSteps([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return output.map(t => t.value).join(' ');
  };

  // Infix to Prefix
  const infixToPrefix = async (tokens) => {
    // Reverse the expression and convert to postfix, then reverse result
    const reversedTokens = [...tokens].reverse();

    // Swap parentheses
    const swappedTokens = reversedTokens.map(token => {
      if (token.value === '(') return { ...token, value: ')' };
      if (token.value === ')') return { ...token, value: '(' };
      return token;
    });

    const postfix = await infixToPostfix(swappedTokens);
    return postfix.split(' ').reverse().join(' ');
  };

  // Postfix to Infix
  const postfixToInfix = async (tokens) => {
    const stack = [];
    const steps = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      setHighlightedToken(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (token.type === 'operand') {
        stack.push(token.value);
        steps.push({
          step: i + 1,
          action: `Push operand '${token.value}' to stack`,
          stack: stack.join(', ')
        });
      } else {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        const result = `(${operand1} ${token.value} ${operand2})`;
        stack.push(result);
        steps.push({
          step: i + 1,
          action: `Pop ${operand1}, ${operand2} and create (${operand1} ${token.value} ${operand2})`,
          stack: stack.join(', ')
        });
      }

      setConversionSteps([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return stack[0];
  };

  // Prefix to Infix
  const prefixToInfix = async (tokens) => {
    const stack = [];
    const steps = [];

    // Process from right to left
    for (let i = tokens.length - 1; i >= 0; i--) {
      const token = tokens[i];
      setHighlightedToken(i);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (token.type === 'operand') {
        stack.push(token.value);
        steps.push({
          step: tokens.length - i,
          action: `Push operand '${token.value}' to stack`,
          stack: stack.join(', ')
        });
      } else {
        const operand1 = stack.pop();
        const operand2 = stack.pop();
        const result = `(${operand1} ${token.value} ${operand2})`;
        stack.push(result);
        steps.push({
          step: tokens.length - i,
          action: `Pop ${operand1}, ${operand2} and create (${operand1} ${token.value} ${operand2})`,
          stack: stack.join(', ')
        });
      }

      setConversionSteps([...steps]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return stack[0];
  };

  // Convert between notations
  const convertNotation = async () => {
    setIsConverting(true);
    setConversionSteps([]);
    setCurrentStep(0);
    setHighlightedToken(-1);

    const tokens = tokenize(inputExpression.trim());

    try {
      let infix = '', prefix = '', postfix = '';

      if (inputNotation === 'infix') {
        infix = inputExpression;
        setMessage('Converting infix to postfix...');
        postfix = await infixToPostfix([...tokens]);
        setMessage('Converting infix to prefix...');
        setConversionSteps([]);
        prefix = await infixToPrefix([...tokens]);
      } else if (inputNotation === 'postfix') {
        postfix = inputExpression;
        setMessage('Converting postfix to infix...');
        infix = await postfixToInfix([...tokens]);
        setMessage('Converting infix to prefix...');
        setConversionSteps([]);
        const infixTokens = tokenize(infix);
        prefix = await infixToPrefix(infixTokens);
      } else if (inputNotation === 'prefix') {
        prefix = inputExpression;
        setMessage('Converting prefix to infix...');
        infix = await prefixToInfix([...tokens]);
        setMessage('Converting infix to postfix...');
        setConversionSteps([]);
        const infixTokens = tokenize(infix);
        postfix = await infixToPostfix(infixTokens);
      }

      setConversions({ infix, prefix, postfix });
      setMessage('Conversion complete!');
    } catch (error) {
      setMessage('Error: Invalid expression format');
    }

    setHighlightedToken(-1);
    setIsConverting(false);
  };

  // Reset
  const resetConverter = () => {
    setConversions({ infix: '', prefix: '', postfix: '' });
    setConversionSteps([]);
    setCurrentStep(0);
    setHighlightedToken(-1);
    setMessage('Enter an expression to convert between notations');
  };

  const sampleExpressions = {
    infix: ['A + B * C', '(A + B) * C', 'A + B - C', 'A * B + C * D', '(A + B) * (C - D)'],
    postfix: ['A B C * +', 'A B + C *', 'A B + C -', 'A B * C D * +', 'A B + C D - *'],
    prefix: ['+ A * B C', '* + A B C', '- + A B C', '+ * A B * C D', '* + A B - C D']
  };

  return (
    <div className="visualization-base">
      <div className="viz-header">
        <h2>Notation Converter (Infix/Prefix/Postfix)</h2>
        <p>Convert mathematical expressions between infix, prefix, and postfix notations with step-by-step visualization.</p>
      </div>

      <div className="viz-controls">
        <div className="control-group">
          <label>Input Notation</label>
          <select
            value={inputNotation}
            onChange={(e) => setInputNotation(e.target.value)}
            disabled={isConverting}
          >
            <option value="infix">Infix</option>
            <option value="prefix">Prefix</option>
            <option value="postfix">Postfix</option>
          </select>
        </div>

        <div className="control-group">
          <label>Expression</label>
          <input
            type="text"
            value={inputExpression}
            onChange={(e) => setInputExpression(e.target.value)}
            disabled={isConverting}
            placeholder="Enter expression"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={convertNotation}
          disabled={isConverting || !inputExpression.trim()}
        >
          Convert
        </button>

        <button
          className="btn btn-secondary"
          onClick={resetConverter}
          disabled={isConverting}
        >
          Reset
        </button>
      </div>

      <div className="viz-message">{message}</div>

      <div className="viz-display">
        <div className="section">
          <h3>Input Expression</h3>
          <div className="value-list">
            {tokenize(inputExpression).map((token, index) => (
              <div
                key={index}
                className={`value-item ${
                  index === highlightedToken ? 'highlight' :
                  token.type === 'operator' ? 'sorted' : ''
                }`}
              >
                {token.value}
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>Converted Notations</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Infix</h4>
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius)',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {conversions.infix || 'Not converted yet'}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Prefix</h4>
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius)',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {conversions.prefix || 'Not converted yet'}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Postfix</h4>
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius)',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '14px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {conversions.postfix || 'Not converted yet'}
              </div>
            </div>
          </div>
        </div>

        {conversionSteps.length > 0 && (
          <div className="section">
            <h3>Conversion Steps</h3>
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: '12px'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px'
              }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Step</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Output/Stack</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid var(--border)' }}>Operator Stack</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionSteps.map((step, index) => (
                    <tr key={index}>
                      <td style={{ padding: '6px', borderBottom: '1px solid var(--border)' }}>{step.step}</td>
                      <td style={{ padding: '6px', borderBottom: '1px solid var(--border)' }}>{step.action}</td>
                      <td style={{ padding: '6px', borderBottom: '1px solid var(--border)', fontFamily: 'monospace' }}>
                        {step.output || step.stack || '-'}
                      </td>
                      <td style={{ padding: '6px', borderBottom: '1px solid var(--border)', fontFamily: 'monospace' }}>
                        {step.stack && step.output ? step.stack : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="section">
          <h3>Sample Expressions</h3>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '16px'
          }}>
            <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>Click to try:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <h5 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Infix Examples</h5>
                {sampleExpressions.infix.map((expr, index) => (
                  <button
                    key={index}
                    className="btn btn-secondary"
                    onClick={() => {
                      setInputExpression(expr);
                      setInputNotation('infix');
                    }}
                    disabled={isConverting}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      margin: '2px',
                      fontFamily: 'monospace',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    {expr}
                  </button>
                ))}
              </div>

              <div>
                <h5 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Prefix Examples</h5>
                {sampleExpressions.prefix.map((expr, index) => (
                  <button
                    key={index}
                    className="btn btn-secondary"
                    onClick={() => {
                      setInputExpression(expr);
                      setInputNotation('prefix');
                    }}
                    disabled={isConverting}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      margin: '2px',
                      fontFamily: 'monospace',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    {expr}
                  </button>
                ))}
              </div>

              <div>
                <h5 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Postfix Examples</h5>
                {sampleExpressions.postfix.map((expr, index) => (
                  <button
                    key={index}
                    className="btn btn-secondary"
                    onClick={() => {
                      setInputExpression(expr);
                      setInputNotation('postfix');
                    }}
                    disabled={isConverting}
                    style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      margin: '2px',
                      fontFamily: 'monospace',
                      display: 'block',
                      width: '100%'
                    }}
                  >
                    {expr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viz-info">
        <h3>Notation Properties:</h3>
        <ul>
          <li><strong>Infix:</strong> Operator between operands (A + B), requires precedence rules and parentheses</li>
          <li><strong>Prefix:</strong> Operator before operands (+ A B), no parentheses needed, evaluated right-to-left</li>
          <li><strong>Postfix:</strong> Operator after operands (A B +), no parentheses needed, evaluated left-to-right</li>
          <li>Postfix and prefix eliminate the need for precedence rules and parentheses</li>
          <li>Stack-based algorithms are used for evaluation and conversion</li>
          <li>Reverse Polish Notation (RPN) is another name for postfix notation</li>
        </ul>
      </div>
    </div>
  );
};

export default NotationConverterViz;