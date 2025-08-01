import { useCallback } from 'react';

export const useScrollReset = () => {
    const resetScroll = useCallback(() => {
        // Reset scroll on multiple scrollable elements to ensure it works
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Also reset scroll on document body and html element
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        // Reset scroll on any scrollable containers
        const scrollableElements = document.querySelectorAll('[style*="overflow-y: scroll"], [style*="overflow-y: auto"]');
        for (const element of scrollableElements) {
            if (element instanceof HTMLElement) {
                element.scrollTop = 0;
            }
        }
    }, []);

    return resetScroll;
}; 