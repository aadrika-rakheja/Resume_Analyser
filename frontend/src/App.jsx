import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, API_BASE_URL } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import { Toast } from './components/Toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Overview from './pages/Overview';
import ResumeAnalysis from './pages/ResumeAnalysis';
import SkillInsights from './pages/SkillInsights';
import ATSScore from './pages/ATSScore';
import KeywordMatch from './pages/KeywordMatch';
import Suggestions from './pages/Suggestions';
import ResumeHistory from './pages/ResumeHistory';
import Settings from './pages/Settings';

// Style imports
import './styles/global.css';
import './styles/dashboard.css';
import './styles/components.css';

const InnerApp = () => {
  const { user, token, loading, getAuthHeaders } = useAuth();
  const [authView, setAuthView] = useState('login'); // login or register
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast(null);
  };

  // Fetch analyzed resume history
  const fetchHistory = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/history`, {
        headers: getAuthHeaders()
      });
      const resData = await response.json();
      if (resData.success) {
        setHistory(resData.data);
      }
    } catch (err) {
      console.error('Failed to fetch resume histories:', err.message);
    }
  };

  // Trigger history fetching on login
  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      setHistory([]);
      setSelectedResume(null);
    }
  }, [token]);

  // Loading Screen spinner
  if (loading) {
    return (
      <div className="auth-wrapper" style={{ flexDirection: 'column', gap: 20 }}>
        <div className="btn-spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
        <h3 style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Initializing Resume.AI Workbench...</h3>
      </div>
    );
  }

  // Auth pages toggle
  if (!token) {
    return authView === 'login' ? (
      <Login 
        onRegisterClick={() => setAuthView('register')} 
        onToast={showToast} 
      />
    ) : (
      <Register 
        onLoginClick={() => setAuthView('login')} 
        onToast={showToast} 
      />
    );
  }

  // Dashboard Tab rendering
  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            history={history} 
            setActiveTab={setActiveTab} 
            setSelectedResume={setSelectedResume} 
          />
        );
      case 'analyze':
        return (
          <ResumeAnalysis 
            selectedResume={selectedResume} 
            setSelectedResume={setSelectedResume} 
            onToast={showToast}
            refreshHistory={fetchHistory}
          />
        );
      case 'skills':
        return <SkillInsights selectedResume={selectedResume} />;
      case 'ats':
        return <ATSScore selectedResume={selectedResume} />;
      case 'keywords':
        return <KeywordMatch selectedResume={selectedResume} />;
      case 'suggestions':
        return <Suggestions selectedResume={selectedResume} />;
      case 'history':
        return (
          <ResumeHistory 
            history={history} 
            setActiveTab={setActiveTab} 
            setSelectedResume={setSelectedResume} 
            onToast={showToast}
            refreshHistory={fetchHistory}
          />
        );
      case 'settings':
        return <Settings onToast={showToast} />;
      default:
        return <Overview history={history} setActiveTab={setActiveTab} setSelectedResume={setSelectedResume} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Glow backgrounds */}
      <div className="glow-accent" style={{ top: '10%', left: '10%' }} />
      <div className="glow-accent" style={{ bottom: '15%', right: '10%', width: 400, height: 400 }} />

      {/* Sidebar Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content viewport */}
      <div className="main-content">
        <Header 
          activeTab={activeTab} 
          setMobileOpen={setMobileOpen} 
          mobileOpen={mobileOpen} 
        />
        
        <main className="page-container">
          {renderActivePage()}
        </main>
      </div>

      {/* Career Advisor Chatbot Coach */}
      <ChatBot currentResumeId={selectedResume?._id} />

      {/* Global notifications Stack */}
      {toast && (
        <div className="toast-container">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={handleCloseToast} 
          />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
