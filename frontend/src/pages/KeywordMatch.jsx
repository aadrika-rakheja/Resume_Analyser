import React from 'react';
import { Target, CheckCircle2, XCircle, Compass } from 'lucide-react';
import { CircularProgress } from '../components/CircularProgress';

export const KeywordMatch = ({ selectedResume }) => {
  if (!selectedResume) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))' }}>
        <h3>No active resume selected</h3>
        <p style={{ marginTop: 8 }}>Please upload a resume under "Resume Analysis" to view keyword matching indicators.</p>
      </div>
    );
  }

  const analysis = selectedResume.analysis || {};
  const kw = analysis.keywordMatch || { percentage: 0, matched: [], missing: [] };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Score gauge and stats banner */}
      <div className="layout-split">
        
        {/* Progress Gauge */}
        <div className="glass-panel" style={{ padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <CircularProgress score={kw.percentage} label="KEYWORD MATCH" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Semantic Alignment Score</h3>
        </div>

        {/* Informational description panel */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Compass size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>ATS Keywords Matching</h3>
          </div>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Enterprise ATS systems prioritize applications containing exact technical keywords, methodologies, and platforms matching their specifications.
            Ensure you integrate missing terms directly inside your work descriptions to rank high!
          </p>
        </div>

      </div>

      {/* RENDER THE DETAILED LIST OF MATCHED AND MISSING KEYWORDS */}
      <div className="layout-split">
        
        {/* Matched list */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-success)' }}>
            <CheckCircle2 size={18} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Matched Keywords ({kw.matched?.length || 0})</h3>
          </div>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>
            Congratulations! These terms present in the JD were successfully located on your document.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {kw.matched?.map((keyword, index) => (
              <span 
                key={index} 
                className="chat-suggestion-tag"
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  color: 'var(--accent-success)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 12px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'default'
                }}
              >
                {keyword}
              </span>
            ))}
            {(!kw.matched || kw.matched.length === 0) && (
              <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-tertiary-rgb))' }}>No matching terms located. Paste a detailed Job Description during upload.</span>
            )}
          </div>
        </div>

        {/* Missing list */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent-error)' }}>
            <XCircle size={18} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Missing Keywords ({kw.missing?.length || 0})</h3>
          </div>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>
            Action items! Recruiters specified these parameters, but they are absent in your text.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {kw.missing?.map((keyword, index) => (
              <span 
                key={index} 
                className="chat-suggestion-tag"
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: 'var(--accent-error)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '6px 12px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'default'
                }}
              >
                {keyword}
              </span>
            ))}
            {(!kw.missing || kw.missing.length === 0) && (
              <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-tertiary-rgb))' }}>No missing keywords cataloged! Perfect alignment!</span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
export default KeywordMatch;
