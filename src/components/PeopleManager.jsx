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

  const handleAdd = () => {
    if (!name.trim()) return;
    
    if (editingPerson) {
      // Update existing person
      setPeople(people.map(p => 
        p.id === editingPerson.id 
          ? {
              ...p,
              name: name.trim(),
              type,
              subRole: type === PERSON_TYPES.FACULTY ? subRole : null,
              preferredDays: type === PERSON_TYPES.FACULTY ? preferredDays : []
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
        preferredDays: type === PERSON_TYPES.FACULTY ? preferredDays : []
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
        <h2 className="card-title">👥 People (Invigilators)</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Person
        </button>
      </div>

      {people.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">No people added yet. Click "Add Person" to get started.</div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Sub-Role</th>
              <th>Preferred Days</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person.id}>
                <td><strong>{person.name}</strong></td>
                <td>
                  <span className={`badge ${person.type === PERSON_TYPES.LOWER_STAFF ? 'badge-info' : 'badge-success'}`}>
                    {person.type}
                  </span>
                </td>
                <td>{person.subRole || '-'}</td>
                <td>
                  {person.type === PERSON_TYPES.LOWER_STAFF 
                    ? 'All Days' 
                    : person.preferredDays.length > 0 
                      ? person.preferredDays.map(d => d.substring(0, 3)).join(', ')
                      : 'None'
                  }
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn icon-btn-edit" onClick={() => handleEdit(person)}>
                      ✏️ Edit
                    </button>
                    <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(person.id)}>
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <option value={PERSON_TYPES.LOWER_STAFF}>{PERSON_TYPES.LOWER_STAFF}</option>
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
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
                disabled={!name.trim()}
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
