import React, { useEffect, useState } from 'react';

export const CircularProgress = ({ score = 0, label = 'ATS SCORE' }) => {
  const [offset, setOffset] = useState(314.159); // Total circumference for r=50

  useEffect(() => {
    // Standard delay to trigger visual transition on load
    const timer = setTimeout(() => {
      const percentage = Math.min(Math.max(score, 0), 100);
      const calculatedOffset = 314.159 - (314.159 * percentage) / 100;
      setOffset(calculatedOffset);
    }, 100);

    return () => clearTimeout(timer);
  }, [score]);

  // Determine colors based on score tiers
  const getGradientColors = () => {
    if (score >= 80) return { start: '#10b981', end: '#059669' }; // Green
    if (score >= 60) return { start: '#f59e0b', end: '#d97706' }; // Amber
    return { start: '#ef4444', end: '#dc2626' }; // Red
  };

  const colors = getGradientColors();

  return (
    <div className="circular-gauge-wrapper">
      <svg className="gauge-svg" width="130" height="130" viewBox="0 0 120 120">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          className="gauge-bg"
          cx="60"
          cy="60"
          r="50"
          strokeWidth="10"
        />

        {/* Progress Fill */}
        <circle
          className="gauge-fill"
          cx="60"
          cy="60"
          r="50"
          strokeWidth="10"
          strokeDasharray="314.159"
          strokeDashoffset={offset}
        />
      </svg>

      {/* Centered Typography Details */}
      <div className="gauge-text">
        <span>{score}</span>
        <span className="gauge-label">{label}</span>
      </div>
    </div>
  );
};
export default CircularProgress;
