import React, { useState } from 'react';
import { PERSON_TYPES, FACULTY_SUB_ROLES, DAYS_OF_WEEK } from '../models/dataModels';
import './styles.css';

const PeopleManager = ({ people, setPeople }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  
  const [name, setName] = useState('');
  const [type, setType] = useState(PERSON_TYPES.FACULTY);
  const [subRole, setSubRole] = useState(FACULTY_SUB_ROLES[0]);
  const [preferredDays, setPreferredDays] = useState([]);
  const [maxDutyCount, setMaxDutyCount] = useState('');

  const handleAdd = () => {
    if (!name.trim()) return;
    
    // Validate maxDutyCount for Faculty
    if (type === PERSON_TYPES.FACULTY) {
      const dutyCountNum = parseInt(maxDutyCount, 10);
      if (!maxDutyCount || isNaN(dutyCountNum) || dutyCountNum <= 0) {
        alert('Please enter a valid maximum duty count (positive number) for Faculty members.');
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
              preferredDays: type === PERSON_TYPES.FACULTY ? preferredDays : [],
              maxDutyCount: type === PERSON_TYPES.FACULTY ? parseInt(maxDutyCount, 10) : null
            }
          : p
      ));
    } else {
      // Add new person
      const newPerson = {
        id: Date.now() + Math.random(),
        name: name.trim(),
        type,
        subRole: type === PERSON_TYPES.FACULTY ? subRole : null,
        preferredDays: type === PERSON_TYPES.FACULTY ? preferredDays : [],
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
    setPreferredDays(person.preferredDays || []);
    setMaxDutyCount(person.maxDutyCount ? person.maxDutyCount.toString() : '');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      setPeople(people.filter(p => p.id !== id));
    }
  };

  const toggleDay = (day) => {
    if (preferredDays.includes(day)) {
      setPreferredDays(preferredDays.filter(d => d !== day));
    } else {
      setPreferredDays([...preferredDays, day]);
    }
  };

  const resetForm = () => {
    setName('');
    setType(PERSON_TYPES.FACULTY);
    setSubRole(FACULTY_SUB_ROLES[0]);
    setPreferredDays([]);
    setMaxDutyCount('');
    setEditingPerson(null);
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
                        {person.preferredDays.length > 0 
                          ? person.preferredDays.map(d => d.substring(0, 3)).join(', ')
                          : 'None'
                        }
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
                  <label className="form-label">Preferred Days</label>
                  <div className="checkbox-group">
                    {DAYS_OF_WEEK.map(day => (
                      <label key={day} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferredDays.includes(day)}
                          onChange={() => toggleDay(day)}
                        />
                        {day}
                      </label>
                    ))}
                  </div>
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
    </div>
  );
};

export default PeopleManager;
