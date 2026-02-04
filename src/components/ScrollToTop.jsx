import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // If there's a hash, don't scroll to top, let the browser handle anchor navigation
        if (window.location.hash) return;
        try {
            window.scrollTo(0, 0);
        } catch (e) {
            console.warn("Scroll to top failed", e);
        }
    }, [pathname]);

    return null;
}
