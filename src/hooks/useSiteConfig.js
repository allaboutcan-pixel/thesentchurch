import { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import churchData from '../data/church_data.json';

/**
 * Custom hook to fetch and provide site configuration.
 * Merges Firestore data with local church_data.json defaults.
 */
export const useSiteConfig = () => {
    const [config, setConfig] = useState({
        ...churchData.general,
        ...churchData.intro,
        services: churchData.services,
        specialServices: churchData.special_services,
        otherMeetings: churchData.other_meetings,
        staff: churchData.intro.staff,
        pastor: churchData.intro.pastor
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        // Real-time subscription
        const unsubscribe = dbService.subscribeToSiteConfig((siteConfig) => {
            if (!isMounted) return;

            if (siteConfig) {
                setConfig(prev => ({
                    ...prev,
                    ...siteConfig,
                    // Ensure nested objects are merged correctly
                    location: siteConfig.location || prev.location,
                    social: { ...prev.social, ...siteConfig.social },
                    pastor: { ...prev.pastor, ...siteConfig.pastor }
                }));
            }
            setLoading(false);
        });

        // Cleanup function for useEffect
        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return { config, loading, error };
};
