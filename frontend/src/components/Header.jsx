import React from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const Header = ({ activeTab, setMobileOpen, mobileOpen }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Get readable page titles
  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Overview Dashboard';
      case 'analyze': return 'AI Resume Analyzer';
      case 'skills': return 'Skill Distribution Insights';
      case 'ats': return 'ATS Compliance Score';
      case 'keywords': return 'Keyword Matching & JD Audit';
      case 'suggestions': return 'AI Optimization Suggestions';
      case 'history': return 'Saved Analyses History';
      case 'settings': return 'User System Settings';
      default: return 'Recruiter Analytics Portal';
    }
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <header className="header">
      {/* Title & mobile drawer toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
        <button 
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Drawer"
        >
          <Menu size={22} />
        </button>
        <div className="header-title">
          <h1>{getPageTitle()}</h1>
        </div>
      </div>

      {/* Theme toggle & Profile chip */}
      <div className="header-actions">
        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Theme Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="user-profile-widget">
          <div className="user-avatar">{initial}</div>
          <span className="user-name">{user?.username || 'User Account'}</span>
        </div>
      </div>
    </header>
  );
};
export default Header;
