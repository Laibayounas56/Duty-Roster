import React, { useEffect } from 'react';
import { PERSON_TYPES } from '../models/dataModels';
import './styles.css';
import { formatDateHuman, getDayName, convertTo12Hour } from '../utils/dateHelpers';
import PDFExportButton from '../pdf/PDFExport';

const RosterView = ({ rosterData, slots, rooms, people, onBack }) => {
  const { roster, dutyCount } = rosterData;

  // Scroll to top when roster view is displayed
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getPersonById = (id) => people.find(p => p.id === id);
  const getRoomById = (id) => rooms.find(r => r.id === id);

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
    <div style={{ background: 'linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%)', minHeight: '100vh', paddingBottom: '48px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', width: '100%' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title" style={{ fontSize: '22px' }}> Generated Roster</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <PDFExportButton
              rosterData={rosterData}
              slots={slots}
              rooms={rooms}
              people={people}
            />
            <button className="btn btn-secondary" onClick={onBack}>
              ← Back to Setup
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ 
            background: '#FFFFFF', 
            padding: '32px', 
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #3B82F6',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#1E3A8A', lineHeight: '1' }}>
              {totalAssignments}
            </div>
            <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Assignments</div>
          </div>
          
          <div style={{ 
            background: '#FFFFFF', 
            padding: '32px', 
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #0EA5E9',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#0369A1', lineHeight: '1' }}>
              {completeAssignments}
            </div>
            <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Complete</div>
          </div>
          
          <div style={{ 
            background: '#FFFFFF', 
            padding: '32px', 
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            borderLeft: '4px solid #64748B',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '48px', fontWeight: '800', color: '#475569', lineHeight: '1' }}>
              {pendingAssignments}
            </div>
            <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</div>
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
            <div style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', padding: '24px', margin: '-36px -36px 28px -36px', borderRadius: '12px 12px 0 0', borderBottom: '3px solid #F1F5F9' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: '#1E3A8A' }}>
                {slot.label}
              </h2>
              <div style={{ marginBottom: '0' }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   {formatDateHuman(slot.date)}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span>{getDayName(slot.date)}</span>
                  <span style={{ color: '#CBD5E1' }}>|</span>
                  <span> {convertTo12Hour(slot.startTime)} - {convertTo12Hour(slot.endTime)}</span>
                </div>
              </div>
            </div>

            <div className="table-responsive">
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
                        <td data-label="Room">
                          <strong>
                            {room ? room.name : (
                              <span style={{ color: '#dc3545' }} title={`Room ID: ${roomId} not found`}>
                                Unknown Room
                              </span>
                            )}
                          </strong>
                        </td>
                        <td data-label="Staff">{staff ? staff.name : <span style={{ color: '#dc3545' }}>-</span>}</td>
                        <td data-label="Faculty 1">{faculty1 ? `${faculty1.name} (${faculty1.subRole})` : <span style={{ color: '#dc3545' }}>-</span>}</td>
                        <td data-label="Faculty 2">{faculty2 ? `${faculty2.name} (${faculty2.subRole})` : '-'}</td>
                        <td data-label="Status">
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
          </div>
        );
      })}

      {/* Workload Summary */}
      <div className="card">
        <h2 className="card-title" style={{ fontSize: '20px' }}> Workload Summary</h2>
        
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Sub-Role</th>
                <th>Max Duties</th>
                <th>Duties Assigned</th>
              </tr>
            </thead>
            <tbody>
              {people
                .filter(p => dutyCount[p.id] > 0)
                .sort((a, b) => (dutyCount[b.id] || 0) - (dutyCount[a.id] || 0))
                .map(person => (
                  <tr key={person.id}>
                    <td data-label="Name"><strong>{person.name}</strong></td>
                    <td data-label="Type">
                      <span className={`badge ${person.type === PERSON_TYPES.STAFF ? 'badge-info' : 'badge-success'}`}>
                        {person.type}
                      </span>
                    </td>
                    <td data-label="Sub-Role">{person.subRole || '-'}</td>
                    <td data-label="Max Duties">
                      {person.type === PERSON_TYPES.STAFF ? (
                        <span style={{ color: '#64748B',  }}>Unlimited</span>
                      ) : (
                        person.maxDutyCount ? (
                          <strong style={{ color: '#1E3A8A' }}>{person.maxDutyCount}</strong>
                        ) : (
                          <span style={{ color: '#64748B', }}>Unlimited</span>
                        )
                      )}
                    </td>
                    <td data-label="Duties Assigned">
                      <strong style={{ fontSize: '16px', color: '#1E3A8A' }}>
                        {dutyCount[person.id] || 0}
                      </strong>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RosterView;
