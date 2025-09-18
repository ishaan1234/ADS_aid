import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Flashcards from './pages/Flashcards';
import Visualizations from './pages/Visualizations';
import PracticeProblems from './pages/PracticeProblems';
import LearningPaths from './pages/LearningPaths';
import StudyGuide from './pages/StudyGuide';
import CourseContent from './pages/CourseContent';
import SlidesExplanation from './pages/SlidesExplanation';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app">
        <Navigation theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/practice" element={<PracticeProblems />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/study-guide" element={<StudyGuide />} />
            <Route path="/course-content" element={<CourseContent />} />
            <Route path="/slides" element={<SlidesExplanation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;