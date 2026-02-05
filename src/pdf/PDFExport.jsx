import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { PERSON_TYPES } from '../models/dataModels';
import { formatDateHuman, getDayName } from '../utils/dateHelpers';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  table: {
    display: 'table',
    width: '100%',
    marginBottom: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
  },
  slotHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  statLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  pageBreak: {
    marginTop: 20,
    pageBreakBefore: 'always',
  },
});

// PDF Document Component
const RosterPDF = ({ rosterData, slots, rooms, people }) => {
  const { roster, dutyCount } = rosterData;

  const getPersonById = (id) => people.find(p => p.id === id);
  const getRoomById = (id) => rooms.find(r => r.id === id);

  // Calculate stats
  let totalAssignments = 0;
  let completeAssignments = 0;
  let staffDuties = 0;
  let facultyDuties = 0;

  Object.values(roster).forEach(slotRooms => {
    Object.values(slotRooms).forEach(assignment => {
      totalAssignments++;
      if (assignment.status === 'complete') completeAssignments++;
    });
  });

  people.forEach(person => {
    const duties = dutyCount[person.id] || 0;
    if (person.type === PERSON_TYPES.STAFF) {
      staffDuties += duties;
    } else {
      facultyDuties += duties;
    }
  });

  return (
    <Document>
      {/* Page 1: Summary */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Exam Duty Roster</Text>
        <Text style={{ textAlign: 'center', fontSize: 10, marginBottom: 20, color: '#666' }}>
          Generated on {formatDateHuman(new Date())} at {new Date().toLocaleTimeString()}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{slots.length}</Text>
            <Text style={styles.statLabel}>Total Slots</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{rooms.length}</Text>
            <Text style={styles.statLabel}>Total Rooms</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalAssignments}</Text>
            <Text style={styles.statLabel}>Assignments</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{people.length}</Text>
            <Text style={styles.statLabel}>Total People</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview Statistics</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Metric</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Count</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Complete Assignments</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{completeAssignments}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Pending Assignments</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{totalAssignments - completeAssignments}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Total Staff Duties</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{staffDuties}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Total Faculty Duties</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{facultyDuties}</Text>
          </View>
        </View>

        {/* Workload Summary */}
        <Text style={styles.sectionTitle}>Workload Summary</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Name</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Type</Text>
            <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Sub-Role</Text>
            <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Duties</Text>
          </View>
          {people
            .filter(p => dutyCount[p.id] > 0)
            .sort((a, b) => (dutyCount[b.id] || 0) - (dutyCount[a.id] || 0))
            .map(person => (
              <View key={person.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{person.name}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{person.type}</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>{person.subRole || '-'}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{dutyCount[person.id] || 0}</Text>
              </View>
            ))}
        </View>
      </Page>

      {/* Slot-wise Schedule Pages */}
      {slots.map((slot, slotIndex) => {
        const slotRoomAssignments = roster[slot.id] || {};
        const roomIds = Object.keys(slotRoomAssignments);
        
        if (roomIds.length === 0) return null;

        return (
          <Page key={slot.id} size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>
              {slot.label} - {formatDateHuman(slot.date)}
            </Text>
            <Text style={{ fontSize: 9, marginBottom: 10, color: '#666' }}>
              {getDayName(slot.date)} | Time: {slot.startTime} - {slot.endTime}
            </Text>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold' }]}>Room</Text>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Staff</Text>
                <Text style={[styles.tableCell, { flex: 2.5, fontWeight: 'bold' }]}>Faculty 1</Text>
                <Text style={[styles.tableCell, { flex: 2.5, fontWeight: 'bold' }]}>Faculty 2</Text>
              </View>
              {roomIds.map(roomId => {
                const assignment = slotRoomAssignments[roomId];
                const room = getRoomById(roomId);
                const staff = assignment.staff ? getPersonById(assignment.staff) : null;
                const faculty1 = assignment.faculty1 ? getPersonById(assignment.faculty1) : null;
                const faculty2 = assignment.faculty2 ? getPersonById(assignment.faculty2) : null;

                return (
                  <View key={roomId} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>{room?.name || 'Unknown'}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{staff?.name || '-'}</Text>
                    <Text style={[styles.tableCell, { flex: 2.5 }]}>
                      {faculty1 ? `${faculty1.name} (${faculty1.subRole})` : '-'}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2.5 }]}>
                      {faculty2 ? `${faculty2.name} (${faculty2.subRole})` : '-'}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Page>
        );
      })}

      {/* Individual Duty Slips */}
      {people.filter(p => dutyCount[p.id] > 0).map(person => {
        const duties = [];
        
        // Collect all duties for this person
        slots.forEach(slot => {
          const slotRoomAssignments = roster[slot.id] || {};
          Object.keys(slotRoomAssignments).forEach(roomId => {
            const assignment = slotRoomAssignments[roomId];
            if (assignment.staff === person.id || 
                assignment.faculty1 === person.id || 
                assignment.faculty2 === person.id) {
              const room = getRoomById(roomId);
              duties.push({
                slot,
                room,
                role: assignment.staff === person.id ? 'Staff' : 'Faculty'
              });
            }
          });
        });

        return (
          <Page key={person.id} size="A4" style={styles.page}>
            <Text style={styles.title}>Individual Duty Slip</Text>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              Name: {person.name}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 3, color: '#666' }}>
              Type: {person.type}
            </Text>
            {person.subRole && (
              <Text style={{ fontSize: 10, marginBottom: 10, color: '#666' }}>
                Sub-Role: {person.subRole}
              </Text>
            )}
            <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 10 }}>
              Total Duties: {dutyCount[person.id]}
            </Text>

            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Slot</Text>
                <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold' }]}>Date</Text>
                <Text style={[styles.tableCell, { flex: 1.5, fontWeight: 'bold' }]}>Time</Text>
                <Text style={[styles.tableCell, { flex: 1, fontWeight: 'bold' }]}>Room</Text>
              </View>
              {duties.map((duty, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{duty.slot.label}</Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {formatDateHuman(duty.slot.date)}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.5 }]}>
                    {duty.slot.startTime} - {duty.slot.endTime}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{duty.room?.name || '-'}</Text>
                </View>
              ))}
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

// Export Button Component
const PDFExportButton = ({ rosterData, slots, rooms, people }) => {
  return (
    <PDFDownloadLink
      document={<RosterPDF rosterData={rosterData} slots={slots} rooms={rooms} people={people} />}
      fileName={`duty-roster-${new Date().toISOString().split('T')[0]}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ blob, url, loading, error }) => (
        <button className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Generating PDF...' : '📄 Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFExportButton;
