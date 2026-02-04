import React from 'react';
import { PERSON_TYPES } from '../models/dataModels';
import './styles.css';
import { formatDateHuman, getDayName } from '../utils/dateHelpers';

const RosterView = ({ rosterData, slots, rooms, people, onExportPDF, onBack }) => {
  const { roster, dutyCount } = rosterData;

  const getPersonById = (id) => people.find(p => p.id === id);
  const getRoomById = (id) => rooms.find(r => r.id == id); // Use == to handle string/number comparison

  // Calculate stats
  let totalAssignments = 0;
  let completeAssignments = 0;
  let pendingAssignments = 0;

  Object.values(roster).forEach(slotRooms => {
    Object.values(slotRooms).forEach(assignment => {
      totalAssignments++;
      if (assignment.status === 'complete') {
        completeAssignments++;
      } else {
        pendingAssignments++;
      }
    });
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title" style={{ fontSize: '24px' }}>📋 Generated Roster</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-success" onClick={onExportPDF}>
              📄 Export PDF
            </button>
            <button className="btn btn-secondary" onClick={onBack}>
              ← Back to Setup
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', borderRadius: '12px', border: '2px solid #93c5fd' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e40af' }}>
              {totalAssignments}
            </div>
            <div style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: '600', marginTop: '4px' }}>Total Assignments</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', borderRadius: '12px', border: '2px solid #6ee7b7' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#065f46' }}>
              {completeAssignments}
            </div>
            <div style={{ fontSize: '13px', color: '#064e3b', fontWeight: '600', marginTop: '4px' }}>Complete</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderRadius: '12px', border: '2px solid #fcd34d' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#92400e' }}>
              {pendingAssignments}
            </div>
            <div style={{ fontSize: '13px', color: '#78350f', fontWeight: '600', marginTop: '4px' }}>Pending</div>
          </div>
        </div>
      </div>

      {/* Slot-wise Roster */}
      {slots.map(slot => {
        const slotRoomAssignments = roster[slot.id] || {};
        const roomIds = Object.keys(slotRoomAssignments);
        
        if (roomIds.length === 0) return null;

        return (
          <div key={slot.id} className="card">
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#1f2937' }}>
              {slot.label}
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                📅 {formatDateHuman(slot.date)}
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                {getDayName(slot.date)} | ⏰ {slot.startTime} - {slot.endTime}
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Staff</th>
                  <th>Faculty 1</th>
                  <th>Faculty 2</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roomIds.map(roomId => {
                  const assignment = slotRoomAssignments[roomId];
                  const room = getRoomById(roomId);
                  const staff = assignment.staff ? getPersonById(assignment.staff) : null;
                  const faculty1 = assignment.faculty1 ? getPersonById(assignment.faculty1) : null;
                  const faculty2 = assignment.faculty2 ? getPersonById(assignment.faculty2) : null;

                  return (
                    <tr key={roomId}>
                      <td><strong>{room?.name || 'Unknown'}</strong></td>
                      <td>{staff ? staff.name : <span style={{ color: '#dc3545' }}>-</span>}</td>
                      <td>{faculty1 ? `${faculty1.name} (${faculty1.subRole})` : <span style={{ color: '#dc3545' }}>-</span>}</td>
                      <td>{faculty2 ? `${faculty2.name} (${faculty2.subRole})` : '-'}</td>
                      <td>
                        <span className={`badge ${assignment.status === 'complete' ? 'badge-success' : 'badge-warning'}`}>
                          {assignment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}

      {/* Workload Summary */}
      <div className="card">
        <h2 className="card-title" style={{ fontSize: '20px' }}>📊 Workload Summary</h2>
        
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Sub-Role</th>
              <th>Duties Assigned</th>
            </tr>
          </thead>
          <tbody>
            {people
              .filter(p => dutyCount[p.id] > 0)
              .sort((a, b) => (dutyCount[b.id] || 0) - (dutyCount[a.id] || 0))
              .map(person => (
                <tr key={person.id}>
                  <td><strong>{person.name}</strong></td>
                  <td>
                    <span className={`badge ${person.type === PERSON_TYPES.STAFF ? 'badge-info' : 'badge-success'}`}>
                      {person.type}
                    </span>
                  </td>
                  <td>{person.subRole || '-'}</td>
                  <td>
                    <strong style={{ fontSize: '16px', color: '#007bff' }}>
                      {dutyCount[person.id] || 0}
                    </strong>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RosterView;
