/**
 * Date Utility Functions
 * Ensures consistent date handling across the application
 */

/**
 * Gets the current date in the local timezone, normalized to start of day
 * @returns {Date} Date object set to 00:00:00 in local timezone
 */
export const getToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Creates a date range for a given date (or today if not provided)
 * @param {string|Date} date - Optional date string or Date object
 * @returns {{start: Date, end: Date}} Object with start and end of day in local timezone
 */
export const getDateRange = (date = null) => {
  let targetDate;
  
  if (date) {
    if (typeof date === 'string') {
      // Parse YYYY-MM-DD format
      const [year, month, day] = date.split('-').map(Number);
      targetDate = new Date(year, month - 1, day);
    } else if (date instanceof Date) {
      targetDate = new Date(date);
    }
  } else {
    targetDate = new Date();
  }
  
  // Set to start of day in local timezone
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);
  
  // Set to start of next day
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  
  return { start, end };
};

/**
 * Formats a date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  });
};

/**
 * Converts a date to YYYY-MM-DD format
 * @param {Date} date - Date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const toISODateString = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};
