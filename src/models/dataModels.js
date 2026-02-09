// Types and constants for our data

export const PERSON_TYPES = {
  STAFF: 'Staff',
  FACULTY: 'Faculty'
};

export const FACULTY_SUB_ROLES = [
  'Assistant Professor',
  'Associate Professor',
  'Lecturer',
  'Teaching Fellow',
  'Professor'
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Helper functions to generate simple sequential IDs
export const generateRoomId = (existingRooms) => {
  const maxNum = existingRooms.reduce((max, room) => {
    const match = room.id.match(/^room-(\d+)$/);
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  return `room-${maxNum + 1}`;
};

export const generateSlotId = (existingSlots) => {
  const maxNum = existingSlots.reduce((max, slot) => {
    const match = slot.id.match(/^slot-(\d+)$/);
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  return `slot-${maxNum + 1}`;
};

export const generatePersonId = (existingPeople, type) => {
  const prefix = type === PERSON_TYPES.STAFF ? 'staff' : 'faculty';
  const sametype = existingPeople.filter(p => p.type === type);
  const maxNum = sametype.reduce((max, person) => {
    const match = person.id.match(new RegExp(`^${prefix}-(\\d+)$`));
    return match ? Math.max(max, parseInt(match[1])) : max;
  }, 0);
  return `${prefix}-${maxNum + 1}`;
};

// Helper functions to create data objects
export const createRoom = (name) => ({
  id: Date.now() + Math.random(),
  name
});

export const createSlot = (date, startTime, endTime, label) => ({
  id: Date.now() + Math.random(),
  date,
  startTime,
  endTime,
  label
});

export const createPerson = (name, type, subRole = null, daysMode = 'ALL', preferredDays = [], maxDutyCount = null) => ({
  id: Date.now() + Math.random(),
  name,
  type,
  subRole, // Only for Faculty
  daysMode, // Only for Faculty: 'ALL' or 'PREFERRED'
  preferredDays, // Only for Faculty
  maxDutyCount // Only for Faculty - maximum duties they can be assigned
});



// Check availability and dates
export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

export const isPersonAvailableOnDay = (person, dateString) => {
  if (person.type === PERSON_TYPES.STAFF) {
    return true; // Staff available all days
  }
  
  // Handle new daysMode field (ALL or PREFERRED)
  if (person.daysMode === 'ALL') {
    return true;
  }
  
  //Check preferredDays array
  if (!person.preferredDays || person.preferredDays.length === 0) {
  // if no days specified, assume all days
    return person.daysMode ? false : true;
  }
  
  const dayOfWeek = getDayOfWeek(dateString);
  return person.preferredDays.includes(dayOfWeek);
};
