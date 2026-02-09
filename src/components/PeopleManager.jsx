import React, { useState } from 'react';
import { PERSON_TYPES, FACULTY_SUB_ROLES, DAYS_OF_WEEK, generatePersonId } from '../models/dataModels';
import ConfirmModal from './ConfirmModal';
import { formatDaysDisplay } from '../utils/daysHelper';
import './styles.css';

const PeopleManager = ({ people, setPeople }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [name, setName] = useState('');
  const [type, setType] = useState(PERSON_TYPES.FACULTY);
  const [subRole, setSubRole] = useState(FACULTY_SUB_ROLES[0]);
  const [daysMode, setDaysMode] = useState('ALL');
  const [preferredDays, setPreferredDays] = useState([]);
  const [maxDutyCount, setMaxDutyCount] = useState('');
  const [showDaysSelector, setShowDaysSelector] = useState(false);
  const [tempSelectedDays, setTempSelectedDays] = useState([]);
  const [daySelectionError, setDaySelectionError] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    
    // Validate maxDutyCount for Faculty
    if (type === PERSON_TYPES.FACULTY) {
      const dutyCountNum = parseInt(maxDutyCount, 10);
      if (!maxDutyCount || isNaN(dutyCountNum) || dutyCountNum <= 0) {
        return; // Silently prevent submission if invalid
      }
      
      // Validate preferred days selection
      if (daysMode === 'PREFERRED' && preferredDays.length === 0) {
        setDaySelectionError('Please select at least one preferred day');
        return;
      }
    }
    
    if (editingPerson) {
      // Update existing person
      setPeople(people.map(p => 
        p.id === editingPerson.id 
          ? {
              ...p,
              name: name.trim(),
              type,
              subRole: type === PERSON_TYPES.FACULTY ? subRole : null,
              daysMode: type === PERSON_TYPES.FACULTY ? daysMode : null,
              preferredDays: type === PERSON_TYPES.FACULTY ? (daysMode === 'ALL' ? [] : preferredDays) : [],
              maxDutyCount: type === PERSON_TYPES.FACULTY ? parseInt(maxDutyCount, 10) : null
            }
          : p
      ));
    } else {
      // Add new person
      const newPerson = {
        id: generatePersonId(people, type),
        name: name.trim(),
        type,
        subRole: type === PERSON_TYPES.FACULTY ? subRole : null,
        daysMode: type === PERSON_TYPES.FACULTY ? daysMode : null,
        preferredDays: type === PERSON_TYPES.FACULTY ? (daysMode === 'ALL' ? [] : preferredDays) : [],
        maxDutyCount: type === PERSON_TYPES.FACULTY ? parseInt(maxDutyCount, 10) : null
      };
      setPeople([...people, newPerson]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (person) => {
    setEditingPerson(person);
    setName(person.name);
    setType(person.type);
    setSubRole(person.subRole || FACULTY_SUB_ROLES[0]);
    setDaysMode(person.daysMode || (person.preferredDays && person.preferredDays.length > 0 ? 'PREFERRED' : 'ALL'));
    setPreferredDays(person.preferredDays || []);
    setMaxDutyCount(person.maxDutyCount ? person.maxDutyCount.toString() : '');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setPeople(people.filter(p => p.id !== deleteId));
    setShowConfirm(false);
    setDeleteId(null);
  };

  const toggleDay = (day) => {
    if (tempSelectedDays.includes(day)) {
      setTempSelectedDays(tempSelectedDays.filter(d => d !== day));
    } else {
      setTempSelectedDays([...tempSelectedDays, day]);
    }
  };

  const openDaysSelector = () => {
    setTempSelectedDays(preferredDays);
    setShowDaysSelector(true);
    setDaySelectionError('');
  };

  const handleSaveDaysSelection = () => {
    if (tempSelectedDays.length === 0) {
      setDaySelectionError('Please select at least one day');
      return;
    }
    setPreferredDays(tempSelectedDays);
    setShowDaysSelector(false);
    setDaySelectionError('');
  };

  const handleDaysModeChange = (mode) => {
    setDaysMode(mode);
    setDaySelectionError('');
    if (mode === 'ALL') {
      setPreferredDays([]);
    } else if (mode === 'PREFERRED') {
      openDaysSelector();
    }
  };

  const resetForm = () => {
    setName('');
    setType(PERSON_TYPES.FACULTY);
    setSubRole(FACULTY_SUB_ROLES[0]);
    setDaysMode('ALL');
    setPreferredDays([]);
    setMaxDutyCount('');
    setEditingPerson(null);
    setDaySelectionError('');
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"> People (Invigilators)</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Person
        </button>
      </div>

      {people.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">No people added yet. Click "Add Person" to get started.</div>
        </div>
      ) : (
        <>
          {/* Staff Table */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               Staff Members
            </h3>
            {people.filter(p => p.type === PERSON_TYPES.STAFF).length === 0 ? (
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', color: '#6b7280', fontSize: '14px' }}>
                No staff members added yet
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Availability</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {people.filter(p => p.type === PERSON_TYPES.STAFF).map(person => (
                    <tr key={person.id}>
                      <td><strong>{person.name}</strong></td>
                      <td>
                        <span className="badge badge-info">
                          {person.type}
                        </span>
                      </td>
                      <td>All Days</td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn icon-btn-edit" onClick={() => handleEdit(person)}>
                            ✏️
                            </button>
                            <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(person.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Faculty Table */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               Faculty Members
            </h3>
            {people.filter(p => p.type === PERSON_TYPES.FACULTY).length === 0 ? (
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', color: '#6b7280', fontSize: '14px' }}>
                No faculty members added yet
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Sub-Role</th>
                    <th>Preferred Days</th>
                    <th>Max Duties</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {people.filter(p => p.type === PERSON_TYPES.FACULTY).map(person => (
                    <tr key={person.id}>
                      <td><strong>{person.name}</strong></td>
                      <td>
                        <span className="badge badge-success">
                          {person.type}
                        </span>
                      </td>
                      <td>{person.subRole || '-'}</td>
                      <td>
                        {person.daysMode === 'ALL' || !person.preferredDays || person.preferredDays.length === 0
                          ? 'All Days'
                          : formatDaysDisplay(person.preferredDays)}
                      </td>
                      <td>
                        <span className="badge badge-info">{person.maxDutyCount || 0}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="icon-btn icon-btn-edit" onClick={() => handleEdit(person)}>
                            ✏️
                          </button>
                          <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(person.id)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Add Person Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingPerson ? 'Edit Person' : 'Add Person'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value={PERSON_TYPES.FACULTY}>{PERSON_TYPES.FACULTY}</option>
                <option value={PERSON_TYPES.STAFF}>{PERSON_TYPES.STAFF}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>

            {type === PERSON_TYPES.FACULTY && (
              <>
                <div className="form-group">
                  <label className="form-label">Sub-Role</label>
                  <select
                    className="form-select"
                    value={subRole}
                    onChange={e => setSubRole(e.target.value)}
                  >
                    {FACULTY_SUB_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Days Preference</label>
                  <select
                    className="form-select"
                    value={daysMode}
                    onChange={e => handleDaysModeChange(e.target.value)}
                  >
                    <option value="ALL">All Days</option>
                    <option value="PREFERRED">Preferred Days</option>
                  </select>
                  {daysMode === 'PREFERRED' && preferredDays.length > 0 && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#059669', fontWeight: '500' }}>
                      ✓ Selected: {formatDaysDisplay(preferredDays)}
                    </div>
                  )}
                  {daySelectionError && (
                    <div style={{ 
                      color: '#dc3545', 
                      fontSize: '14px', 
                      padding: '10px 12px', 
                      backgroundColor: '#fee',
                      borderRadius: '6px',
                      marginTop: '8px',
                      fontWeight: '500'
                    }}>
                      ⚠️ {daySelectionError}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Maximum Duty Count *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={maxDutyCount}
                    onChange={e => setMaxDutyCount(e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    required
                  />
                  <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Maximum number of duties this faculty member can be assigned
                  </small>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
                disabled={!name.trim() || (type === PERSON_TYPES.FACULTY && !maxDutyCount)}
              >
                {editingPerson ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Days Selection Modal */}
      {showDaysSelector && (
        <div className="modal-overlay" onClick={() => setShowDaysSelector(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select Preferred Days</h3>
              <button className="modal-close" onClick={() => setShowDaysSelector(false)}>×</button>
            </div>

            <div style={{ marginBottom: '20px', color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
              Selected: {tempSelectedDays.length} / {DAYS_OF_WEEK.length}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {DAYS_OF_WEEK.map(day => {
                const isSelected = tempSelectedDays.includes(day);
                return (
                  <div
                    key={day}
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #3B82F6' : '2px solid #E2E8F0',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      color: isSelected ? '#1E3A8A' : '#64748B',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#93C5FD';
                        e.currentTarget.style.background = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.background = '#FFFFFF';
                      }
                    }}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {daySelectionError && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                padding: '10px 12px', 
                backgroundColor: '#fee',
                borderRadius: '6px',
                marginBottom: '16px',
                fontWeight: '500'
              }}>
                ⚠️ {daySelectionError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDaysSelector(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveDaysSelection}>
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this person? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default PeopleManager;
