import React, { useState, useEffect } from 'react';
import { slideData } from '../data/slideData';
import './SlidesExplanation.css';

const SlidesExplanation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide(prev => Math.min(prev + 1, slideData.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const slide = slideData[currentSlide];

  // A simple function to dynamically import the images.
  const getImageUrl = (imageName) => {
      try {
          return require(`../assets/slides/${imageName}`);
      } catch (err) {
          return 'https://via.placeholder.com/800x600.png?text=Slide+Image+Not+Found'; // A placeholder
      }
  }

  // Function to render text with proper formatting
  const renderFormattedText = (text) => {
    if (!text) return null;

    // Split by double newlines to create paragraphs
    const paragraphs = text.split('\n\n');

    return paragraphs.map((paragraph, index) => {
      // Check if this is a header (all caps or ends with colon)
      const isHeader = paragraph.match(/^[A-Z\s]+:$/) || paragraph.match(/^[A-Z][A-Z\s]+$/);

      // Check for bullet points
      if (paragraph.includes('•')) {
        const lines = paragraph.split('\n');
        const title = lines[0].includes(':') ? lines[0] : null;
        const items = lines.filter(line => line.trim().startsWith('•'));

        return (
          <div key={index} className="formatted-section">
            {title && !title.startsWith('•') && <h4 className="section-title">{title}</h4>}
            <ul className="bullet-list">
              {items.map((item, idx) => (
                <li key={idx}>{item.replace('•', '').trim()}</li>
              ))}
            </ul>
          </div>
        );
      }

      // Check for numbered lists
      if (paragraph.match(/^\d+\./)) {
        const lines = paragraph.split('\n');
        return (
          <ol key={index} className="numbered-list">
            {lines.map((line, idx) => {
              const cleaned = line.replace(/^\d+\./, '').trim();
              if (cleaned) return <li key={idx}>{cleaned}</li>;
              return null;
            })}
          </ol>
        );
      }

      // Headers
      if (isHeader) {
        return <h4 key={index} className="content-header">{paragraph}</h4>;
      }

      // Warning or special callouts
      if (paragraph.startsWith('⚠️') || paragraph.includes('KEY INSIGHT') || paragraph.includes('RESULT:')) {
        return <div key={index} className="callout-box">{paragraph}</div>;
      }

      // Regular paragraphs
      return <p key={index} className="content-paragraph">{paragraph}</p>;
    });
  };

  return (
    <div className="slides-explanation-container">
      <div className="slides-header">
        <h1>Advanced Data Structures - Slide Explanations</h1>
        <div className="navigation-info">
          <span>Slide {slide.id} of {slideData.length}</span>
          <span className="nav-hint">Use ← → arrow keys to navigate</span>
        </div>
      </div>

      <div className="slide-main-content">
        <div className="slide-image-section">
          <img src={getImageUrl(slide.image)} alt={`Slide ${slide.id}`} className="slide-image"/>
          <div className="slide-controls">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="nav-btn"
            >
              ← Previous
            </button>
            <span className="slide-counter">{slide.id} / {slideData.length}</span>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slideData.length - 1))}
              disabled={currentSlide === slideData.length - 1}
              className="nav-btn"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="explanation-section">
          <h2>Explanation</h2>
          <div className="explanation-content">
            {renderFormattedText(slide.explanation)}
          </div>
        </div>
      </div>

      {(slide.subTopicSummary || slide.extraExample) && (
        <div className="additional-content">
          {slide.subTopicSummary && (
            <div className="summary-section">
              <h3>📚 Topic Summary</h3>
              <div className="summary-content">
                {renderFormattedText(slide.subTopicSummary)}
              </div>
            </div>
          )}

          {slide.extraExample && (
            <div className="example-section">
              <h3>💡 {slide.extraExample.title}</h3>
              <div className="example-content">
                {renderFormattedText(slide.extraExample.content)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="quick-nav">
        <h4>Quick Navigation</h4>
        <div className="slide-grid">
          {slideData.slice(0, 50).map((s, idx) => (
            <button
              key={idx}
              className={`slide-thumb ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
            >
              {s.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlidesExplanation;