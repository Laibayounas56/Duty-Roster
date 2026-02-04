import React, { useEffect } from 'react';
import './styles.css';

const SuccessNotification = ({ message, details, onClose, autoClose = true }) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px',
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        borderLeft: '4px solid #3B82F6',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
      }}>
        <div style={{
          fontSize: '24px',
          color: '#3B82F6',
          flexShrink: 0
        }}>
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: '700',
            fontSize: '15px',
            color: '#1E3A8A',
            marginBottom: details ? '8px' : '0'
          }}>
            {message}
          </div>
          {details && (
            <div style={{
              fontSize: '13px',
              color: '#64748B',
              lineHeight: '1.5'
            }}>
              {details}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '0',
            lineHeight: '1',
            flexShrink: 0
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;
