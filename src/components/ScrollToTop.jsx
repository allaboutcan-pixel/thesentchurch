import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // If there's a hash, don't scroll to top, let the browser handle anchor navigation
        if (window.location.hash) return;

        const performScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            // Safari specific fallbacks
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        performScroll();
        // Delay for cases where mobile keyboard or layout shifts occur
        const timer = setTimeout(performScroll, 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
