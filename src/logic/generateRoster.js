// Main roster generation logic

import { PERSON_TYPES, isPersonAvailableOnDay } from '../models/dataModels';

// Generate the duty roster by assigning people to rooms
export const generateRoster = (slots, slotRooms, rooms, people) => {
  // Set up tracking
  const roster = {};
  const dutyCount = {};
  const slotAssignments = {};
  const warnings = [];
  
  // Start with zero duties for everyone
  people.forEach(person => {
    dutyCount[person.id] = 0;
  });
  
  // Split staff and faculty
  const staff = people.filter(p => p.type === PERSON_TYPES.STAFF);
  const faculty = people.filter(p => p.type === PERSON_TYPES.FACULTY);
  
  // PHASE A: Assign with strict preferred days
  slots.forEach(slot => {
    const selectedRoomIds = slotRooms[slot.id] || [];
    roster[slot.id] = {};
    slotAssignments[slot.id] = new Set(); // Track who's assigned in this slot
    
    // Get rooms used in this slot
    const slotRoomsList = rooms.filter(room => selectedRoomIds.includes(room.id));
    
    // Assign people to each room (strict preferred days)
    slotRoomsList.forEach(room => {
      const assignment = assignPeopleToRoom(
        slot,
        room,
        staff,
        faculty,
        dutyCount,
        slotAssignments[slot.id],
        true // respectPreferredDays = true
      );
      
      roster[slot.id][room.id] = assignment;
    });
  });
  
  // PHASE B: Fallback to fill incomplete slots (ignore preferred days)
  slots.forEach(slot => {
    const selectedRoomIds = slotRooms[slot.id] || [];
    const slotRoomsList = rooms.filter(room => selectedRoomIds.includes(room.id));
    
    slotRoomsList.forEach(room => {
      const currentAssignment = roster[slot.id][room.id];
      
      // Process all incomplete assignments and try to fill remaining roles.
      if (!isAssignmentComplete(currentAssignment)) {
        const updatedAssignment = fillPendingAssignment(
          currentAssignment,
          slot,
          room,
          staff,
          faculty,
          dutyCount,
          slotAssignments[slot.id]
        );
        
        roster[slot.id][room.id] = updatedAssignment;
      }
    });
  });

  // Optional diagnostics: explain why any slot is still pending after fallback.
  slots.forEach(slot => {
    const selectedRoomIds = slotRooms[slot.id] || [];
    selectedRoomIds.forEach(roomId => {
      const assignment = roster[slot.id]?.[roomId];
      if (!assignment || isAssignmentComplete(assignment)) {
        return;
      }

      const availableFacultyCount = countAvailableFacultyIgnoringPreferred(
        faculty,
        slot,
        slotAssignments[slot.id],
        dutyCount
      );
      const availableStaffCount = countAvailableStaff(staff, slotAssignments[slot.id]);

      const reason = availableFacultyCount === 0 && availableStaffCount === 0
        ? 'No eligible staff/faculty left for this slot (all are already in this slot or at max duty).'
        : availableFacultyCount === 0
          ? 'No eligible faculty left for this slot (all are already in this slot or at max duty).'
          : 'No valid role combination left after earlier assignments in this slot.';

      warnings.push({
        slotId: slot.id,
        roomId,
        reason
      });

      console.warn(
        `[Roster Warning] Slot ${slot.id}, room ${roomId} is still pending. ${reason}`
      );
    });
  });
  
  return {
    roster,
    dutyCount,
    warnings,
    generatedAt: new Date().toISOString()
  };
};

const isAssignmentComplete = (assignment) => {
  if (!assignment) return false;
  return (assignment.staff && assignment.faculty1) || (assignment.faculty1 && assignment.faculty2);
};

// Assign people to one room
const assignPeopleToRoom = (slot, room, staff, faculty, dutyCount, slotAssigned, respectPreferredDays = true) => {
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
    const facultyMember = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount, respectPreferredDays);
    if (facultyMember) {
      assignment.faculty1 = facultyMember.id;
      slotAssigned.add(facultyMember.id);
      dutyCount[facultyMember.id]++;
      assignment.status = 'complete';
    }
  } else {
    // No staff available, use 2 faculty
    const faculty1 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount, respectPreferredDays);
    if (faculty1) {
      assignment.faculty1 = faculty1.id;
      slotAssigned.add(faculty1.id);
      dutyCount[faculty1.id]++;
      
      const faculty2 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount, respectPreferredDays);
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
const findAvailableFaculty = (faculty, slot, slotAssigned, dutyCount, respectPreferredDays = true) => {
  // Sort by maximum duty count in DESCENDING order - higher capacity faculty first
  const sortedFaculty = [...faculty].sort((a, b) => {
    const aMax = a.maxDutyCount || 0;
    const bMax = b.maxDutyCount || 0;
    return bMax - aMax; // Descending order
  });
  
  return sortedFaculty.find(fac => {
    // Can't be in two rooms at once
    if (slotAssigned.has(fac.id)) return false;
    
    // Check if available on this day (only if respectPreferredDays is true)
    if (respectPreferredDays && !isPersonAvailableOnDay(fac, slot.date)) return false;
    
    // Check per-person duty limit
    const limit = fac.maxDutyCount;
    if (limit !== null && limit !== undefined && dutyCount[fac.id] >= limit) {
      return false;
    }
    
    return true;
  });
};

// Fill pending assignment in Phase B (fallback without preferred days)
const fillPendingAssignment = (assignment, slot, room, staff, faculty, dutyCount, slotAssigned) => {
  const updatedAssignment = { ...assignment };
  
  // Always try staff first when missing. This lets us complete partial cases
  // like faculty1-only by converting them to staff + faculty1.
  if (!updatedAssignment.staff) {
    const availableStaff = findAvailableStaff(staff, slot, slotAssigned);
    if (availableStaff) {
      updatedAssignment.staff = availableStaff.id;
      slotAssigned.add(availableStaff.id);
      dutyCount[availableStaff.id]++;
    }
  }
  
  // Fill missing faculty positions (ignore preferred days in fallback).
  if (!updatedAssignment.faculty1) {
    const faculty1 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount, false);
    if (faculty1) {
      updatedAssignment.faculty1 = faculty1.id;
      slotAssigned.add(faculty1.id);
      dutyCount[faculty1.id]++;
    }
  }
  
  if (!updatedAssignment.faculty2 && !updatedAssignment.staff) {
    // Only need faculty2 if no staff (2-faculty pattern)
    const faculty2 = findAvailableFaculty(faculty, slot, slotAssigned, dutyCount, false);
    if (faculty2) {
      updatedAssignment.faculty2 = faculty2.id;
      slotAssigned.add(faculty2.id);
      dutyCount[faculty2.id]++;
    }
  }
  
  // Update status
  updatedAssignment.status = isAssignmentComplete(updatedAssignment) ? 'complete' : 'pending';
  
  return updatedAssignment;
};

const countAvailableFacultyIgnoringPreferred = (faculty, slot, slotAssigned, dutyCount) => {
  return faculty.filter(fac => {
    if (slotAssigned.has(fac.id)) return false;

    const limit = fac.maxDutyCount;
    if (limit !== null && limit !== undefined && dutyCount[fac.id] >= limit) {
      return false;
    }

    return true;
  }).length;
};

const countAvailableStaff = (staff, slotAssigned) => {
  return staff.filter(staffMember => !slotAssigned.has(staffMember.id)).length;
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
