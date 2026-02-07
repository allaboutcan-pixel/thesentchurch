import { useSiteConfigValue } from '../context/SiteConfigContext';

/**
 * Custom hook to fetch and provide site configuration.
 * Now consumes from global SiteConfigContext.
 */
export const useSiteConfig = () => {
    return useSiteConfigValue();
};
