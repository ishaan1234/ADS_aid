import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiCircle, FiLock, FiUnlock, FiClock, FiTrendingUp, FiBook } from 'react-icons/fi';
import { studyOrder, getModuleForTopic, checkPrerequisites, getStudyProgress, getRemainingStudyTime } from '../data/studyOrder';
import './StudyGuide.css';

const StudyGuide = () => {
  const [selectedPath, setSelectedPath] = useState('comprehensive');
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedModules, setExpandedModules] = useState([1, 2, 3]); // Show first 3 modules expanded

  useEffect(() => {
    // Load completed topics from localStorage
    const saved = JSON.parse(localStorage.getItem('completedTopics') || '[]');
    setCompletedTopics(saved);
  }, []);

  const handleTopicToggle = (topicKey) => {
    const newCompleted = completedTopics.includes(topicKey)
      ? completedTopics.filter(t => t !== topicKey)
      : [...completedTopics, topicKey];

    setCompletedTopics(newCompleted);
    localStorage.setItem('completedTopics', JSON.stringify(newCompleted));
  };

  const toggleModule = (moduleNumber) => {
    setExpandedModules(prev =>
      prev.includes(moduleNumber)
        ? prev.filter(m => m !== moduleNumber)
        : [...prev, moduleNumber]
    );
  };

  const progress = getStudyProgress(completedTopics, selectedPath);
  const remainingTime = getRemainingStudyTime(completedTopics);

  const getTopicStatus = (topicKey) => {
    if (completedTopics.includes(topicKey)) return 'completed';
    if (checkPrerequisites(topicKey, completedTopics)) return 'available';
    return 'locked';
  };

  return (
    <div className="study-guide">
      <div className="study-header">
        <h1>📚 Study Guide</h1>
        <p className="subtitle">Follow the recommended learning path for optimal understanding</p>
      </div>

      <div className="study-stats">
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <h3>Progress</h3>
            <p className="stat-value">{progress.percentage}%</p>
            <p className="stat-label">{progress.completed}/{progress.total} topics</p>
          </div>
        </div>

        <div className="stat-card">
          <FiClock className="stat-icon" />
          <div className="stat-content">
            <h3>Time Remaining</h3>
            <p className="stat-value">{remainingTime.formatted}</p>
            <p className="stat-label">Estimated study time</p>
          </div>
        </div>

        <div className="stat-card">
          <FiBook className="stat-icon" />
          <div className="stat-content">
            <h3>Next Topic</h3>
            <p className="stat-value">{progress.nextTopic || 'Complete!'}</p>
            <p className="stat-label">Recommended next</p>
          </div>
        </div>
      </div>

      <div className="path-selector">
        <h2>Select Study Path</h2>
        <div className="path-options">
          {Object.entries(studyOrder.studyPaths).map(([key, path]) => (
            <button
              key={key}
              className={`path-option ${selectedPath === key ? 'active' : ''}`}
              onClick={() => setSelectedPath(key)}
            >
              <h3>{path.name}</h3>
              <p>{path.description}</p>
              <span className="topic-count">{path.sequence.length} topics</span>
            </button>
          ))}
        </div>
      </div>

      <div className="modules-section">
        <h2>Course Modules</h2>
        <div className="modules-list">
          {studyOrder.modules.filter(m => m.topics.length > 0).map(module => {
            const moduleProgress = module.topics.filter(t => completedTopics.includes(t)).length;
            const isExpanded = expandedModules.includes(module.moduleNumber);

            return (
              <div key={module.moduleNumber} className="module-card">
                <div
                  className="module-header"
                  onClick={() => toggleModule(module.moduleNumber)}
                >
                  <div className="module-info">
                    <span className="module-number">Module {module.moduleNumber}</span>
                    <h3>{module.title}</h3>
                    <p>{module.description}</p>
                  </div>
                  <div className="module-stats">
                    <div className="progress-indicator">
                      {moduleProgress}/{module.topics.length}
                    </div>
                    <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="module-topics">
                    {module.topics.map(topicKey => {
                      const status = getTopicStatus(topicKey);
                      const topic = require('../data/learnContent').learnContent[topicKey];
                      const weightage = studyOrder.examWeightage[topicKey];
                      const time = studyOrder.masteryTime[topicKey];

                      return (
                        <div key={topicKey} className={`topic-item ${status}`}>
                          <div className="topic-checkbox">
                            <button
                              onClick={() => handleTopicToggle(topicKey)}
                              disabled={status === 'locked'}
                            >
                              {status === 'completed' ? <FiCheckCircle /> :
                               status === 'locked' ? <FiLock /> : <FiCircle />}
                            </button>
                          </div>

                          <div className="topic-details">
                            <div className="topic-header">
                              <Link
                                to={`/learn#${topicKey}`}
                                className={status === 'locked' ? 'disabled-link' : ''}
                              >
                                <h4>{topic?.title || topicKey}</h4>
                              </Link>
                              <div className="topic-badges">
                                <span className="level-badge">{topic?.level}</span>
                                {weightage >= 10 && <span className="priority-badge">High Priority</span>}
                              </div>
                            </div>

                            <div className="topic-meta">
                              <span className="time-estimate">
                                <FiClock /> {time?.formatted || `${topic?.readingTime}`}
                              </span>
                              <span className="exam-weight">
                                Exam weight: {weightage}%
                              </span>
                            </div>

                            {status === 'locked' && (
                              <div className="prereq-notice">
                                <FiLock /> Complete prerequisites: {
                                  (studyOrder.dependencies[topicKey] || []).join(', ')
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="study-tips">
        <h2>💡 Study Tips</h2>
        <ul>
          <li>Complete topics in order for best understanding</li>
          <li>Focus on high-priority topics (≥10% exam weightage) first</li>
          <li>Practice flashcards after completing each topic</li>
          <li>Solve practice problems to reinforce concepts</li>
          <li>Review amortized analysis thoroughly - it appears in many topics</li>
          <li>External sorting and tournament trees are frequently tested together</li>
        </ul>
      </div>
    </div>
  );
};

export default StudyGuide;