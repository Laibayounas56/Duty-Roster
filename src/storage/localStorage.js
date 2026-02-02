// Save and load data from browser storage

const STORAGE_KEYS = {
  ROOMS: 'duty_roster_rooms',
  SLOTS: 'duty_roster_slots',
  SLOT_ROOMS: 'duty_roster_slot_rooms',
  PEOPLE: 'duty_roster_people',
  ROSTER: 'duty_roster_generated'
};

// Basic save/load functions
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export const clearStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Save/load each type of data
export const saveRooms = (rooms) => saveToStorage(STORAGE_KEYS.ROOMS, rooms);
export const loadRooms = () => loadFromStorage(STORAGE_KEYS.ROOMS, []);

export const saveSlots = (slots) => saveToStorage(STORAGE_KEYS.SLOTS, slots);
export const loadSlots = () => loadFromStorage(STORAGE_KEYS.SLOTS, []);

export const saveSlotRooms = (slotRooms) => saveToStorage(STORAGE_KEYS.SLOT_ROOMS, slotRooms);
export const loadSlotRooms = () => loadFromStorage(STORAGE_KEYS.SLOT_ROOMS, {});

export const savePeople = (people) => saveToStorage(STORAGE_KEYS.PEOPLE, people);
export const loadPeople = () => loadFromStorage(STORAGE_KEYS.PEOPLE, []);

export const saveRoster = (roster) => saveToStorage(STORAGE_KEYS.ROSTER, roster);
export const loadRoster = () => loadFromStorage(STORAGE_KEYS.ROSTER, null);

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => clearStorage(key));
};
