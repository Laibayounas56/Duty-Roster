import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { generateRoomId } from '../models/dataModels';
import './styles.css';

const RoomsManager = ({ rooms, setRooms, slotRooms, setSlotRooms, generatedRoster, setGeneratedRoster }) => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [roomError, setRoomError] = useState('');

  const handleAdd = () => {
    if (!roomName.trim()) return;
    
    // Check if room name already exists (case-insensitive)
    const nameExists = rooms.some(r => r.name.toLowerCase() === roomName.trim().toLowerCase());
    if (nameExists) {
      setRoomError('A room with this name already exists');
      return;
    }
    
    const newRoom = {
      id: generateRoomId(rooms),
      name: roomName.trim()
    };
    
    setRooms([...rooms, newRoom]);
    setRoomName('');
    setShowModal(false);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setRoomName(room.name);
    setShowModal(true);
  };

  const handleUpdate = () => {
    if (!roomName.trim()) return;
    
    // Check if room name already exists (excluding current room)
    const nameExists = rooms.some(r => 
      r.id !== editingRoom.id && r.name.toLowerCase() === roomName.trim().toLowerCase()
    );
    if (nameExists) {
      setRoomError('A room with this name already exists');
      return;
    }
    
    setRooms(rooms.map(r => 
      r.id === editingRoom.id ? { ...r, name: roomName.trim() } : r
    ));
    
    setRoomName('');
    setEditingRoom(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    // Remove room from rooms list
    setRooms(rooms.filter(r => r.id !== deleteId));
    
    // Remove room from all slot room assignments
    if (slotRooms && setSlotRooms) {
      const updatedSlotRooms = {};
      Object.keys(slotRooms).forEach(slotId => {
        updatedSlotRooms[slotId] = slotRooms[slotId].filter(roomId => roomId !== deleteId);
      });
      setSlotRooms(updatedSlotRooms);
    }
    
    // Clear generated roster since room data has changed
    if (generatedRoster && setGeneratedRoster) {
      setGeneratedRoster(null);
    }
    
    setShowConfirm(false);
    setDeleteId(null);
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setRoomName('');
    setRoomError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setRoomName('');
    setRoomError('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Rooms</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-text">No rooms added yet. Click "Add Room" to get started.</div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Room Name</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn icon-btn-edit" onClick={() => handleEdit(room)}>
                      ✏️
                    </button>
                    <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(room.id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingRoom ? 'Edit Room' : 'Add Room'}
              </h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Room Name</label>
              <input
                type="text"
                className="form-input"
                value={roomName}
                onChange={e => {
                  setRoomName(e.target.value);
                  setRoomError('');
                }}
                placeholder="e.g., N3, Lab 1, etc."
                autoFocus
              />
            </div>

            {roomError && (
              <div style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                padding: '10px 12px', 
                backgroundColor: '#fee',
                borderRadius: '6px',
                marginTop: '-4px',
                fontWeight: '500'
              }}>
                ⚠️ {roomError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={editingRoom ? handleUpdate : handleAdd}
                disabled={!roomName.trim()}
              >
                {editingRoom ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this room? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default RoomsManager;
