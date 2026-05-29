import React from 'react';
import { Award, Cpu, Code2, Wrench, ShieldCheck } from 'lucide-react';

export const SkillInsights = ({ selectedResume }) => {
  if (!selectedResume) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))' }}>
        <h3>No active resume selected</h3>
        <p style={{ marginTop: 8 }}>Please upload a resume under "Resume Analysis" to view skill distribution insights.</p>
      </div>
    );
  }

  const skills = selectedResume.skills || { technical: [], tools: [], soft: [] };

  const skillCategories = [
    {
      title: 'Technical & Coding Languages',
      items: skills.technical || [],
      icon: Code2,
      color: 'var(--accent-primary)',
      desc: 'Foundational programming languages, runtime environments, and frameworks'
    },
    {
      title: 'Tools & Development Environments',
      items: skills.tools || [],
      icon: Wrench,
      color: 'var(--accent-secondary)',
      desc: 'IDEs, build suites, cloud platforms, and productivity services'
    },
    {
      title: 'Professional & Soft Skills',
      items: skills.soft || [],
      icon: ShieldCheck,
      color: 'var(--accent-success)',
      desc: 'Collaboration mechanics, leadership methods, and project philosophies'
    }
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Intro info panel */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 6 }}>Skill distribution overview</h3>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', lineHeight: 1.45 }}>
          Our AI extracts core technologies, developer systems, and organizational frameworks from the resume text. 
          Use this audit to isolate missing skills and check keyword alignments.
        </p>
      </div>

      {/* RENDER CATEGORY CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {skillCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="card-icon-wrapper" style={{ background: `rgba(var(--text-primary-rgb), 0.04)`, color: cat.color, marginBottom: 0 }}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'rgb(var(--text-tertiary-rgb))' }}>{cat.desc}</p>
                </div>
                <span 
                  className="chat-suggestion-tag" 
                  style={{ 
                    marginLeft: 'auto', 
                    background: cat.color + '22', 
                    color: cat.color, 
                    border: `1px solid ${cat.color}44`,
                    fontWeight: 700,
                    padding: '4px 12px'
                  }}
                >
                  {cat.items.length} items parsed
                </span>
              </div>

              {/* Badges container */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {cat.items.map((skill, index) => (
                  <span 
                    key={index} 
                    className="glass-panel-interactive" 
                    style={{ 
                      padding: '8px 16px', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      borderRadius: 8,
                      border: '1px solid rgba(var(--border-glass-rgb), var(--border-glass-alpha))',
                      textTransform: 'capitalize',
                      cursor: 'default'
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {cat.items.length === 0 && (
                  <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-tertiary-rgb))' }}>No competencies parsed in this category.</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default SkillInsights;
