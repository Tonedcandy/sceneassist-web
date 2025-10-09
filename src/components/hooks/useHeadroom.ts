import { useEffect, useRef, useState } from "react";

/**
 * useHeadroom — pins header on scroll up, unpins on scroll down
 */
export default function useHeadroom(options?: {
    /** Don’t start hiding until you’ve scrolled past this many px */
    pinStart?: number;         // default 16
    /** Ignore tiny downward jitter */
    downTolerance?: number;    // default 8
    /** Ignore tiny upward jitter */
    upTolerance?: number;      // default 8
}) {
    const { pinStart = 16, downTolerance = 8, upTolerance = 8 } = options || {};
    const [pinned, setPinned] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    const lastY = useRef(0);
    const ticking = useRef(false);

    useEffect(() => {
        // initialize
        lastY.current = Math.max(0, window.scrollY);

        const onScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const y = Math.max(0, window.scrollY); // guard iOS overscroll
                const delta = y - lastY.current;

                // have we left the top?
                setScrolled(y > pinStart);

                if (y <= pinStart) {
                    // always pinned near the top
                    setPinned(true);
                } else if (delta > downTolerance) {
                    // scrolling down → unpin
                    setPinned(false);
                } else if (delta < -upTolerance) {
                    // scrolling up → pin
                    setPinned(true);
                }

                lastY.current = y;
                ticking.current = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [pinStart, downTolerance, upTolerance]);

    return { pinned, scrolled };
}