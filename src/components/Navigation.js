import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiBook, FiActivity, FiEdit3, FiMap, FiBookOpen,
  FiSun, FiMoon, FiMenu, FiX, FiChevronDown, FiCompass
} from 'react-icons/fi';
import './Navigation.css';

const Navigation = ({ theme, toggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/study-guide', icon: FiCompass, label: 'Study Guide' },
    { path: '/course-content', icon: FiBook, label: 'Course Content' },
    { path: '/slides', icon: FiBookOpen, label: 'Slides' },
    { path: '/learn', icon: FiBookOpen, label: 'Learn' },
    {
      label: 'Practice',
      icon: FiEdit3,
      dropdown: [
        { path: '/flashcards', label: 'Flashcards' },
        { path: '/practice', label: 'Problems' },
        { path: '/learning-paths', label: 'Study Paths' }
      ]
    },
    { path: '/visualizations', icon: FiActivity, label: 'Visualize' }
  ];

  const handleDropdownToggle = (label) => {
    setDropdownOpen(dropdownOpen === label ? null : label);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">DS Master</span>
          <span className="logo-subtitle">Graduate Level</span>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navItems.map((item) => (
            item.dropdown ? (
              <div key={item.label} className="nav-dropdown">
                <button
                  className="nav-link dropdown-trigger"
                  onClick={() => handleDropdownToggle(item.label)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  <FiChevronDown className={`dropdown-arrow ${dropdownOpen === item.label ? 'open' : ''}`} size={14} />
                </button>
                <div className={`dropdown-menu ${dropdownOpen === item.label ? 'open' : ''}`}>
                  {item.dropdown.map(subItem => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setDropdownOpen(null);
                      }}
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          ))}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;