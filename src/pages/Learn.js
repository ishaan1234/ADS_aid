import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronDown, FiBookOpen, FiAward, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import './Learn.css';
import { learnContent } from '../data/learnContent';

const Learn = () => {
  const [selectedTopic, setSelectedTopic] = useState('amortized');
  const [expandedSections, setExpandedSections] = useState({});
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    return localStorage.getItem('learnBannerDismissed') === 'true';
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const dismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('learnBannerDismissed', 'true');
  };

  const currentContent = learnContent[selectedTopic];

  return (
    <div className="learn-container">
      {!bannerDismissed && (
        <div className="learn-warning-banner">
          <div className="warning-content">
            <FiAlertCircle className="warning-icon" />
            <div className="warning-text">
              <strong>New Recommended View!</strong>
              <p>For a better structured learning experience following the course module order, please visit the new <Link to="/course-content">Course Content</Link> page.</p>
            </div>
            <Link to="/course-content" className="warning-cta">
              Go to Course Content
              <FiArrowRight />
            </Link>
            <button className="dismiss-btn" onClick={dismissBanner} aria-label="Dismiss">
              ×
            </button>
          </div>
        </div>
      )}
      <div className="learn-sidebar">
        <h2>Topics</h2>
        <div className="topic-list">
          {Object.entries(learnContent).map(([key, topic]) => (
            <button
              key={key}
              className={`topic-item ${selectedTopic === key ? 'active' : ''}`}
              onClick={() => setSelectedTopic(key)}
            >
              <span className="topic-icon">{topic.icon}</span>
              <div className="topic-info">
                <span className="topic-title">{topic.title}</span>
                <span className="topic-level">{topic.level}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="learn-content">
        <div className="content-header">
          <h1>{currentContent.title}</h1>
          <div className="content-meta">
            <span className="difficulty-badge">{currentContent.level}</span>
            <span className="reading-time">
              <FiBookOpen size={14} /> {currentContent.readingTime}
            </span>
          </div>
        </div>

        <div className="content-body">
          {currentContent.sections.map(section => (
            <div key={section.id} className="content-section">
              <button
                className="section-header"
                onClick={() => toggleSection(section.id)}
              >
                {expandedSections[section.id] ? <FiChevronDown /> : <FiChevronRight />}
                <h2>{section.title}</h2>
              </button>

              {expandedSections[section.id] !== false && (
                <div className="section-content">
                  {section.content && (
                    <div className="text-content">
                      {section.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  )}

                  {section.formula && (
                    <div className="formula-box">
                      <h4>Key Formula:</h4>
                      <div className="formula">{section.formula}</div>
                      {section.formulaExplanation && (
                        <p className="formula-explanation">{section.formulaExplanation}</p>
                      )}
                    </div>
                  )}

                  {section.example && (
                    <div className="example-box">
                      <h4>Example:</h4>
                      <div className="example-content">
                        {section.example.split('\n').map((line, idx) => (
                          <div key={idx} className="example-line">{line}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.proof && (
                    <div className="proof-box">
                      <h4>Proof:</h4>
                      <div className="proof-content">
                        {section.proof.split('\n').map((line, idx) => (
                          <div key={idx} className="proof-line">{line}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.complexity && (
                    <div className="complexity-box">
                      <h4>Complexity Analysis:</h4>
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
                          {Object.entries(section.complexity).map(([op, values]) => (
                            <tr key={op}>
                              <td>{op}</td>
                              <td>{values.worst}</td>
                              <td>{values.amortized || values.worst}</td>
                              <td>{values.space || 'O(1)'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {section.keyPoints && (
                    <div className="key-points">
                      <h4>Key Points to Remember:</h4>
                      <ul>
                        {section.keyPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.commonMistakes && (
                    <div className="mistakes-box">
                      <h4>⚠️ Common Mistakes:</h4>
                      <ul className="mistakes-list">
                        {section.commonMistakes.map((mistake, idx) => (
                          <li key={idx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.examTips && (
                    <div className="exam-tips">
                      <h4><FiAward /> Exam Tips:</h4>
                      <ul>
                        {section.examTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {currentContent.summary && (
          <div className="content-summary">
            <h3>Chapter Summary</h3>
            <p>{currentContent.summary}</p>
          </div>
        )}

        {currentContent.references && (
          <div className="references">
            <h3>References & Further Reading</h3>
            <ul>
              {currentContent.references.map((ref, idx) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;