import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook, FiActivity, FiEdit3, FiMap, FiCode,
  FiTrendingUp, FiClock, FiAward, FiTarget, FiCompass, FiBookOpen
} from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      totalTime: 0,
      flashcardsReviewed: 0,
      problemsSolved: 0,
      visualizationsViewed: 0,
      currentStreak: 0,
      level: 1,
      xp: 0,
      achievements: []
    };
  });

  const [recentActivity, setRecentActivity] = useState(() => {
    const saved = localStorage.getItem('recentActivity');
    return saved ? JSON.parse(saved) : [];
  });

  const topics = [
    { name: 'Amortized Complexity', progress: 75, color: '#4263eb' },
    { name: 'External Sorting', progress: 60, color: '#51cf66' },
    { name: 'Tournament Trees', progress: 85, color: '#ffd43b' },
    { name: 'Huffman Trees', progress: 70, color: '#ff6b6b' },
    { name: 'Interval Heaps', progress: 45, color: '#845ef7' },
    { name: 'Leftist Trees', progress: 30, color: '#20c997' },
    { name: 'Binomial Heaps', progress: 55, color: '#fd7e14' },
    { name: 'Cache Optimization', progress: 40, color: '#e64980' }
  ];

  const quickLinks = [
    { to: '/study-guide', icon: FiCompass, label: 'Study Guide', color: '#ff6b6b' },
    { to: '/course-content', icon: FiBook, label: 'Course Content', color: '#20c997' },
    { to: '/learn', icon: FiBookOpen, label: 'Study Theory', color: '#4263eb' },
    { to: '/flashcards', icon: FiBook, label: 'Review Flashcards', color: '#845ef7' },
    { to: '/visualizations', icon: FiActivity, label: 'Explore Visualizations', color: '#51cf66' },
    { to: '/practice', icon: FiEdit3, label: 'Practice Problems', color: '#ffd43b' }
  ];

  const achievements = [
    { id: 1, name: 'Getting Started', icon: '🎯', unlocked: true },
    { id: 2, name: 'First Tree', icon: '🌳', unlocked: true },
    { id: 3, name: 'Heap Master', icon: '🏔️', unlocked: false },
    { id: 4, name: 'Algorithm Expert', icon: '🚀', unlocked: false },
    { id: 5, name: 'Cache Optimizer', icon: '⚡', unlocked: false },
    { id: 6, name: 'Data Structure Guru', icon: '🧙‍♂️', unlocked: false }
  ];

  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXpForNextLevel = (level) => {
    return level * 100;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome Back to Your Learning Journey!</h1>
        <p className="dashboard-subtitle">Track your progress and continue mastering Advanced Data Structures</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiClock className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{Math.floor(stats.totalTime / 60)}h {stats.totalTime % 60}m</span>
            <span className="stat-label">Total Study Time</span>
          </div>
        </div>
        <div className="stat-card">
          <FiBook className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{stats.flashcardsReviewed}</span>
            <span className="stat-label">Cards Reviewed</span>
          </div>
        </div>
        <div className="stat-card">
          <FiEdit3 className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{stats.problemsSolved}</span>
            <span className="stat-label">Problems Solved</span>
          </div>
        </div>
        <div className="stat-card">
          <FiTrendingUp className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="progress-section">
          <h2>Topic Progress</h2>
          <div className="topics-list">
            {topics.map(topic => (
              <div key={topic.name} className="topic-item">
                <div className="topic-header">
                  <span className="topic-name">{topic.name}</span>
                  <span className="topic-percentage">{topic.progress}%</span>
                </div>
                <div className="topic-progress-bar">
                  <div
                    className="topic-progress-fill"
                    style={{ width: `${topic.progress}%`, backgroundColor: topic.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="level-section">
          <h2>Your Level</h2>
          <div className="level-card">
            <div className="level-display">
              <FiAward className="level-icon" />
              <span className="level-number">Level {stats.level}</span>
            </div>
            <div className="xp-section">
              <div className="xp-header">
                <span className="xp-current">{stats.xp} XP</span>
                <span className="xp-next">/ {getXpForNextLevel(stats.level)} XP</span>
              </div>
              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{ width: `${(stats.xp % 100)}%` }}
                />
              </div>
            </div>
          </div>

          <h3>Achievements</h3>
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                title={achievement.name}
              >
                <span className="achievement-icon">{achievement.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-links-section">
        <h2>Quick Actions</h2>
        <div className="quick-links-grid">
          {quickLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="quick-link-card"
              style={{ '--accent-color': link.color }}
            >
              <link.icon className="quick-link-icon" size={24} />
              <span className="quick-link-label">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="activity-list">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="activity-item">
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <span className="activity-text">{activity.text}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activity">Start learning to see your activity here!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;