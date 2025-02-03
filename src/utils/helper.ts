import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Guard for SSR: window is undefined on the server.
        if (typeof window === 'undefined') {
            return;
        }

        const mediaQueryList = window.matchMedia(query);
        // Set the initial value
        setMatches(mediaQueryList.matches);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
};
