import React from 'react';
import { Target, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CircularProgress } from '../components/CircularProgress';

export const ATSScore = ({ selectedResume }) => {
  if (!selectedResume) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))' }}>
        <h3>No active resume selected</h3>
        <p style={{ marginTop: 8 }}>Please upload a resume under "Resume Analysis" to view ATS score breakdowns.</p>
      </div>
    );
  }

  const analysis = selectedResume.analysis || {};
  const contact = selectedResume.contact || {};
  const skills = selectedResume.skills || { technical: [], tools: [], soft: [] };

  // Formulate a checklist of standard recruiter ATS parsing rules
  const auditChecks = [
    {
      name: 'Contact Header Integration',
      status: contact.email && contact.phone ? 'pass' : 'fail',
      desc: 'Verify presence of direct email address and active contact phone number.',
      remedy: 'Place your email and phone clearly in the top header segment.'
    },
    {
      name: 'LinkedIn Professional Link',
      status: contact.linkedin ? 'pass' : 'fail',
      desc: 'ATS systems index LinkedIn URLs to matching candidates social databases.',
      remedy: 'Embed a direct link to your active LinkedIn account at the top.'
    },
    {
      name: 'GitHub Repository Portfolios',
      status: contact.github || contact.portfolio ? 'pass' : 'warn',
      desc: 'Showcases coded project source-files for senior recruiter technical screening.',
      remedy: 'Add a clean link to your GitHub profile or personal website.'
    },
    {
      name: 'Standard Document Sectioning',
      status: selectedResume.parsedText.toLowerCase().includes('experience') && selectedResume.parsedText.toLowerCase().includes('education') ? 'pass' : 'fail',
      desc: 'Standard titles (e.g. "Work Experience", "Education") help parses build chronological timelines.',
      remedy: 'Ensure sections are clearly labeled "Education", "Work Experience", and "Skills".'
    },
    {
      name: 'Length and Formatting Constraints',
      status: selectedResume.parsedText.length > 500 && selectedResume.parsedText.length < 5000 ? 'pass' : 'warn',
      desc: 'Optimal resume length averages 1 to 2 standard letter pages (800 - 4000 characters).',
      remedy: 'Consolidate excessive phrasing down to strong quantitative action statements.'
    },
    {
      name: 'Action Verb Optimization',
      status: selectedResume.parsedText.toLowerCase().includes('developed') || selectedResume.parsedText.toLowerCase().includes('led') || selectedResume.parsedText.toLowerCase().includes('engineered') ? 'pass' : 'warn',
      desc: 'ATS score weighting benefits heavily from active accomplishment phrasing.',
      remedy: 'Incorporate active metrics verbs: Spearheaded, Architected, Automated.'
    }
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Visual score split */}
      <div className="layout-split">
        
        {/* Progress Gauge */}
        <div className="glass-panel" style={{ padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <CircularProgress score={analysis.overallScore} label="OVERALL ATS" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Recruiter Compliance Tier</h3>
          <span 
            className="chat-suggestion-tag"
            style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '6px 16px',
              background: analysis.overallScore >= 80 ? 'rgba(16, 185, 129, 0.15)' : analysis.overallScore >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: analysis.overallScore >= 80 ? 'var(--accent-success)' : analysis.overallScore >= 60 ? 'var(--accent-warning)' : 'var(--accent-error)',
              border: `1px solid ${analysis.overallScore >= 80 ? 'rgba(16, 185, 129, 0.3)' : analysis.overallScore >= 60 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}
          >
            {analysis.overallScore >= 80 ? 'Elite Recruiter Ready' : analysis.overallScore >= 60 ? 'Needs Alignment' : 'Critical Fixes Required'}
          </span>
        </div>

        {/* Detailed insights summary */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>ATS Machine Compliance Audit</h3>
          </div>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Many enterprise recruiters filter applications through parsing systems that catalog candidate structures. 
            Passing these automated tests is crucial to landing an interview window.
          </p>
          <div style={{ padding: 15, background: 'rgba(var(--bg-tertiary-rgb), 0.2)', borderRadius: 8, borderLeft: '3px solid var(--accent-primary)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>Core Pro Tip</span>
            <p style={{ fontSize: '0.8rem', color: 'rgb(var(--text-secondary-rgb))', marginTop: 4 }}>
              Always save and submit files as standard **PDF** or **DOCX** documents. Never use embedded tables or float graphics.
            </p>
          </div>
        </div>

      </div>

      {/* RENDER THE CHECKLIST TABLE */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Compliance Checklist Roster</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {auditChecks.map((check, idx) => (
            <div 
              key={idx} 
              className="glass-panel-interactive" 
              style={{ padding: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}
            >
              {/* Icon indicator */}
              <div>
                {check.status === 'pass' && <CheckCircle2 size={24} style={{ color: 'var(--accent-success)' }} />}
                {check.status === 'warn' && <AlertTriangle size={24} style={{ color: 'var(--accent-warning)' }} />}
                {check.status === 'fail' && <XCircle size={24} style={{ color: 'var(--accent-error)' }} />}
              </div>

              {/* Text explanations */}
              <div style={{ flex: 1, minWidth: 250 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgb(var(--text-primary-rgb))' }}>{check.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'rgb(var(--text-secondary-rgb))', marginTop: 4 }}>{check.desc}</p>
              </div>

              {/* Remedy recommendation */}
              {check.status !== 'pass' && (
                <div style={{ minWidth: 200, padding: 12, background: 'rgba(255, 255, 255, 0.03)', borderRadius: 8, border: '1px solid rgba(var(--border-glass-rgb), 0.05)', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-tertiary)' }}>Resolution:</span>
                  <p style={{ color: 'rgb(var(--text-secondary-rgb))', marginTop: 2 }}>{check.remedy}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default ATSScore;
