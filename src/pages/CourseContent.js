import React, { useState } from 'react';
import { learnContent } from '../data/learnContent';
import { studyOrder } from '../data/studyOrder';
import { FiChevronDown, FiChevronRight, FiClock, FiLayers, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import './CourseContent.css';

const CourseContent = () => {
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [expandedSections, setExpandedSections] = useState({});
  const [completedSections, setCompletedSections] = useState(() => {
    const saved = localStorage.getItem('completedSections');
    return saved ? JSON.parse(saved) : {};
  });

  // Get topics in correct order based on study modules
  const getOrderedTopics = () => {
    const orderedTopics = [];

    // Follow the module order from studyOrder
    studyOrder.modules.forEach(module => {
      module.topics.forEach(topicKey => {
        if (learnContent[topicKey]) {
          orderedTopics.push({
            key: topicKey,
            moduleNumber: module.moduleNumber,
            moduleTitle: module.title,
            ...learnContent[topicKey]
          });
        }
      });
    });

    // Add any remaining topics not in modules (if any)
    Object.keys(learnContent).forEach(key => {
      if (!orderedTopics.find(t => t.key === key)) {
        orderedTopics.push({
          key,
          moduleNumber: 99,
          moduleTitle: 'Additional Topics',
          ...learnContent[key]
        });
      }
    });

    return orderedTopics;
  };

  const toggleTopic = (topicKey) => {
    setExpandedTopics(prev =>
      prev.includes(topicKey)
        ? prev.filter(k => k !== topicKey)
        : [...prev, topicKey]
    );
  };

  const toggleSection = (topicKey, sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [`${topicKey}-${sectionId}`]: !prev[`${topicKey}-${sectionId}`]
    }));
  };

  const toggleSectionComplete = (topicKey, sectionId) => {
    const key = `${topicKey}-${sectionId}`;
    const newCompleted = {
      ...completedSections,
      [key]: !completedSections[key]
    };
    setCompletedSections(newCompleted);
    localStorage.setItem('completedSections', JSON.stringify(newCompleted));
  };

  const getTopicProgress = (topicKey, sections) => {
    const completed = sections.filter(section =>
      completedSections[`${topicKey}-${section.id}`]
    ).length;
    return {
      completed,
      total: sections.length,
      percentage: Math.round((completed / sections.length) * 100)
    };
  };

  const orderedTopics = getOrderedTopics();
  let currentModule = null;

  return (
    <div className="course-content">
      <div className="course-header">
        <h1>📚 Complete Course Content</h1>
        <p className="course-subtitle">
          All topics organized by module order • Click to expand and study
        </p>
      </div>

      <div className="content-stats">
        <div className="stat-box">
          <FiLayers className="stat-icon" />
          <div>
            <div className="stat-value">{studyOrder.modules.length}</div>
            <div className="stat-label">Modules</div>
          </div>
        </div>
        <div className="stat-box">
          <FiBookOpen className="stat-icon" />
          <div>
            <div className="stat-value">{orderedTopics.length}</div>
            <div className="stat-label">Topics</div>
          </div>
        </div>
        <div className="stat-box">
          <FiClock className="stat-icon" />
          <div>
            <div className="stat-value">
              {orderedTopics.reduce((sum, t) => sum + (parseInt(t.readingTime) || 45), 0)} min
            </div>
            <div className="stat-label">Total Reading</div>
          </div>
        </div>
      </div>

      <div className="topics-container">
        {orderedTopics.map((topic, index) => {
          const isNewModule = topic.moduleNumber !== currentModule;
          currentModule = topic.moduleNumber;
          const isExpanded = expandedTopics.includes(topic.key);
          const progress = topic.sections ? getTopicProgress(topic.key, topic.sections) : null;

          return (
            <div key={topic.key}>
              {isNewModule && (
                <div className="module-divider">
                  <span className="module-label">
                    Module {topic.moduleNumber}: {topic.moduleTitle}
                  </span>
                </div>
              )}

              <div className={`topic-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="topic-header" onClick={() => toggleTopic(topic.key)}>
                  <div className="topic-header-left">
                    <span className="topic-number">{index + 1}</span>
                    <span className="topic-icon">{topic.icon}</span>
                    <div className="topic-info">
                      <h2 className="topic-title">{topic.title}</h2>
                      <div className="topic-meta">
                        <span className="topic-level">{topic.level}</span>
                        <span className="topic-time">
                          <FiClock size={14} />
                          {topic.readingTime}
                        </span>
                        {progress && progress.total > 0 && (
                          <span className="topic-progress">
                            {progress.completed}/{progress.total} sections
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="topic-header-right">
                    {progress && progress.total > 0 && (
                      <div className="progress-ring">
                        <svg width="40" height="40">
                          <circle
                            cx="20" cy="20" r="16"
                            stroke="#e0e0e0" strokeWidth="3" fill="none"
                          />
                          <circle
                            cx="20" cy="20" r="16"
                            stroke="#4caf50" strokeWidth="3" fill="none"
                            strokeDasharray={`${progress.percentage} 100`}
                            strokeDashoffset="25"
                            transform="rotate(-90 20 20)"
                          />
                        </svg>
                        <span className="progress-text">{progress.percentage}%</span>
                      </div>
                    )}
                    <span className="expand-icon">
                      {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="topic-content">
                    {topic.sections && topic.sections.map(section => {
                      const sectionKey = `${topic.key}-${section.id}`;
                      const isSectionExpanded = expandedSections[sectionKey];
                      const isSectionComplete = completedSections[sectionKey];

                      return (
                        <div key={section.id} className={`section ${isSectionComplete ? 'completed' : ''}`}>
                          <div className="section-header">
                            <div
                              className="section-header-clickable"
                              onClick={() => toggleSection(topic.key, section.id)}
                            >
                              <span className="section-expand">
                                {isSectionExpanded ? <FiChevronDown /> : <FiChevronRight />}
                              </span>
                              <h3 className="section-title">{section.title}</h3>
                            </div>
                            <button
                              className={`complete-btn ${isSectionComplete ? 'completed' : ''}`}
                              onClick={() => toggleSectionComplete(topic.key, section.id)}
                              title={isSectionComplete ? 'Mark as incomplete' : 'Mark as complete'}
                            >
                              <FiCheckCircle />
                            </button>
                          </div>

                          {isSectionExpanded && (
                            <div className="section-content">
                              {section.content && (
                                <div className="content-block">
                                  <p className="content-text">{section.content}</p>
                                </div>
                              )}

                              {section.formula && (
                                <div className="formula-block">
                                  <div className="formula-label">Formula:</div>
                                  <code className="formula">{section.formula}</code>
                                  {section.formulaExplanation && (
                                    <p className="formula-explanation">{section.formulaExplanation}</p>
                                  )}
                                </div>
                              )}

                              {section.example && (
                                <div className="example-block">
                                  <div className="example-label">Example:</div>
                                  <pre className="example-code">{section.example}</pre>
                                </div>
                              )}

                              {section.proof && (
                                <div className="proof-block">
                                  <div className="proof-label">Proof:</div>
                                  <pre className="proof-text">{section.proof}</pre>
                                </div>
                              )}

                              {section.keyPoints && section.keyPoints.length > 0 && (
                                <div className="keypoints-block">
                                  <div className="keypoints-label">Key Points:</div>
                                  <ul className="keypoints-list">
                                    {section.keyPoints.map((point, idx) => (
                                      <li key={idx}>{point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {section.examTips && section.examTips.length > 0 && (
                                <div className="examtips-block">
                                  <div className="examtips-label">📝 Exam Tips:</div>
                                  <ul className="examtips-list">
                                    {section.examTips.map((tip, idx) => (
                                      <li key={idx}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {section.complexity && (
                                <div className="complexity-block">
                                  <div className="complexity-label">Complexity Analysis:</div>
                                  <table className="complexity-table">
                                    <thead>
                                      <tr>
                                        <th>Operation</th>
                                        <th>Worst Case</th>
                                        <th>Amortized</th>
                                        <th>Space</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(section.complexity).map(([op, complexities]) => (
                                        <tr key={op}>
                                          <td>{op}</td>
                                          <td>{complexities.worst || '-'}</td>
                                          <td>{complexities.amortized || '-'}</td>
                                          <td>{complexities.space || '-'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}

                              {section.commonMistakes && section.commonMistakes.length > 0 && (
                                <div className="mistakes-block">
                                  <div className="mistakes-label">⚠️ Common Mistakes:</div>
                                  <ul className="mistakes-list">
                                    {section.commonMistakes.map((mistake, idx) => (
                                      <li key={idx}>{mistake}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {topic.summary && (
                      <div className="topic-summary">
                        <div className="summary-label">📌 Summary:</div>
                        <p className="summary-text">{topic.summary}</p>
                      </div>
                    )}

                    {topic.references && topic.references.length > 0 && (
                      <div className="topic-references">
                        <div className="references-label">📚 References:</div>
                        <ul className="references-list">
                          {topic.references.map((ref, idx) => (
                            <li key={idx}>{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseContent;