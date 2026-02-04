// Utility to sort days in correct order
const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const sortDays = (days) => {
  if (!days || !Array.isArray(days)) return [];
  
  return [...days].sort((a, b) => {
    const indexA = DAYS_ORDER.indexOf(a);
    const indexB = DAYS_ORDER.indexOf(b);
    return indexA - indexB;
  });
};

export const formatDaysDisplay = (days) => {
  if (!days || days.length === 0) return 'None';
  
  const sorted = sortDays(days);
  return sorted.map(d => d.substring(0, 3)).join(', ');
};
