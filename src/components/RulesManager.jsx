import React, { useState } from 'react';
import { FACULTY_SUB_ROLES } from '../models/dataModels';
import './styles.css';

const RulesManager = ({ rules, setRules }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(FACULTY_SUB_ROLES[0]);
  const [maxDuties, setMaxDuties] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);

  const handleAdd = () => {
    if (!selectedRole) return;
    
    const newRules = {
      ...rules,
      [selectedRole]: {
        subRole: selectedRole,
        maxDuties: isUnlimited ? null : parseInt(maxDuties) || 0
      }
    };
    
    setRules(newRules);
    resetForm();
    setShowModal(false);
  };

  const handleDelete = (subRole) => {
    if (window.confirm(`Remove duty rule for ${subRole}?`)) {
      const newRules = { ...rules };
      delete newRules[subRole];
      setRules(newRules);
    }
  };

  const resetForm = () => {
    setSelectedRole(FACULTY_SUB_ROLES[0]);
    setMaxDuties('');
    setIsUnlimited(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getAvailableRoles = () => {
    return FACULTY_SUB_ROLES.filter(role => !rules[role]);
  };

  const availableRoles = getAvailableRoles();

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">⚙️ Duty Rules (Faculty)</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          disabled={availableRoles.length === 0}
        >
          + Add Rule
        </button>
      </div>

      {Object.keys(rules).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">
            No duty rules configured yet. Click "Add Rule" to set limits per faculty sub-role.
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Sub-Role</th>
              <th>Max Duties</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(rules).map(rule => (
              <tr key={rule.subRole}>
                <td><strong>{rule.subRole}</strong></td>
                <td>
                  {rule.maxDuties === null || rule.maxDuties === undefined ? (
                    <span className="badge badge-info">Unlimited</span>
                  ) : (
                    <span className="badge badge-success">{rule.maxDuties}</span>
                  )}
                </td>
                <td>
                  <button className="icon-btn" onClick={() => handleDelete(rule.subRole)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Rule Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Duty Rule</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Faculty Sub-Role</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
              >
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isUnlimited}
                  onChange={e => setIsUnlimited(e.target.checked)}
                />
                No Limit (Unlimited)
              </label>
            </div>

            {!isUnlimited && (
              <div className="form-group">
                <label className="form-label">Maximum Duties</label>
                <input
                  type="number"
                  className="form-input"
                  value={maxDuties}
                  onChange={e => setMaxDuties(e.target.value)}
                  placeholder="Enter max duty count"
                  min="0"
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
                disabled={!isUnlimited && (!maxDuties || parseInt(maxDuties) < 0)}
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesManager;
