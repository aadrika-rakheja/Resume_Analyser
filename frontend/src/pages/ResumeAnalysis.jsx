import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Sparkles, 
  RefreshCw,
  FolderOpen,
  Eye,
  CheckSquare
} from 'lucide-react';
import { UploadZone } from '../components/UploadZone';
import { CircularProgress } from '../components/CircularProgress';

const Linkedin = ({ size = 16, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Github = ({ size = 16, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export const ResumeAnalysis = ({ selectedResume, setSelectedResume, onToast, refreshHistory }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [activeSegment, setActiveSegment] = useState('breakdown'); // breakdown, text, details

  const handleUploadSuccess = (resumeRecord) => {
    setSelectedResume(resumeRecord);
    refreshHistory();
  };

  const handleClearSelected = () => {
    setSelectedResume(null);
  };

  const analysis = selectedResume?.analysis || {};
  const contact = selectedResume?.contact || {};
  const skills = selectedResume?.skills || { technical: [], tools: [], soft: [] };

  const breakdownMetrics = [
    { name: 'ATS Friendliness', value: analysis.atsFriendliness || 0, desc: 'Structure & hierarchy compliance' },
    { name: 'Skill Relevance', value: analysis.skillRelevance || 0, desc: 'Hard skill richness density' },
    { name: 'Formatting Quality', value: analysis.formattingQuality || 0, desc: 'Length, margins, and headers clean' },
    { name: 'Experience Quality', value: analysis.experienceQuality || 0, desc: 'Action verbs & metrics presence' },
    { name: 'Project Relevance', value: analysis.projectRelevance || 0, desc: 'Technical projects complexity' },
    { name: 'Keyword Alignment', value: analysis.keywordOptimization || 0, desc: 'Overlap with target description' },
    { name: 'Grammar & Readability', value: analysis.grammarReadability || 0, desc: 'Typographical clarity & syntax' }
  ];

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      {!selectedResume ? (
        // RENDER FILE UPLOAD FORM IF NO RESUME SELECTED
        <div className="layout-split">
          
          {/* Target Job Description Area */}
          <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={18} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>1. Target Job Description</h3>
            </div>
            <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem' }}>
              Paste the target job description details below. This activates highly-calibrated keyword mapping and Jaccard-overlap scores!
            </p>
            <textarea 
              rows="12"
              placeholder="Paste target job specification details here (e.g. Roles, required tech stack: React, TypeScript, Docker)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              style={{ resize: 'none', lineHeight: 1.45 }}
            />
          </div>

          {/* Upload Engine Area */}
          <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} style={{ color: 'var(--accent-secondary)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>2. Upload Resume Document</h3>
            </div>
            <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem' }}>
              Select a standard Microsoft Word (DOCX) or Adobe Acrobat (PDF) resume document.
            </p>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <UploadZone 
                onUploadSuccess={handleUploadSuccess} 
                jobDescription={jobDescription} 
                onToast={onToast} 
              />
            </div>
          </div>

        </div>
      ) : (
        // RENDER ACTIVE DETAILS VIEWS IF RESUME LOADED
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Top details card */}
          <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="card-icon-wrapper" style={{ background: 'var(--grad-hero)', color: 'white', marginBottom: 0 }}>
                <FileText size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedResume.filename}</h2>
                <span style={{ fontSize: '0.75rem', color: 'rgb(var(--text-tertiary-rgb))' }}>
                  Audited on: {new Date(selectedResume.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
              <button 
                onClick={handleClearSelected}
                className="theme-toggle-btn"
                style={{ borderRadius: 8, width: 'auto', padding: '0 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={14} />
                <span>Scan Another</span>
              </button>
            </div>
          </div>

          {/* Primary Split: Circular Gauge & breakdown lists */}
          <div className="layout-split">
            
            {/* Big circular progress block */}
            <div className="glass-panel" style={{ padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <CircularProgress score={analysis.overallScore} label="ATS COMPLIANT" />
              
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>Recruiter Diagnostic Insight</h3>
                <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', lineHeight: 1.45, maxWidth: 300 }}>
                  {analysis.recruiterInsights || 'The profile demonstrates adequate formatting checks. Optimize keyword density to maximize placement matches.'}
                </p>
              </div>
            </div>

            {/* Quick Contact links */}
            <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Candidate Contact Header</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {contact.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span style={{ wordBreak: 'break-all' }}>{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Phone size={16} style={{ color: 'var(--accent-secondary)' }} />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.linkedin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Linkedin size={16} style={{ color: 'var(--accent-primary)' }} />
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>LinkedIn Profile</a>
                  </div>
                )}
                {contact.github && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Github size={16} style={{ color: 'rgb(var(--text-primary-rgb))' }} />
                    <a href={contact.github} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>GitHub Repository</a>
                  </div>
                )}
                {contact.portfolio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem' }}>
                    <Globe size={16} style={{ color: 'var(--accent-success)' }} />
                    <a href={contact.portfolio} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>Portfolio Site</a>
                  </div>
                )}
                {!contact.email && !contact.phone && !contact.linkedin && (
                  <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-tertiary-rgb))' }}>No header contact details parsed.</span>
                )}
              </div>
            </div>

          </div>

          {/* Details navigation segment buttons */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid rgba(var(--border-glass-rgb), var(--border-glass-alpha))', paddingBottom: 10 }}>
            <button 
              className={`sidebar-item ${activeSegment === 'breakdown' ? 'active' : ''}`}
              onClick={() => setActiveSegment('breakdown')}
              style={{ background: 'none', border: 'none', padding: '8px 16px', borderRadius: 8 }}
            >
              Score Breakdown
            </button>
            <button 
              className={`sidebar-item ${activeSegment === 'details' ? 'active' : ''}`}
              onClick={() => setActiveSegment('details')}
              style={{ background: 'none', border: 'none', padding: '8px 16px', borderRadius: 8 }}
            >
              Extracted Resume Data
            </button>
            <button 
              className={`sidebar-item ${activeSegment === 'text' ? 'active' : ''}`}
              onClick={() => setActiveSegment('text')}
              style={{ background: 'none', border: 'none', padding: '8px 16px', borderRadius: 8 }}
            >
              View Document Text
            </button>
          </div>

          {/* Dynamic view segments */}
          {activeSegment === 'breakdown' && (
            <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ATS Breakdown Matrices</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {breakdownMetrics.map((metric, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{metric.name}</span>
                        <p style={{ fontSize: '0.75rem', color: 'rgb(var(--text-tertiary-rgb))' }}>{metric.desc}</p>
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: metric.value >= 80 ? 'var(--accent-success)' : metric.value >= 60 ? 'var(--accent-warning)' : 'var(--accent-error)', marginLeft: 'auto' }}>
                        {metric.value}/100
                      </span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'rgba(var(--border-glass-rgb), 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          background: metric.value >= 80 ? 'var(--accent-success)' : metric.value >= 60 ? 'var(--accent-warning)' : 'var(--accent-error)', 
                          width: `${metric.value}%`, 
                          borderRadius: 99,
                          transition: 'width 0.8s ease'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSegment === 'text' && (
            <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Raw Extracted Document Text</h3>
              <div 
                style={{ 
                  maxHeight: 400, 
                  overflowY: 'auto', 
                  background: 'rgba(0, 0, 0, 0.15)', 
                  padding: 20, 
                  borderRadius: 8, 
                  fontFamily: 'monospace', 
                  fontSize: '0.85rem', 
                  lineHeight: 1.6, 
                  whiteSpace: 'pre-wrap', 
                  border: '1px solid rgba(var(--border-glass-rgb), 0.06)' 
                }}
              >
                {selectedResume.parsedText}
              </div>
            </div>
          )}

          {activeSegment === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Experience blocks */}
              <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Work Experience History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedResume.experience?.map((exp, idx) => (
                    <div key={idx} style={{ borderLeft: '2px solid var(--accent-primary)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'between', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{exp.role}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', marginLeft: 'auto' }}>{exp.duration}</span>
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgb(var(--text-secondary-rgb))' }}>{exp.company}</span>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.45, color: 'rgb(var(--text-secondary-rgb))', marginTop: 4 }}>{exp.details}</p>
                    </div>
                  ))}
                  {(!selectedResume.experience || selectedResume.experience.length === 0) && (
                    <span style={{ color: 'rgb(var(--text-tertiary-rgb))', fontSize: '0.9rem' }}>No formal experience records parsed.</span>
                  )}
                </div>
              </div>

              {/* Education blocks */}
              <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Education Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedResume.education?.map((edu, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'between', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{edu.degree}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary-rgb))' }}>{edu.school}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: 'auto' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{edu.year}</span>
                        <span style={{ fontSize: '0.75rem', color: 'rgb(var(--text-tertiary-rgb))' }}>GPA: {edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                  {(!selectedResume.education || selectedResume.education.length === 0) && (
                    <span style={{ color: 'rgb(var(--text-tertiary-rgb))', fontSize: '0.9rem' }}>No education milestones parsed.</span>
                  )}
                </div>
              </div>

              {/* Projects blocks */}
              <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Key Projects</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {selectedResume.projects?.map((proj, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{proj.name}</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {proj.tech?.map((t, i) => (
                          <span key={i} className="chat-suggestion-tag" style={{ padding: '2px 8px', fontSize: '0.7rem', cursor: 'default' }}>{t}</span>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.85rem', lineHeight: 1.4, color: 'rgb(var(--text-secondary-rgb))' }}>{proj.details}</p>
                    </div>
                  ))}
                  {(!selectedResume.projects || selectedResume.projects.length === 0) && (
                    <span style={{ color: 'rgb(var(--text-tertiary-rgb))', fontSize: '0.9rem' }}>No project portfolios parsed.</span>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};
export default ResumeAnalysis;
