// Date utility functions for FarmPal

/**
 * Get current date components
 * @returns {Object} { day, month, year, date, timestamp }
 */
export const getCurrentDateComponents = () => {
    const now = new Date();
    return {
        day: now.getDate(),
        month: now.getMonth() + 1, // JavaScript months are 0-indexed
        year: now.getFullYear(),
        date: now,
        timestamp: now.toISOString(),
    };
};

/**
 * Format date for display
 * @param {number} day 
 * @param {number} month 
 * @param {number} year 
 * @returns {string} Formatted date string
 */
export const formatDate = (day, month, year) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[month - 1]} ${year}`;
};

/**
 * Get month name from month number
 * @param {number} month 
 * @returns {string} Month name
 */
export const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || '';
};

/**
 * Get short month name
 * @param {number} month 
 * @returns {string} Short month name
 */
export const getShortMonthName = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
};

/**
 * Get last N months including current
 * @param {number} count 
 * @returns {Array} Array of { month, year, label } objects
 */
export const getLastMonths = (count = 6) => {
    const months = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            label: `${getShortMonthName(date.getMonth() + 1)} ${date.getFullYear()}`,
        });
    }

    return months;
};

/**
 * Get days in a month
 * @param {number} month 
 * @param {number} year 
 * @returns {number} Number of days
 */
export const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

/**
 * Create a date key for grouping records by day
 * @param {number} day 
 * @param {number} month 
 * @param {number} year 
 * @returns {string} Date key
 */
export const createDateKey = (day, month, year) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export default {
    getCurrentDateComponents,
    formatDate,
    getMonthName,
    getShortMonthName,
    getLastMonths,
    getDaysInMonth,
    createDateKey,
};
