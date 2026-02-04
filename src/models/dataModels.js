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

export const createPerson = (name, type, subRole = null, preferredDays = [], maxDutyCount = null) => ({
  id: Date.now() + Math.random(),
  name,
  type,
  subRole, // Only for Faculty
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
  
  const dayOfWeek = getDayOfWeek(dateString);
  return person.preferredDays.includes(dayOfWeek);
};
