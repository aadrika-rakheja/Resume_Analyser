import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Compass, 
  Bookmark, 
  Settings, 
  Sparkles, 
  Target,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'analyze', name: 'Resume Analysis', icon: FileText },
    { id: 'skills', name: 'Skill Insights', icon: BarChart3 },
    { id: 'ats', name: 'ATS Score', icon: Target },
    { id: 'keywords', name: 'Keyword Match', icon: Compass },
    { id: 'suggestions', name: 'AI Suggestions', icon: Sparkles },
    { id: 'history', name: 'Resume History', icon: Bookmark },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const handleItemClick = (id) => {
    setActiveTab(id);
    setMobileOpen(false); // Close sidebar on mobile
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand logo header */}
      <div className="sidebar-logo">
        <div className="auth-logo-icon" style={{ width: 36, height: 36, fontSize: '1rem', borderRadius: 8 }}>
          🚀
        </div>
        <span className="logo-text">RESUME.AI</span>
      </div>

      {/* Main navigation listings */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              style={{ background: 'none', border: 'none', textAlign: 'left', width: '100%' }}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.name}</span>
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      {/* Logout foot section */}
      <div className="sidebar-footer">
        <button 
          onClick={logout}
          className="sidebar-item" 
          style={{ 
            background: 'none', 
            border: 'none', 
            textAlign: 'left', 
            width: '100%',
            color: 'rgb(var(--accent-error))',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
