import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

export const Login = ({ onRegisterClick, onToast }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      onToast('Please fill in all credentials.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      onToast('Login successful! Welcome back.', 'success');
    } catch (err) {
      onToast(err.message || 'Login failed. Invalid credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-glow-1" />
      <div className="auth-bg-glow-2" />
      
      <div className="auth-container">
        <div className="auth-logo-section animate-float">
          <div className="auth-logo-icon">🚀</div>
          <span className="auth-logo-text">RESUME.AI</span>
        </div>

        <div className="auth-card glass-panel animate-fade-in-up">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Enter your details to access recruiter analytics</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'rgba(var(--text-tertiary-rgb), 0.8)' }} />
                <input 
                  id="login-email"
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 46 }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'rgba(var(--text-tertiary-rgb), 0.8)' }} />
                <input 
                  id="login-password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 46 }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="gradient-button auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <button 
              onClick={onRegisterClick}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
