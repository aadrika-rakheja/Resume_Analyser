import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? (
        <CheckCircle size={20} style={{ minWidth: 20 }} />
      ) : (
        <AlertCircle size={20} style={{ minWidth: 20 }} />
      )}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      <button className="toast-close-btn" onClick={onClose} aria-label="Close toast">
        <X size={16} />
      </button>
    </div>
  );
};
