import React, { useState } from 'react';
import './styles.css';

const SlotsManager = ({ slots, setSlots, rooms, slotRooms, setSlotRooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [label, setLabel] = useState('');
  
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleAdd = () => {
    if (!date || !startTime || !endTime || !label.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    const newSlot = {
      id: Date.now() + Math.random(),
      date,
      startTime,
      endTime,
      label: label.trim()
    };
    
    setSlots([...slots, newSlot]);
    resetForm();
    setShowModal(false);
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
    setDate('');
    setStartTime('');
    setEndTime('');
    setLabel('');
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📅 Exam Slots</h2>
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
                  <td>{new Date(slot.date).toLocaleDateString()}</td>
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
                      <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(slot.id)}>
                        🗑️ Delete
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
              <h3 className="modal-title">Add Exam Slot</h3>
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
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
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
                disabled={!date || !startTime || !endTime || !label.trim()}
              >
                Add
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

            <div style={{ marginBottom: '16px' }}>
              <strong>Selected: {selectedRooms.length} / {rooms.length}</strong>
            </div>

            <div className="checkbox-group">
              {rooms.map(room => (
                <label key={room.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedRooms.includes(room.id)}
                    onChange={() => toggleRoom(room.id)}
                  />
                  {room.name}
                </label>
              ))}
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
