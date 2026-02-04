// Main roster generation logic

import { PERSON_TYPES, isPersonAvailableOnDay } from '../models/dataModels';

// Generate the duty roster by assigning people to rooms
export const generateRoster = (slots, slotRooms, rooms, people) => {
  // Set up tracking
  const roster = {};
  const dutyCount = {};
  const slotAssignments = {};
  
  // Start with zero duties for everyone
  people.forEach(person => {
    dutyCount[person.id] = 0;
  });
  
  // Split staff and faculty
  const staff = people.filter(p => p.type === PERSON_TYPES.STAFF);
  const faculty = people.filter(p => p.type === PERSON_TYPES.FACULTY);
  
  // Go through each slot
  slots.forEach(slot => {
    const selectedRoomIds = slotRooms[slot.id] || [];
    roster[slot.id] = {};
    slotAssignments[slot.id] = new Set(); // Track who's assigned in this slot
    
    // Get rooms used in this slot
    const slotRoomsList = rooms.filter(room => selectedRoomIds.includes(room.id));
    
    // Assign people to each room
    slotRoomsList.forEach(room => {
      const assignment = assignPeopleToRoom(
        slot,
        room,
        staff,
        faculty,
        dutyCount,
        slotAssignments[slot.id]
      );
      
      roster[slot.id][room.id] = assignment;
    });
  });
  
  return {
    roster,
    dutyCount,
    generatedAt: new Date().toISOString()
  };
};

// Assign people to one room
const assignPeopleToRoom = (slot, room, staff, faculty, dutyCount, slotAssigned) => {
  const assignment = {
    staff: null,
    faculty1: null,
    faculty2: null,
    status: 'pending' // 'complete' or 'pending'
  };
  
  // Try to find staff first
  const availableStaff = findAvailableStaff(staff, slot, slotAssigned);
  
  if (availableStaff) {
    // Normal: 1 staff + 1 faculty
    assignment.staff = availableStaff.id;
    slotAssigned.add(availableStaff.id);
    dutyCount[availableStaff.id]++;
    
    // Find 1 faculty
    const facultyMember = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount);
    if (facultyMember) {
      assignment.faculty1 = facultyMember.id;
      slotAssigned.add(facultyMember.id);
      dutyCount[facultyMember.id]++;
      assignment.status = 'complete';
    }
  } else {
    // No staff available, use 2 faculty
    const faculty1 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount);
    if (faculty1) {
      assignment.faculty1 = faculty1.id;
      slotAssigned.add(faculty1.id);
      dutyCount[faculty1.id]++;
      
      const faculty2 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount);
      if (faculty2) {
        assignment.faculty2 = faculty2.id;
        slotAssigned.add(faculty2.id);
        dutyCount[faculty2.id]++;
        assignment.status = 'complete';
      }
    }
  }
  
  return assignment;
};

// Find available staff
const findAvailableStaff = (staff, slot, slotAssigned) => {
  return staff.find(staffMember => {
    // Can't be in two rooms at once
    if (slotAssigned.has(staffMember.id)) return false;
    
    // Staff are available all days
    return true;
  });
};

// Find available faculty
const findAvailableFaculty = (faculty, slot, slotAssigned, dutyCount) => {
  // Sort by duty count - assign to people with fewer duties first
  const sortedFaculty = [...faculty].sort((a, b) => {
    return dutyCount[a.id] - dutyCount[b.id];
  });
  
  return sortedFaculty.find(fac => {
    // Can't be in two rooms at once
    if (slotAssigned.has(fac.id)) return false;
    
    // Check if available on this day
    if (!isPersonAvailableOnDay(fac, slot.date)) return false;
    
    // Check per-person duty limit
    const limit = fac.maxDutyCount;
    if (limit !== null && limit !== undefined && dutyCount[fac.id] >= limit) {
      return false;
    }
    
    return true;
  });
};

// Calculate stats from roster
export const getRosterStats = (rosterData, people, slots, rooms) => {
  const { roster, dutyCount } = rosterData;
  
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
  
  const staffDuties = people
    .filter(p => p.type === PERSON_TYPES.STAFF)
    .reduce((sum, p) => sum + (dutyCount[p.id] || 0), 0);
    
  const facultyDuties = people
    .filter(p => p.type === PERSON_TYPES.FACULTY)
    .reduce((sum, p) => sum + (dutyCount[p.id] || 0), 0);
  
  return {
    totalSlots: slots.length,
    totalRooms: rooms.length,
    totalAssignments,
    completeAssignments,
    pendingAssignments,
    staffDuties,
    facultyDuties,
    totalPeople: people.length
  };
};
