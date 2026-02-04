// Date helpers for better UX

// Returns date like "2 March 2026"
export const formatDateHuman = (date) => {
  const d = new Date(date);
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
  const d = new Date(date);
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
