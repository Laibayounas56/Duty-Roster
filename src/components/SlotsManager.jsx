import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import TimePicker from './TimePicker';
import { generateSlotId } from '../models/dataModels';
import './styles.css';
import { formatDateHuman, getDayName, structuredToISODate, isoDateToStructured, getMonthOptions, convertTo24Hour, convertTo12Hour, validate12HourTime } from '../utils/dateHelpers';

const SlotsManager = ({ slots, setSlots, rooms, slotRooms, setSlotRooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [label, setLabel] = useState('');
  const [timeError, setTimeError] = useState('');
  
  const monthOptions = getMonthOptions();
  
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleAdd = () => {
    // Clear previous errors
    setTimeError('');
    
    // Ensure all fields are filled
    if (!day || !month || !year || !startTime || !endTime || !label.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Validate time format (should already be valid from TimePicker component)
    if (!validate12HourTime(startTime) || !validate12HourTime(endTime)) {
      setTimeError('Invalid time format');
      return;
    }
    
    // Convert to 24-hour for storage
    const startTime24 = convertTo24Hour(startTime);
    const endTime24 = convertTo24Hour(endTime);
    
    if (!startTime24 || !endTime24) {
      setTimeError('Invalid time format');
      return;
    }
    
    // Validate end time is after start time
    const [startHr, startMin] = startTime24.split(':').map(Number);
    const [endHr, endMin] = endTime24.split(':').map(Number);
    const startMinutes = startHr * 60 + startMin;
    const endMinutes = endHr * 60 + endMin;
    
    if (endMinutes <= startMinutes) {
      setTimeError('End time must be after start time');
      return;
    }
    
    // Parse numeric values
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    
    // Validate numeric fields
    if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
      alert('Invalid date values');
      return;
    }
    
    const date = structuredToISODate(dayNum, monthNum, yearNum);
    
    if (editMode) {
      // Update existing slot - store in 24-hour format
      setSlots(slots.map(s => 
        s.id === editingSlotId 
          ? { ...s, date, startTime: startTime24, endTime: endTime24, label: label.trim() }
          : s
      ));
    } else {
      // Add new slot - store in 24-hour format
      const newSlot = {
        id: generateSlotId(slots),
        date,
        startTime: startTime24,
        endTime: endTime24,
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
    // Convert from 24-hour storage to 12-hour display
    setStartTime(convertTo12Hour(slot.startTime));
    setEndTime(convertTo12Hour(slot.endTime));
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setSlots(slots.filter(s => s.id !== deleteId));
    // Remove slot room assignments
    const newSlotRooms = { ...slotRooms };
    delete newSlotRooms[deleteId];
    setSlotRooms(newSlotRooms);
    setShowConfirm(false);
    setDeleteId(null);
  };

  const openRoomSelector = (slot) => {
    setCurrentSlot(slot);
    // Filter out any room IDs that no longer exist in the rooms array
    const validRoomIds = (slotRooms[slot.id] || []).filter(roomId => 
      rooms.some(room => room.id === roomId)
    );
    setSelectedRooms(validRoomIds);
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
    setTimeError('');
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
                  <td>{convertTo12Hour(slot.startTime)} - {convertTo12Hour(slot.endTime)}</td>
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
                  <option value="" disabled>Month</option>
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

            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={(time) => {
                setStartTime(time);
                setTimeError('');
              }}
            />

            <TimePicker
              label="End Time"
              value={endTime}
              onChange={(time) => {
                setEndTime(time);
                setTimeError('');
              }}
            />

            {timeError && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                padding: '10px 12px', 
                backgroundColor: '#fee',
                borderRadius: '6px',
                marginTop: '-4px',
                fontWeight: '500'
              }}>
                ⚠️ {timeError}
              </div>
            )}

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

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this slot? All room assignments for this slot will also be removed."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default SlotsManager;
