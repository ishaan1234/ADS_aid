import React, { useState, useEffect } from 'react';
import { FiRotateCw, FiCheck, FiX, FiSkipForward, FiFilter, FiBarChart2 } from 'react-icons/fi';
import { flashcardCategories, SpacedRepetition } from '../data/flashcardData';
import { motion, AnimatePresence } from 'framer-motion';
import './Flashcards.css';

const Flashcards = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [studyMode, setStudyMode] = useState('normal');
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0
  });

  const spacedRep = new SpacedRepetition();

  const getAllCards = () => {
    let cards = [];
    if (selectedCategory === 'all') {
      Object.values(flashcardCategories).forEach(category => {
        cards = [...cards, ...category.cards];
      });
    } else {
      cards = flashcardCategories[selectedCategory]?.cards || [];
    }

    if (selectedDifficulty !== 'all') {
      cards = cards.filter(card => card.difficulty === selectedDifficulty);
    }

    if (studyMode === 'spaced') {
      cards = spacedRep.getCardsDueForReview(cards);
    }

    return cards;
  };

  const cards = getAllCards();
  const currentCard = cards[currentCardIndex];

  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, selectedDifficulty, studyMode]);

  const handleNext = (response) => {
    if (response && studyMode === 'spaced') {
      spacedRep.getNextReviewTime(currentCard.id, response);
    }

    setSessionStats(prev => ({
      ...prev,
      reviewed: prev.reviewed + 1,
      [response === 'easy' || response === 'good' ? 'correct' :
       response === 'hard' || response === 'again' ? 'incorrect' : 'skipped']:
       prev[response === 'easy' || response === 'good' ? 'correct' :
           response === 'hard' || response === 'again' ? 'incorrect' : 'skipped'] + 1
    }));

    const activity = {
      icon: '📚',
      text: `Reviewed flashcard: ${currentCard.front.substring(0, 30)}...`,
      time: new Date().toLocaleTimeString()
    };
    const existing = JSON.parse(localStorage.getItem('recentActivity') || '[]');
    localStorage.setItem('recentActivity', JSON.stringify([activity, ...existing].slice(0, 20)));

    const stats = JSON.parse(localStorage.getItem('userStats') || '{}');
    stats.flashcardsReviewed = (stats.flashcardsReviewed || 0) + 1;
    localStorage.setItem('userStats', JSON.stringify(stats));

    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        setCurrentCardIndex(0);
      }
    }, 300);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const resetSession = () => {
    setSessionStats({
      reviewed: 0,
      correct: 0,
      incorrect: 0,
      skipped: 0
    });
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  if (cards.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="flashcards-header">
          <h1>Flashcards</h1>
          <div className="header-controls">
            <select
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.entries(flashcardCategories).map(([key, category]) => (
                <option key={key} value={key}>{category.name}</option>
              ))}
            </select>
            <select
              className="difficulty-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div className="no-cards">
          <p>No cards available for the selected filters.</p>
          <button className="btn btn-primary" onClick={resetSession}>
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h1>Flashcards</h1>
        <div className="header-controls">
          <div className="study-mode-toggle">
            <button
              className={`mode-btn ${studyMode === 'normal' ? 'active' : ''}`}
              onClick={() => setStudyMode('normal')}
            >
              Normal
            </button>
            <button
              className={`mode-btn ${studyMode === 'spaced' ? 'active' : ''}`}
              onClick={() => setStudyMode('spaced')}
            >
              Spaced Repetition
            </button>
          </div>
          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {Object.entries(flashcardCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          <select
            className="difficulty-select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button
            className="stats-toggle"
            onClick={() => setShowStats(!showStats)}
          >
            <FiBarChart2 />
          </button>
        </div>
      </div>

      {showStats && (
        <div className="session-stats">
          <div className="stat">
            <span className="stat-label">Reviewed</span>
            <span className="stat-value">{sessionStats.reviewed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Correct</span>
            <span className="stat-value correct">{sessionStats.correct}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Incorrect</span>
            <span className="stat-value incorrect">{sessionStats.incorrect}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Skipped</span>
            <span className="stat-value">{sessionStats.skipped}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Accuracy</span>
            <span className="stat-value">
              {sessionStats.reviewed > 0
                ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
                : 0}%
            </span>
          </div>
        </div>
      )}

      <div className="flashcard-area">
        <div className="card-counter">
          Card {currentCardIndex + 1} of {cards.length}
        </div>

        <AnimatePresence mode="wait">
          {currentCard && (
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <div className="card-difficulty">
                    <span className={`difficulty-badge ${currentCard.difficulty}`}>
                      {currentCard.difficulty}
                    </span>
                    {studyMode === 'spaced' && (
                      <span className="card-strength">
                        Strength: {Math.round(spacedRep.getCardStrength(currentCard.id))}%
                      </span>
                    )}
                  </div>
                  <div className="card-content">
                    <h3>{currentCard.front}</h3>
                  </div>
                  <div className="card-tags">
                    {currentCard.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="flip-hint">
                    <FiRotateCw /> Click to reveal answer
                  </div>
                </div>
                <div className="flashcard-back">
                  <div className="card-content">
                    <div className="answer-text"
                         dangerouslySetInnerHTML={{
                           __html: currentCard.back.replace(/\n/g, '<br/>')
                         }}
                    />
                  </div>
                  {studyMode === 'spaced' ? (
                    <div className="spaced-rep-buttons">
                      <button
                        className="rep-btn again"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('again');
                        }}
                      >
                        Again
                      </button>
                      <button
                        className="rep-btn hard"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('hard');
                        }}
                      >
                        Hard
                      </button>
                      <button
                        className="rep-btn good"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('good');
                        }}
                      >
                        Good
                      </button>
                      <button
                        className="rep-btn easy"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('easy');
                        }}
                      >
                        Easy
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="action-btn incorrect"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('incorrect');
                        }}
                      >
                        <FiX /> Incorrect
                      </button>
                      <button
                        className="action-btn skip"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('skip');
                        }}
                      >
                        <FiSkipForward /> Skip
                      </button>
                      <button
                        className="action-btn correct"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext('correct');
                        }}
                      >
                        <FiCheck /> Correct
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="progress-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;