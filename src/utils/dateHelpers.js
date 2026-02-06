// Date helpers for better UX

// Returns date like "2 March 2026"
export const formatDateHuman = (date) => {
  if (!date) return 'Invalid Date';
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  
  const day = d.getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${month} ${year}`;
};

// Returns day name like "Monday"
export const getDayName = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return '';
  }
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[d.getDay()];
};

// Convert day/month/year to ISO date string (YYYY-MM-DD)
export const structuredToISODate = (day, month, year) => {
  const monthStr = String(month).padStart(2, '0');
  const dayStr = String(day).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

// Convert ISO date back to day/month/year
export const isoDateToStructured = (isoDate) => {
  const d = new Date(isoDate);
  return {
    day: d.getDate(),
    month: d.getMonth() + 1, // JS months are 0-indexed
    year: d.getFullYear()
  };
};

// Month dropdown options
export const getMonthOptions = () => {
  return [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' }
  ];
};

// Convert 12-hour time (e.g., "01:30 PM") to 24-hour format (e.g., "13:30") for internal storage
export const convertTo24Hour = (time12h) => {
  const regex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  const match = time12h.match(regex);
  
  if (!match) return null;
  
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  
  if (period.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`;
};

// Convert 24-hour time (e.g., "13:30") to 12-hour format (e.g., "01:30 PM") for display
export const convertTo12Hour = (time24h) => {
  if (!time24h) return '';
  
  const [hoursStr, minutes] = time24h.split(':');
  let hours = parseInt(hoursStr, 10);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours === 0) {
    hours = 12;
  } else if (hours > 12) {
    hours -= 12;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
};

// Validate 12-hour time format
export const validate12HourTime = (time) => {
  const regex = /^(0[1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i;
  return regex.test(time);
};
