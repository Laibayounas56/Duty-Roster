import React, { useState } from 'react';
import './styles.css';

const RoomsManager = ({ rooms, setRooms }) => {
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);

  const handleAdd = () => {
    if (!roomName.trim()) return;
    
    const newRoom = {
      id: Date.now() + Math.random(),
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
    
    setRooms(rooms.map(r => 
      r.id === editingRoom.id ? { ...r, name: roomName.trim() } : r
    ));
    
    setRoomName('');
    setEditingRoom(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(rooms.filter(r => r.id !== id));
    }
  };

  const openAddModal = () => {
    setEditingRoom(null);
    setRoomName('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRoom(null);
    setRoomName('');
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">📍 Rooms</h2>
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
                      ✏️ Edit
                    </button>
                    <button className="icon-btn icon-btn-delete" onClick={() => handleDelete(room.id)}>
                      🗑️ Delete
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
                onChange={e => setRoomName(e.target.value)}
                placeholder="e.g., N3, Lab 1, etc."
                autoFocus
              />
            </div>

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
    </div>
  );
};

export default RoomsManager;
