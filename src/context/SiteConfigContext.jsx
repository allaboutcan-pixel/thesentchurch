import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import churchData from '../data/church_data.json';

const SiteConfigContext = createContext(null);

export const SiteConfigProvider = ({ children }) => {
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
    const [error] = useState(null);

    useEffect(() => {
        let isMounted = true;

        // Real-time subscription - one single subscription for the entire app
        const unsubscribe = dbService.subscribeToSiteConfig((siteConfig) => {
            if (!isMounted) return;

            if (siteConfig) {
                setConfig(prev => ({
                    ...prev,
                    ...siteConfig,
                    services: siteConfig.services || prev.services,
                    specialServices: siteConfig.specialServices || prev.specialServices,
                    otherMeetings: siteConfig.otherMeetings || prev.otherMeetings,
                    staff: siteConfig.staff || prev.staff,
                    pastor: { ...prev.pastor, ...siteConfig.pastor },
                    social: { ...prev.social, ...siteConfig.social },
                    location: { ...prev.location, ...siteConfig.location }
                }));
            }
            setLoading(false);
        });

        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, []);

    const value = { config, loading, error };

    return (
        <SiteConfigContext.Provider value={value}>
            {children}
        </SiteConfigContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSiteConfigValue = () => {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error('useSiteConfigValue must be used within a SiteConfigProvider');
    }
    return context;
};
