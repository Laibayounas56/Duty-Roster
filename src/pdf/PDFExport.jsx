import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { PERSON_TYPES } from '../models/dataModels';
import { formatDateHuman, getDayName } from '../utils/dateHelpers';

// PDF Styles - 
const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  // Header styles
  mainTitle: {
    fontSize: 24,
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: 15,
  },
  headerDivider: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    marginBottom: 25,
  },
  // Slot page header
  dayDateHeader: {
    fontSize: 14,
    fontWeight: 800,
    marginBottom: 8,
  },
  slotTimeHeader: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 5,
  },
  // Section headings
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 8,
  },
  // Table styles
  table: {
    display: 'table',
    width: '100%',
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1.5,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    borderRightWidth: 1,
    borderRightColor: '#000',
    lineHeight: 1.4,
  },
  tableCellLast: {
    padding: 8,
    fontSize: 10,
    lineHeight: 1.4,
  },
  tableCellHeader: {
    padding: 10,
    fontSize: 11,
    fontWeight: 700,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableCellHeaderLast: {
    padding: 10,
    fontSize: 11,
    fontWeight: 700,
  },
  // Detail block styles
  detailBlock: {
    marginBottom: 25,
    padding: 0,
  },
  detailName: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 5,
  },
  detailInfo: {
    fontSize: 10,
    marginBottom: 12,
  },
  detailTable: {
    display: 'table',
    width: '100%',
    marginTop: 5,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  // Summary page styles
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
  },
  summaryCard: {
    width: '48%',
    marginBottom: 20,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  summaryLabel: {
    fontSize: 10,
    marginBottom: 5,
    color: '#333',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 800,
    color: '#000',
  },
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 35,
    left: 50,
    right: 50,
    textAlign: 'center',
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 8,
  },
});

// Reusable Page Header Component - Shows on Each Slot Page
const SlotPageHeader = ({ day, date, slotLabel, slotTime }) => (
  <View>
    <Text style={styles.mainTitle}>EXAMINATION DUTY ROSTER</Text>
    <View style={styles.headerDivider} />
    <Text style={styles.dayDateHeader}>({day}, {date})</Text>
    <Text style={styles.slotTimeHeader}>{slotLabel}</Text>
    <Text style={styles.slotTimeHeader}>{slotTime}</Text>
  </View>
);

// Summary Page Header Component
const SummaryPageHeader = () => (
  <View>
    <Text style={styles.mainTitle}>EXAMINATION DUTY ROSTER</Text>
    <View style={styles.headerDivider} />
    <Text style={styles.sectionTitle}>ROSTER SUMMARY</Text>
  </View>
);

// Summary Card Component
const SummaryCard = ({ label, value }) => (
  <View style={styles.summaryCard}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue}>{value}</Text>
  </View>
);

// Section Header Component
const SectionPageHeader = ({ title }) => (
  <View>
    <Text style={styles.mainTitle}>EXAMINATION DUTY ROSTER</Text>
    <View style={styles.headerDivider} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// Page Footer Component
const PageFooter = ({ pageNumber }) => (
  <View style={styles.footer} fixed>
    <Text>Page {pageNumber}</Text>
  </View>
);

// Slot Table Component - Clean Table for Each Slot
const SlotTable = ({ slotRoomAssignments, rooms, getRoomById, getPersonById }) => {
  const roomIds = Object.keys(slotRoomAssignments);
  
  if (roomIds.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>No assignments for this slot</Text>;
  }

  return (
    <View style={styles.table} wrap={false}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCellHeader, { width: '18%' }]}>Room</Text>
        <Text style={[styles.tableCellHeader, { width: '27%' }]}>Staff</Text>
        <Text style={[styles.tableCellHeader, { width: '27%' }]}>Faculty 1</Text>
        <Text style={[styles.tableCellHeaderLast, { width: '28%' }]}>Faculty 2</Text>
      </View>
      {roomIds.map((roomId, index) => {
        const assignment = slotRoomAssignments[roomId];
        const room = getRoomById(roomId);
        const staff = assignment.staff ? getPersonById(assignment.staff) : null;
        const faculty1 = assignment.faculty1 ? getPersonById(assignment.faculty1) : null;
        const faculty2 = assignment.faculty2 ? getPersonById(assignment.faculty2) : null;
        const isLast = index === roomIds.length - 1;

        return (
          <View key={roomId} style={isLast ? styles.tableRowLast : styles.tableRow}>
            <Text style={[styles.tableCell, { width: '18%' }]}>
              {room && room.name ? room.name : (rooms.length > 0 ? `ID: ${roomId}` : '—')}
            </Text>
            <Text style={[styles.tableCell, { width: '27%' }]}>{staff?.name || '—'}</Text>
            <View style={[styles.tableCell, { width: '27%' }]}>
              {faculty1 ? (
                <View>
                  <Text>{faculty1.name}</Text>
                  {faculty1.subRole && <Text style={{ fontSize: 9 }}>({faculty1.subRole})</Text>}
                </View>
              ) : (
                <Text>—</Text>
              )}
            </View>
            <View style={[styles.tableCellLast, { width: '28%' }]}>
              {faculty2 ? (
                <View>
                  <Text>{faculty2.name}</Text>
                  {faculty2.subRole && <Text style={{ fontSize: 9 }}>({faculty2.subRole})</Text>}
                </View>
              ) : (
                <Text>—</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Faculty Detail Block Component
const FacultyDetailBlock = ({ person, duties, dutyCount }) => (
  <View style={styles.detailBlock} wrap={false}>
    <Text style={styles.detailName}>{person.name}</Text>
    <Text style={styles.detailInfo}>
      Designation: {person.subRole || 'Faculty'} | Total Duties: {dutyCount[person.id] || 0}
    </Text>
    <View style={styles.detailTable}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCellHeader, { width: '40%' }]}>Date</Text>
        <Text style={[styles.tableCellHeader, { width: '35%' }]}>Time</Text>
        <Text style={[styles.tableCellHeaderLast, { width: '25%' }]}>Room</Text>
      </View>
      {duties.map((duty, index) => {
        const isLast = index === duties.length - 1;
        return (
          <View key={index} style={isLast ? styles.tableRowLast : styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>
              {getDayName(duty.slot.date)}, {formatDateHuman(duty.slot.date)}
            </Text>
            <Text style={[styles.tableCell, { width: '35%' }]}>
              {duty.slot.startTime} – {duty.slot.endTime}
            </Text>
            <Text style={[styles.tableCellLast, { width: '25%' }]}>{duty.room?.name || '—'}</Text>
          </View>
        );
      })}
    </View>
  </View>
);

// Staff Detail Block Component
const StaffDetailBlock = ({ person, duties, dutyCount }) => (
  <View style={styles.detailBlock} wrap={false}>
    <Text style={styles.detailName}>{person.name}</Text>
    <Text style={styles.detailInfo}>
      Role: {person.subRole || 'Staff'} | Total Duties: {dutyCount[person.id] || 0}
    </Text>
    <View style={styles.detailTable}>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableCellHeader, { width: '40%' }]}>Date</Text>
        <Text style={[styles.tableCellHeader, { width: '35%' }]}>Time</Text>
        <Text style={[styles.tableCellHeaderLast, { width: '25%' }]}>Room</Text>
      </View>
      {duties.map((duty, index) => {
        const isLast = index === duties.length - 1;
        return (
          <View key={index} style={isLast ? styles.tableRowLast : styles.tableRow}>
            <Text style={[styles.tableCell, { width: '40%' }]}>
              {getDayName(duty.slot.date)}, {formatDateHuman(duty.slot.date)}
            </Text>
            <Text style={[styles.tableCell, { width: '35%' }]}>
              {duty.slot.startTime} – {duty.slot.endTime}
            </Text>
            <Text style={[styles.tableCellLast, { width: '25%' }]}>{duty.room?.name || '—'}</Text>
          </View>
        );
      })}
    </View>
  </View>
);

// PDF Document Component
const RosterPDF = ({ rosterData, slots, rooms, people }) => {
  const { roster, dutyCount } = rosterData;

  const getPersonById = (id) => people.find(p => p.id === id);
  const getRoomById = (id) => rooms.find(r => r.id === id);

  // Collect duties for each person
  const getDutiesForPerson = (person) => {
    const duties = [];
    slots.forEach(slot => {
      const slotRoomAssignments = roster[slot.id] || {};
      Object.keys(slotRoomAssignments).forEach(roomId => {
        const assignment = slotRoomAssignments[roomId];
        if (assignment.staff === person.id || 
            assignment.faculty1 === person.id || 
            assignment.faculty2 === person.id) {
          const room = getRoomById(roomId);
          duties.push({ slot, room });
        }
      });
    });
    return duties;
  };

  const facultyMembers = people.filter(p => p.type === PERSON_TYPES.FACULTY && dutyCount[p.id] > 0);
  const staffMembers = people.filter(p => p.type === PERSON_TYPES.STAFF && dutyCount[p.id] > 0);

  // Calculate summary statistics
  let totalSlotRoomPairs = 0;
  let completeAssignments = 0;
  
  Object.values(roster).forEach(slotRooms => {
    Object.values(slotRooms).forEach(assignment => {
      totalSlotRoomPairs++;
      if (assignment.status === 'complete') {
        completeAssignments++;
      }
    });
  });

  const pendingAssignments = totalSlotRoomPairs - completeAssignments;
  const totalFaculty = people.filter(p => p.type === PERSON_TYPES.FACULTY).length;
  const totalStaff = people.filter(p => p.type === PERSON_TYPES.STAFF).length;

  let pageNum = 1;

  return (
    <Document>
      {/* SUMMARY PAGE - FIRST PAGE */}
      <Page size="A4" style={styles.page}>
        <SummaryPageHeader />
        
        <View style={styles.summaryContainer}>
          <SummaryCard label="Total Slots" value={slots.length} />
          <SummaryCard label="Total Slot–Room Pairs" value={totalSlotRoomPairs} />
          <SummaryCard label="Complete Assignments" value={completeAssignments} />
          <SummaryCard label="Pending Assignments" value={pendingAssignments} />
          <SummaryCard label="Total Faculty Members" value={totalFaculty} />
          <SummaryCard label="Total Staff Members" value={totalStaff} />
        </View>

        <PageFooter pageNumber={pageNum++} />
      </Page>

      {/* MAIN ROSTER SECTION - ONE SLOT = ONE PAGE */}
      {slots.map((slot) => {
        const slotRoomAssignments = roster[slot.id] || {};
        const roomIds = Object.keys(slotRoomAssignments);
        
        // Skip empty slots
        if (roomIds.length === 0) return null;

        return (
          <Page key={slot.id} size="A4" style={styles.page}>
            <SlotPageHeader 
              day={getDayName(slot.date)}
              date={formatDateHuman(slot.date)}
              slotLabel={slot.label}
              slotTime={`${slot.startTime} – ${slot.endTime}`}
            />
            
            <SlotTable 
              slotRoomAssignments={slotRoomAssignments}
              rooms={rooms}
              getRoomById={getRoomById}
              getPersonById={getPersonById}
            />

            <PageFooter pageNumber={pageNum++} />
          </Page>
        );
      })}

      {/* FACULTY DUTY DETAILS SECTION */}
      {facultyMembers.length > 0 && (
        <Page size="A4" style={styles.page}>
          <SectionPageHeader title="FACULTY DUTY DETAILS" />
          
          {facultyMembers.map((faculty) => {
            const duties = getDutiesForPerson(faculty);
            return (
              <FacultyDetailBlock 
                key={faculty.id}
                person={faculty}
                duties={duties}
                dutyCount={dutyCount}
              />
            );
          })}

          <PageFooter pageNumber={pageNum++} />
        </Page>
      )}

      {/* STAFF DUTY DETAILS SECTION */}
      {staffMembers.length > 0 && (
        <Page size="A4" style={styles.page}>
          <SectionPageHeader title="STAFF DUTY DETAILS" />
          
          {staffMembers.map((staff) => {
            const duties = getDutiesForPerson(staff);
            return (
              <StaffDetailBlock 
                key={staff.id}
                person={staff}
                duties={duties}
                dutyCount={dutyCount}
              />
            );
          })}

          <PageFooter pageNumber={pageNum++} />
        </Page>
      )}

      {/* WORKLOAD SUMMARY TABLE */}
      <Page size="A4" style={styles.page}>
        <SectionPageHeader title="WORKLOAD SUMMARY" />
        
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, { width: '40%' }]}>Name</Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>Type</Text>
            <Text style={[styles.tableCellHeader, { width: '20%' }]}>Duty Limit</Text>
            <Text style={[styles.tableCellHeaderLast, { width: '20%' }]}>Assigned Duties</Text>
          </View>
          {people
            .filter(p => dutyCount[p.id] > 0)
            .sort((a, b) => (dutyCount[b.id] || 0) - (dutyCount[a.id] || 0))
            .map((person, index, arr) => {
              const isLast = index === arr.length - 1;
              const dutyLimitDisplay = person.type === PERSON_TYPES.STAFF 
                ? 'All Days' 
                : (person.maxDutyCount || '—');
              return (
                <View key={person.id} style={isLast ? styles.tableRowLast : styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '40%' }]}>{person.name}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{person.type}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{dutyLimitDisplay}</Text>
                  <Text style={[styles.tableCellLast, { width: '20%' }]}>{dutyCount[person.id] || 0}</Text>
                </View>
              );
            })}
        </View>

        <PageFooter pageNumber={pageNum} />
      </Page>
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
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFExportButton;
