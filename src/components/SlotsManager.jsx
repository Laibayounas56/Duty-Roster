import React, { useState } from 'react';
import './styles.css';
import { formatDateHuman, getDayName, structuredToISODate, isoDateToStructured, getMonthOptions } from '../utils/dateHelpers';

const SlotsManager = ({ slots, setSlots, rooms, slotRooms, setSlotRooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [label, setLabel] = useState('');
  
  const monthOptions = getMonthOptions();
  
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleAdd = () => {
    if (!day || !month || !year || !startTime || !endTime || !label.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const date = structuredToISODate(day, month, year);
    
    if (editMode) {
      // Update existing slot
      setSlots(slots.map(s => 
        s.id === editingSlotId 
          ? { ...s, date, startTime, endTime, label: label.trim() }
          : s
      ));
    } else {
      // Add new slot
      const newSlot = {
        id: Date.now() + Math.random(),
        date,
        startTime,
        endTime,
        label: label.trim()
      };
      setSlots([...slots, newSlot]);
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (slot) => {
    setEditMode(true);
    setEditingSlotId(slot.id);
    setLabel(slot.label);
    const { day: d, month: m, year: y } = isoDateToStructured(slot.date);
    setDay(d);
    setMonth(m);
    setYear(y);
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      setSlots(slots.filter(s => s.id !== id));
      // Remove slot room assignments
      const newSlotRooms = { ...slotRooms };
      delete newSlotRooms[id];
      setSlotRooms(newSlotRooms);
    }
  };

  const openRoomSelector = (slot) => {
    setCurrentSlot(slot);
    setSelectedRooms(slotRooms[slot.id] || []);
    setShowRoomSelector(true);
  };

  const handleSaveRoomSelection = () => {
    setSlotRooms({
      ...slotRooms,
      [currentSlot.id]: selectedRooms
    });
    setShowRoomSelector(false);
    setCurrentSlot(null);
    setSelectedRooms([]);
  };

  const toggleRoom = (roomId) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter(id => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const resetForm = () => {
    setDay('');
    setMonth('');
    setYear('');
    setStartTime('');
    setEndTime('');
    setLabel('');
    setEditMode(false);
    setEditingSlotId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"> Exam Slots</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Slot
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">No slots added yet. Click "Add Slot" to get started.</div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Date</th>
              <th>Time</th>
              <th>Rooms Assigned</th>
              <th style={{ width: '200px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map(slot => {
              const assignedCount = (slotRooms[slot.id] || []).length;
              return (
                <tr key={slot.id}>
                  <td><strong>{slot.label}</strong></td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{formatDateHuman(slot.date)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{getDayName(slot.date)}</div>
                  </td>
                  <td>{slot.startTime} - {slot.endTime}</td>
                  <td>
                    <span className={`badge ${assignedCount > 0 ? 'badge-success' : 'badge-warning'}`}>
                      {assignedCount} / {rooms.length}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="icon-btn" 
                        onClick={() => openRoomSelector(slot)}
                        disabled={rooms.length === 0}
                      >
                        🏢 Rooms
                      </button>
                      <button 
                        className="icon-btn" 
                        onClick={() => handleEdit(slot)}
                      >
                        ✏️
                      </button>
                      <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(slot.id)}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Add Slot Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editMode ? 'Edit Exam Slot' : 'Add Exam Slot'}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Slot Label</label>
              <input
                type="text"
                className="form-input"
                value={label}
                onChange={e => setLabel(e.target.value)}
                placeholder="e.g., Slot 1, Morning Session, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  value={day}
                  onChange={e => setDay(e.target.value)}
                  placeholder="Day"
                  min="1"
                  max="31"
                  style={{ flex: '0 0 80px' }}
                />
                <span style={{ color: '#6b7280' }}>|</span>
                <select
                  className="form-input"
                  value={month}
                  onChange={e => setMonth(e.target.value)}
                  style={{ flex: '0 0 100px' }}
                >
                  <option value="">Month</option>
                  {monthOptions.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <span style={{ color: '#6b7280' }}>|</span>
                <input
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="Year"
                  min="2020"
                  max="2099"
                  style={{ flex: '0 0 100px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Start Time (HH:MM)</label>
              <input
                type="text"
                className="form-input"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                placeholder="e.g., 09:00"
                pattern="[0-9]{2}:[0-9]{2}"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time (HH:MM)</label>
              <input
                type="text"
                className="form-input"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                placeholder="e.g., 12:00"
                pattern="[0-9]{2}:[0-9]{2}"
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleAdd}
                disabled={!day || !month || !year || !startTime || !endTime || !label.trim()}
              >
                {editMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Selection Modal */}
      {showRoomSelector && currentSlot && (
        <div className="modal-overlay" onClick={() => setShowRoomSelector(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Select Rooms for {currentSlot.label}</h3>
              <button className="modal-close" onClick={() => setShowRoomSelector(false)}>×</button>
            </div>

            <div style={{ marginBottom: '20px', color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
              Selected: {selectedRooms.length} / {rooms.length}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {rooms.map(room => {
                const isSelected = selectedRooms.includes(room.id);
                return (
                  <div
                    key={room.id}
                    onClick={() => toggleRoom(room.id)}
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
                    {room.name}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setShowRoomSelector(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveRoomSelection}>
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotsManager;
