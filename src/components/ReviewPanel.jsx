import React from 'react';
import './styles.css';

const ReviewPanel = ({ 
  rooms, 
  slots, 
  slotRooms, 
  people, 
  onGenerate,
  generatedRoster 
}) => {
  // Calculate completeness
  const hasRooms = rooms.length > 0;
  const hasSlots = slots.length > 0;
  const hasRoomAssignments = hasSlots && slots.every(slot => 
    slotRooms[slot.id] && slotRooms[slot.id].length > 0
  );
  const hasPeople = people.length > 0;

  const isComplete = hasRooms && hasSlots && hasRoomAssignments && hasPeople;

  const checklistItems = [
    { label: 'Rooms added', complete: hasRooms },
    { label: 'Slots added', complete: hasSlots },
    { label: 'Rooms assigned to slots', complete: hasRoomAssignments },
    { label: 'People added', complete: hasPeople }
  ];

  const totalRoomAssignments = Object.values(slotRooms).reduce((sum, rooms) => sum + rooms.length, 0);

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"> Review & Generate</h2>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
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
            {rooms.length}
          </div>
          <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Rooms</div>
        </div>

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
            {slots.length}
          </div>
          <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Slots</div>
        </div>

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
            {people.length}
          </div>
          <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total People</div>
        </div>

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
            {totalRoomAssignments}
          </div>
          <div style={{ color: '#64748B', marginTop: '12px', fontWeight: '600', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Room-Slot Pairs</div>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ 
        background: '#FFFFFF', 
        padding: '32px', 
        borderRadius: '10px',
        marginBottom: '40px',
        border: '1px solid #E2E8F0',
        borderLeft: '4px solid #3B82F6',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h3 style={{ marginBottom: '24px', fontSize: '17px', fontWeight: '700', color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Setup Checklist
        </h3>
        {checklistItems.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0',
            borderBottom: index < checklistItems.length - 1 ? '1px solid #F1F5F9' : 'none',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            <span style={{ 
              marginRight: '16px', 
              fontSize: '18px',
              color: item.complete ? '#3B82F6' : '#CBD5E1'
            }}>
              {item.complete ? '✓' : '✕'}
            </span>
            <span style={{ color: item.complete ? '#0F172A' : '#94A3B8' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button 
          className="btn btn-primary" 
          onClick={onGenerate}
          disabled={!isComplete}
          style={{ 
            fontSize: '16px',
            padding: '16px 48px',
            boxShadow: isComplete ? '0 4px 8px rgba(30, 58, 138, 0.25)' : 'none'
          }}
        >
          {generatedRoster ? '🔄 Regenerate Roster' : '🚀 Generate Roster'}
        </button>
        {!isComplete && (
          <div style={{ 
            marginTop: '16px', 
            color: '#64748B', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Complete all checklist items to generate roster
          </div>
        )}
      </div>

    </div>
  );
};

export default ReviewPanel;
