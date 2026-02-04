import React from 'react';
import './styles.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>

        <div style={{ padding: '24px 0', fontSize: '15px', color: '#475569', lineHeight: '1.6' }}>
          {message}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            style={{ minWidth: '100px' }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={onConfirm}
            style={{ minWidth: '100px' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
