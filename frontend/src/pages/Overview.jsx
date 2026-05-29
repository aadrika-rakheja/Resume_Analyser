import React from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  UserCheck, 
  BookOpen, 
  ArrowRight,
  Clock
} from 'lucide-react';
import { CircularProgress } from '../components/CircularProgress';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Overview = ({ history, setActiveTab, setSelectedResume }) => {
  
  const totalResumes = history.length;
  
  // Calculate average score
  const avgScore = totalResumes > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.analysis?.overallScore || 0), 0) / totalResumes) 
    : 0;

  // Calculate average keyword match
  const avgKeyword = totalResumes > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.analysis?.keywordMatch?.percentage || 0), 0) / totalResumes)
    : 0;

  // Calculate top score
  const topScore = totalResumes > 0
    ? Math.max(...history.map(r => r.analysis?.overallScore || 0))
    : 0;

  const handleResumeView = (resume) => {
    setSelectedResume(resume);
    setActiveTab('analyze');
  };

  // Setup Chart Data representing parsed resumes timeline
  const chartData = {
    labels: history.slice(0, 6).reverse().map((r, i) => r.filename.slice(0, 10) + '...'),
    datasets: [
      {
        fill: true,
        label: 'Overall ATS Score',
        data: history.slice(0, 6).reverse().map(r => r.analysis?.overallScore || 0),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(6, 182, 212)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
      
      {/* Intro hero pane */}
      <div className="glass-panel" style={{ padding: '30px 40px', background: 'var(--grad-premium)', borderLeft: '4px solid var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: 650 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Ready to Optimize Resumes?</h2>
          <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Upload candidates' profiles, input target Job Descriptions, and get instant recruiter-grade ATS metrics, keyword alignment audits, and professional coaching diagnostics.
          </p>
          <button 
            onClick={() => setActiveTab('analyze')} 
            className="gradient-button"
            style={{ marginTop: 16, padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span>Scan New Resume</span>
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="auth-bg-glow-2" style={{ top: '-10%', right: '-10%', width: '40%', height: '140%', opacity: 0.6 }} />
      </div>

      {/* Grid counters */}
      <div className="dashboard-grid">
        <div className="glass-panel dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
            <div>
              <div className="card-title">TOTAL AUDITED</div>
              <div className="card-value">{totalResumes}</div>
            </div>
            <div className="card-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', marginLeft: 'auto' }}>
              <FileText size={22} />
            </div>
          </div>
          <div className="card-trend up">
            <TrendingUp size={14} />
            <span>Updated in real time</span>
          </div>
        </div>

        <div className="glass-panel dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
            <div>
              <div className="card-title">AVERAGE ATS SCORE</div>
              <div className="card-value">{avgScore}/100</div>
            </div>
            <div className="card-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', marginLeft: 'auto' }}>
              <UserCheck size={22} />
            </div>
          </div>
          <div className="card-trend" style={{ color: avgScore >= 70 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
            <AlertCircle size={14} />
            <span>{avgScore >= 70 ? 'Healthy placement rating' : 'Action items suggested'}</span>
          </div>
        </div>

        <div className="glass-panel dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', width: '100%' }}>
            <div>
              <div className="card-title">TOP MATCH SCORE</div>
              <div className="card-value">{topScore}%</div>
            </div>
            <div className="card-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-secondary)', marginLeft: 'auto' }}>
              <TrendingUp size={22} />
            </div>
          </div>
          <div className="card-trend up">
            <Clock size={14} />
            <span>High precision matching</span>
          </div>
        </div>
      </div>

      {/* Main split display: Line graph & recent list */}
      <div className="layout-split">
        {/* Line Chart Widget */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>ATS Audit Performance History</h3>
            <p style={{ color: 'rgb(var(--text-secondary-rgb))', fontSize: '0.8rem' }}>Score variance over last few analyses</p>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 220 }}>
            {totalResumes > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <span style={{ color: 'rgb(var(--text-tertiary-rgb))', fontSize: '0.9rem' }}>No historical metrics to graph yet. Upload a resume.</span>
            )}
          </div>
        </div>

        {/* Dynamic circular progress & details widget */}
        <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, width: '100%', textAlign: 'left' }}>Global Summary</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <CircularProgress score={avgScore} label="GLOBAL ATS" />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgb(var(--text-secondary-rgb))', lineHeight: 1.4 }}>
            {totalResumes > 0 ? (
              <span>Your saved candidate profiles average **${avgScore}/100**. Leverage our AI Chatbot in the bottom-right for customized structural advice!</span>
            ) : (
              <span>Start uploading resumes to activate structural tracking and recruiter audit pipelines.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recent submissions roster */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Recent Resumes</h3>
        {totalResumes > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 3).map((item) => (
              <div 
                key={item._id} 
                className="glass-panel-interactive" 
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, cursor: 'pointer' }}
                onClick={() => handleResumeView(item)}
              >
                <div className="card-icon-wrapper" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--accent-primary)', marginBottom: 0 }}>
                  <FileText size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.filename}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'rgb(var(--text-tertiary-rgb))' }}>
                    Uploaded on: {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: item.analysis.overallScore >= 80 ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                      Score: {item.analysis.overallScore}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgb(var(--text-tertiary-rgb))' }}>
                      Keywords: {item.analysis.keywordMatch.percentage}%
                    </span>
                  </div>
                  <ChevronRightIcon />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 30, textAlign: 'center', color: 'rgb(var(--text-tertiary-rgb))', border: '1px dashed rgba(var(--border-glass-rgb), 0.1)', borderRadius: 12 }}>
            No saved submissions cataloged yet.
          </div>
        )}
      </div>

    </div>
  );
};

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgb(var(--text-tertiary-rgb))' }}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default Overview;
