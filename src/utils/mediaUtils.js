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
        const youtubeVideo = new RegExp("(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?|live|shorts)/|.*[?&]v=)|youtu\\.be/)([^\"&?/\\s]{11})", "i");

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
    const match = url.match(new RegExp("(?:youtube\\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?|live|shorts)/|.*[?&]v=)|youtu\\.be/)([^\"&?/\\s]{11})", "i"));
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

/**
 * Formats Facebook URLs to be more robust for mobile navigation.
 * Specifically converts single-photo links within a post into full post links
 * to ensure "Swipe" functionality works on mobile devices.
 * 
 * @param {string} url - The original Facebook URL
 * @returns {string} - The optimized URL
 */
export const formatFacebookLink = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (!url.includes('facebook.com')) return url;

    // Detect if the user is on a desktop/PC environment
    // We do NOT transform URLs for PC to ensure perfect consistency with what the user entered
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return url;

    try {
        // Find if the original URL already has a group context to reuse
        const groupMatch = url.match(/groups\/([a-zA-Z0-9.-]+)\//);
        const groupName = (groupMatch && groupMatch[1]) ? groupMatch[1] : 'thesentchurch';

        // 1. Detect "photo" links with a "pcb" set (Post Cluster ID)
        // Example: https://www.facebook.com/photo?fbid=...&set=pcb.26549997914636669
        const pcbMatch = url.match(/[?&]set=pcb\.([0-9]+)/);
        if (pcbMatch && pcbMatch[1]) {
            // Using a standard Group-Post link is the most reliable way to trigger "Universal Links"
            // that open the Facebook APP directly on iOS and Android.
            return `https://www.facebook.com/groups/${groupName}/posts/${pcbMatch[1]}/`;
        }

        // 2. Detect "album" links
        // Example: https://www.facebook.com/photo?fbid=...&set=a.123456789
        const albumMatch = url.match(/[?&]set=a\.([0-9]+)/);
        if (albumMatch && albumMatch[1]) {
            return `https://www.facebook.com/media/set/?set=a.${albumMatch[1]}`;
        }
    } catch (e) {
        console.warn("mediaUtils: Error formatting Facebook link", e);
    }

    // Default: Return the original URL if we can't safely transform it.
    // This is the safest way to avoid the Facebook login wall for specialized links.
    return url;
};
