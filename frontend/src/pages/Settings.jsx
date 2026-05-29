import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, ShieldAlert, Cpu, Eye, EyeOff, Save, Check } from 'lucide-react';

export const Settings = ({ onToast }) => {
  const { user, updateUserSettings } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [systemDiag, setSystemDiag] = useState(null);

  // Set initial API key if available
  useEffect(() => {
    if (user?.settings?.customApiKey) {
      setApiKey(user.settings.customApiKey);
    }
  }, [user]);

  // Fetch diagnostic details from server status endpoint
  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const resData = await response.json();
        if (resData.success) {
          setSystemDiag(resData.diagnostics);
        }
      } catch (err) {
        console.error('Failed to retrieve system status.');
      }
    };
    fetchDiagnostics();
  }, []);

  const handleSaveApiKey = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserSettings(theme, apiKey);
      onToast('API Key saved successfully! Premium AI mode activated.', 'success');
    } catch (err) {
      onToast(`Failed to update key: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateUserSettings(newTheme, apiKey).catch(() => {});
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Visual Header */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingsIcon size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>System Configurations</span>
        </h3>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.45 }}>
          Customize your career coaching parameters, input API keys, and inspect background server status metrics.
        </p>
      </div>

      {/* RENDER THE API KEY FORM */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldAlert size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Google Gemini / OpenAI Keys</h3>
        </div>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem', lineHeight: 1.45 }}>
          By default, this server operates entirely locally using a high-quality offline rule-based NLP parser. 
          To unlock **premium recruiter-grade AI insights, semantic Jaccard alignments, and conversational chatbot advisor answers**, 
          drop a Google Gemini Developer API key below.
        </p>

        <form onSubmit={handleSaveApiKey} style={{ display: 'flex', flexWrap: 'wrap', gap: 15, alignItems: 'flex-end', width: '100%' }}>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', flexDirection: 'column' }}>
            <label htmlFor="settings-gemini-key">Gemini Developer API Key</label>
            <div style={{ position: 'relative' }}>
              <input 
                id="settings-gemini-key"
                type={showKey ? 'text' : 'password'} 
                placeholder="AIzaSy..." 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ paddingRight: 46 }}
              />
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                style={{ 
                  position: 'absolute', 
                  right: 12, 
                  top: 10, 
                  background: 'none', 
                  border: 'none', 
                  color: 'rgb(var(--text-secondary-rgb))',
                  cursor: 'pointer'
                }}
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="gradient-button"
            disabled={loading}
            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            {loading ? <div className="btn-spinner" /> : <Save size={16} />}
            <span>Save Key</span>
          </button>
        </form>
      </div>

      {/* RENDER THE VISUAL PROFILE AND THEMING */}
      <div className="layout-split">
        
        {/* Theming switches */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Visual Dashboard Skin</h3>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>Toggle visual themes for the recruiter-grade panel.</p>
          
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button 
              onClick={() => handleThemeChange('dark')}
              className={`sidebar-item ${theme === 'dark' ? 'active' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: '12px 20px', borderRadius: 8 }}
            >
              <span>Dark Obsidian</span>
              {theme === 'dark' && <Check size={16} style={{ marginLeft: 8 }} />}
            </button>
            
            <button 
              onClick={() => handleThemeChange('light')}
              className={`sidebar-item ${theme === 'light' ? 'active' : ''}`}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', padding: '12px 20px', borderRadius: 8 }}
            >
              <span>Paper Light</span>
              {theme === 'light' && <Check size={16} style={{ marginLeft: 8 }} />}
            </button>
          </div>
        </div>

        {/* Server Diagnostics */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={18} style={{ color: 'var(--accent-secondary)' }} />
            <span>Diagnostics Status</span>
          </h3>
          
          {systemDiag ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.8rem', color: 'rgb(var(--text-secondary-rgb))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Database Mode:</span>
                <strong style={{ color: systemDiag.db?.mode === 'MongoDB' ? 'var(--accent-success)' : 'var(--accent-tertiary)' }}>{systemDiag.db?.mode}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>API Port:</span>
                <strong>{systemDiag.port}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Node.js Version:</span>
                <strong>{systemDiag.nodeVersion}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Account Email:</span>
                <strong>{user?.email || 'N/A'}</strong>
              </div>
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'rgb(var(--text-tertiary-rgb))' }}>Failed to query backend status. Make sure the backend server is running.</span>
          )}
        </div>

      </div>

    </div>
  );
};
export default Settings;
