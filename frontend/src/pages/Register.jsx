import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

export const Register = ({ onLoginClick, onToast }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      onToast('Please fill in all registration fields.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await register(username, email, password);
      onToast('Account created successfully! Welcome aboard.', 'success');
    } catch (err) {
      onToast(err.message || 'Registration failed. Email might be already in use.', 'error');
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
            <h2>Create Account</h2>
            <p>Get started with recruiter-grade AI feedback</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reg-username">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'rgba(var(--text-tertiary-rgb), 0.8)' }} />
                <input 
                  id="reg-username"
                  type="text" 
                  placeholder="John Doe" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: 46 }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'rgba(var(--text-tertiary-rgb), 0.8)' }} />
                <input 
                  id="reg-email"
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
              <label htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: 14, color: 'rgba(var(--text-tertiary-rgb), 0.8)' }} />
                <input 
                  id="reg-password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account? </span>
            <button 
              onClick={onLoginClick}
              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              Login instead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
