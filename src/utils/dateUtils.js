/**
 * Utility functions for safe date handling to prevent application crashes
 * caused by malformed or missing date strings from the database.
 */

/**
 * Safely splits a date string (YYYY-MM-DD) into parts.
 * @param {string} dateStr - The date string to split.
 * @returns {Array} [year, month, day] as strings, or defaults if invalid.
 */
export const safeSplitDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') {
        const now = new Date();
        return [
            now.getFullYear().toString(),
            (now.getMonth() + 1).toString().padStart(2, '0'),
            now.getDate().toString().padStart(2, '0')
        ];
    }

    const parts = dateStr.split('-');
    if (parts.length < 3) {
        // Handle cases like "2024-03" or just "2024"
        const now = new Date();
        const year = parts[0] || now.getFullYear().toString();
        const month = parts[1] || (now.getMonth() + 1).toString().padStart(2, '0');
        const day = parts[2] || "01";
        return [year, month, day];
    }

    return parts;
};

/**
 * Parses a date string (YYYY-MM-DD) into a Date object without timezone offset issues.
 * @param {string|Date} dateInput - The date string or Date object.
 * @returns {Date} A valid Date object or current date as fallback.
 */
export const parseDateLocal = (dateInput) => {
    if (!dateInput) return new Date();
    if (dateInput instanceof Date) return dateInput;

    try {
        const [year, month, day] = safeSplitDate(dateInput).map(Number);
        // month is 0-indexed in Date constructor
        const date = new Date(year, month - 1, day);

        // Final validation
        if (isNaN(date.getTime())) return new Date();
        return date;
    } catch (e) {
        console.warn("Date parsing failed for:", dateInput, e);
        return new Date();
    }
};

/**
 * Gets a localized day name (e.g., '일', '월') from a date string.
 * @param {string} dateStr - The date string (YYYY-MM-DD).
 * @param {string} lang - Language code ('ko' or 'en').
 * @returns {string} The day name.
 */
export const getDayName = (dateStr, lang = 'ko') => {
    const date = parseDateLocal(dateStr);
    const dayIndex = date.getDay();

    if (lang === 'ko') {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        return dayNames[dayIndex];
    } else {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return dayNames[dayIndex];
    }
};
