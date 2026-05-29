import React, { useState } from 'react';
import { Bookmark, FileText, Trash2, Eye, Calendar, Award } from 'lucide-react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';

export const ResumeHistory = ({ history, setActiveTab, setSelectedResume, onToast, refreshHistory }) => {
  const { token, getAuthHeaders } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  const handleSelect = (resume) => {
    setSelectedResume(resume);
    setActiveTab('analyze');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent row selection trigger
    if (!window.confirm('Are you sure you want to delete this resume analysis record?')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const resData = await response.json();
      
      if (resData.success) {
        onToast('Analysis record deleted successfully!', 'success');
        refreshHistory();
      } else {
        throw new Error(resData.message || 'Failed to delete the record.');
      }
    } catch (err) {
      onToast(`Delete failed: ${err.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Informational Intro */}
      <div className="glass-panel" style={{ padding: 24 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bookmark size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Saved Analysis History</span>
        </h3>
        <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.85rem', marginTop: 6, lineHeight: 1.45 }}>
          Review and audit previously analyzed candidates. Clicking on a record loads it directly into the active workbench details.
        </p>
      </div>

      {/* RENDER CHRONOLOGICAL RESUMES TIMELINE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {history.map((resume) => (
          <div 
            key={resume._id}
            className="glass-panel-interactive"
            onClick={() => handleSelect(resume)}
            style={{ 
              padding: '20px 24px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              gap: 20, 
              cursor: 'pointer' 
            }}
          >
            {/* Left file icon */}
            <div className="card-icon-wrapper" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--accent-primary)', marginBottom: 0 }}>
              <FileText size={22} />
            </div>

            {/* Title & Date */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4 }}>{resume.filename}</h3>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: 'rgb(var(--text-tertiary-rgb))', fontSize: '0.75rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Award size={12} />
                  <span style={{ color: resume.analysis?.overallScore >= 80 ? 'var(--accent-success)' : 'var(--accent-warning)', fontWeight: 600 }}>
                    Score: {resume.analysis?.overallScore}/100
                  </span>
                </span>
              </div>
            </div>

            {/* Target Job description summary snippet if exists */}
            {resume.jobDescription && (
              <div style={{ minWidth: 220, maxWidth: 320, padding: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 6, fontSize: '0.75rem', color: 'rgb(var(--text-secondary-rgb))', border: '1px solid rgba(255,255,255,0.02)' }}>
                <span style={{ fontWeight: 700, fontSize: '0.7rem', color: 'var(--accent-secondary)', textTransform: 'uppercase' }}>Target Position:</span>
                <p style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: 2 }}>{resume.jobDescription}</p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', alignItems: 'center' }}>
              <button 
                onClick={() => handleSelect(resume)}
                className="theme-toggle-btn"
                style={{ borderRadius: 8, width: 36, height: 36 }}
                aria-label="View Resume Analysis"
              >
                <Eye size={16} />
              </button>
              
              <button 
                onClick={(e) => handleDelete(e, resume._id)}
                disabled={deletingId === resume._id}
                className="theme-toggle-btn"
                style={{ borderRadius: 8, width: 36, height: 36, color: 'var(--accent-error)', borderColor: deletingId === resume._id ? 'transparent' : 'rgba(239, 68, 68, 0.2)' }}
                aria-label="Delete Record"
              >
                {deletingId === resume._id ? (
                  <div className="btn-spinner" style={{ width: 14, height: 14, borderThickness: 1, borderColor: '#ef4444', borderTopColor: '#fff' }} />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))', border: '1px dashed rgba(var(--border-glass-rgb), 0.1)', borderRadius: 16 }}>
            No saved resume analysis sessions located. Use "Resume Analysis" to upload one!
          </div>
        )}
      </div>

    </div>
  );
};
export default ResumeHistory;
