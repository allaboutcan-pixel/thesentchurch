/**
 * Utility functions for media handling
 */

/**
 * Detects if a URL or File object represents a video
 * @param {string|File} source - The URL string or File object to check
 * @returns {boolean} - True if it's a video
 */
export const isVideo = (source) => {
    if (!source) return false;

    // If it's a File object
    if (source instanceof File) {
        return source.type.startsWith('video/');
    }

    // If it's a URL string
    if (typeof source === 'string') {
        const videoExtensions = /\.(mp4|webm|ogg|mov|m4v|mkv|avi)(\?.*)?$/i;
        const videoDataUri = /^data:video\//i;
        // Ignore drive thumbnail links as they are strictly images
        if (source.includes('drive.google.com/thumbnail')) return false;

        // Only treat Drive links as video if they are explicitly formatted for streaming/download
        const driveVideo = /drive\.google\.com.*(export=download|export=media)/i;
        // YouTube detection
        const youtubeVideo = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

        return videoExtensions.test(source) ||
            videoDataUri.test(source) ||
            driveVideo.test(source) ||
            youtubeVideo.test(source);
    }

    return false;
};

/**
 * Extracts YouTube ID from various YouTube URL formats
 * @param {string} url - The YouTube URL
 * @returns {string|null} - The YouTube ID or null if not found
 */
export const getYoutubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|live|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
};

/**
 * Extracts Google Drive File ID from various Drive URL formats
 * @param {string} url - The Google Drive URL
 * @returns {string|null} - The File ID or null if not found
 */
export const getDriveId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
        url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
        url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
};
