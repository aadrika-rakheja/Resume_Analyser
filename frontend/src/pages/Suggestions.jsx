import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, Award, PenTool, Lightbulb } from 'lucide-react';

export const Suggestions = ({ selectedResume }) => {
  if (!selectedResume) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))' }}>
        <h3>No active resume selected</h3>
        <p style={{ marginTop: 8 }}>Please upload a resume under "Resume Analysis" to view AI optimization suggestions.</p>
      </div>
    );
  }

  const suggestions = selectedResume.analysis?.suggestions || {
    missingSkills: [],
    wordingImprovements: [],
    atsTips: [],
    projectRecommendations: [],
    actionVerbs: [],
    industryImprovements: []
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Visual Header */}
      <div className="glass-panel" style={{ padding: 24, background: 'var(--grad-premium)', borderLeft: '4px solid var(--accent-primary)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>AI Suggestions Engine</span>
        </h3>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', lineHeight: 1.45 }}>
          Our AI advisor audits structural patterns, hard technical competencies, wording expressions, and quantitative metrics to compile clear actionable guidelines to elevate placement rankings.
        </p>
      </div>

      {/* RENDER DYNAMIC WORDING IMPROVEMENTS (Before / After styling) */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <PenTool size={18} style={{ color: 'var(--accent-secondary)' }} />
          <span>Better Resume Wording & Bullet Metrics</span>
        </h3>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>
          Recruiters favor results-focused descriptions showing exact numerical values rather than descriptive tasks lists. 
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {suggestions.wordingImprovements?.map((wording, idx) => {
            // Split based on simple keyword patterns or display cleanly
            const parts = wording.split(/change '(.+?)' to '(.+?)'/i);
            const beforeText = parts[1] || "Responsible for maintaining backend systems and code quality checks.";
            const afterText = parts[2] || "Engineered scalable Node REST APIs and automated visual tests, cutting bundle payload latencies by 35%.";
            
            return (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ 
                  padding: 20, 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto 1fr', 
                  gap: 16, 
                  alignItems: 'center',
                  background: 'rgba(var(--bg-secondary-rgb), 0.5)'
                }}
              >
                {/* Before box */}
                <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: 8, fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-error)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>Weak wording</span>
                  <p style={{ color: 'rgb(var(--text-secondary-rgb))', marginTop: 4, fontStyle: 'italic' }}>"{beforeText}"</p>
                </div>

                {/* Separator arrow */}
                <div style={{ color: 'var(--accent-primary)' }}>
                  <ArrowRight size={20} />
                </div>

                {/* After box */}
                <div style={{ padding: 12, background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 8, fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--accent-success)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>AI Optimized version</span>
                  <p style={{ color: 'rgb(var(--text-primary-rgb))', marginTop: 4, fontWeight: 500 }}>"{afterText}"</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Split: Action verbs & projects recommendations */}
      <div className="layout-split">
        
        {/* Action Verbs panel */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={18} style={{ color: 'var(--accent-primary)' }} />
            <span>Recommended Action Verbs</span>
          </h3>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>
            Incorporate these energetic, impact-driven verbs at the beginning of your experience statements:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {suggestions.actionVerbs?.map((verb, idx) => (
              <span 
                key={idx} 
                className="chat-suggestion-tag"
                style={{ 
                  background: 'rgba(99, 102, 241, 0.08)', 
                  color: 'var(--accent-primary)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'default'
                }}
              >
                {verb}
              </span>
            ))}
            {(!suggestions.actionVerbs || suggestions.actionVerbs.length === 0) && (
              <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-tertiary-rgb))' }}>No action verbs parsed.</span>
            )}
          </div>
        </div>

        {/* Project upgrades panel */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Lightbulb size={18} style={{ color: 'var(--accent-tertiary)' }} />
            <span>Project Upgrades</span>
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 16, fontSize: '0.85rem', color: 'rgb(var(--text-secondary-rgb))', lineHeight: 1.45 }}>
            {suggestions.projectRecommendations?.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
            {(!suggestions.projectRecommendations || suggestions.projectRecommendations.length === 0) && (
              <li>No project guidelines generated yet.</li>
            )}
          </ul>
        </div>

      </div>

      {/* ATS & Industry optimization grids */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>ATS & Industry Formatting Advice</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {suggestions.atsTips?.concat(suggestions.industryImprovements || []).map((tip, idx) => (
            <div 
              key={idx} 
              className="glass-panel-interactive" 
              style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <CheckCircle2 size={16} style={{ color: 'var(--accent-primary)', minWidth: 16 }} />
              <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary-rgb))', lineHeight: 1.4 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default Suggestions;
