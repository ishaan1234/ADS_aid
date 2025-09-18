import React, { useState } from 'react';
import { FiCheck, FiX, FiHelpCircle } from 'react-icons/fi';
import { practiceProblemsData } from '../data/practiceProblemsData';
import './PracticeProblems.css';

const problemsData = practiceProblemsData;

const PracticeProblems = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, total: 0 });

  const getFilteredProblems = () => {
    let filtered = [...problemsData];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    return filtered;
  };

  const problems = getFilteredProblems();
  const currentProblem = problems[currentProblemIndex];

  const handleAnswerSelect = (index) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && !showResult) {
      setShowResult(true);
      const isCorrect = selectedAnswer === currentProblem.correct;

      setScore(prev => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        total: prev.total + 1
      }));

      const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
      stats.problemsSolved = (stats.problemsSolved || 0) + 1;
      localStorage.setItem('userStats', JSON.stringify(stats));
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowResult(false);

    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      setCurrentProblemIndex(0);
    }
  };

  if (problems.length === 0) {
    return (
      <div className="practice-container">
        <h1>Practice Problems</h1>
        <p>No problems available for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="practice-container">
      <div className="practice-header">
        <h1>Practice Problems</h1>
        <div className="practice-filters">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentProblemIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
          >
            <option value="all">All Categories</option>
            <option value="Amortized Analysis">Amortized Analysis</option>
            <option value="Interval Heaps">Interval Heaps</option>
            <option value="Leftist Trees">Leftist Trees</option>
            <option value="Binomial Heaps">Binomial Heaps</option>
            <option value="External Sorting">External Sorting</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              setCurrentProblemIndex(0);
              setSelectedAnswer(null);
              setShowResult(false);
            }}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="practice-stats">
        <div className="stat">
          <span className="stat-label">Correct</span>
          <span className="stat-value correct">{score.correct}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Incorrect</span>
          <span className="stat-value incorrect">{score.incorrect}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">
            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          </span>
        </div>
      </div>

      {currentProblem && (
        <div className="problem-card">
          <div className="problem-header">
            <span className="problem-category">{currentProblem.category}</span>
            <span className={`problem-difficulty ${currentProblem.difficulty}`}>
              {currentProblem.difficulty}
            </span>
          </div>

          <div className="problem-progress">
            Problem {currentProblemIndex + 1} of {problems.length}
          </div>

          <h2 className="problem-title">{currentProblem.title}</h2>
          <p className="problem-question">{currentProblem.question}</p>

          <div className="problem-options">
            {currentProblem.options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedAnswer === index ? 'selected' : ''
                } ${
                  showResult && index === currentProblem.correct ? 'correct' : ''
                } ${
                  showResult && selectedAnswer === index && index !== currentProblem.correct ? 'incorrect' : ''
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span className="option-text">{option}</span>
                {showResult && index === currentProblem.correct && <FiCheck className="result-icon" />}
                {showResult && selectedAnswer === index && index !== currentProblem.correct && <FiX className="result-icon" />}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="explanation">
              <h3><FiHelpCircle /> Explanation</h3>
              <p>{currentProblem.explanation}</p>
            </div>
          )}

          <div className="problem-actions">
            {!showResult ? (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next Problem
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeProblems;