import { useEffect, useRef } from "react";

type AppleIdHelpProps = {
    /** Classes for the outer <details> wrapper */
    className?: string;
    /** Classes for the trigger <summary> “i” button */
    buttonClassName?: string;
    /** Classes for the tooltip bubble */
    tooltipClassName?: string;
    /** Tooltip content (defaults to your Apple ID blurb) */
    content?: React.ReactNode;
    /** Auto-close timeout (mobile only). Default: 3000ms */
    autoCloseMs?: number;
    /** aria-label for the trigger button */
    label?: string;
};

// tiny class merger (no deps)
const cx = (...a: (string | false | null | undefined)[]) =>
    a.filter(Boolean).join(" ");

export default function AppleIdHelp({
    className,
    buttonClassName,
    tooltipClassName,
    content = (
        <>
            The email you use with the App Store on your device. We’ll send your
            TestFlight invite here.
        </>
    ),
    autoCloseMs = 3000,
    label = "What is an Apple ID email?",
}: AppleIdHelpProps) {
    const ref = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const mq = window.matchMedia("(hover: hover) and (pointer: fine)");

        // Desktop hover open/close
        const onEnter = () => { if (mq.matches) el.setAttribute("open", ""); };
        const onLeave = () => { if (mq.matches) el.removeAttribute("open"); };
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        // Keyboard focus/blur on the summary
        const summary = el.querySelector("summary") as HTMLElement | null;
        const onFocus = () => el.setAttribute("open", "");
        const onBlur = (e: FocusEvent) => {
            if (!el.contains(e.relatedTarget as Node)) el.removeAttribute("open");
        };
        summary?.addEventListener("focus", onFocus);
        summary?.addEventListener("blur", onBlur);

        // Mobile: close on outside tap + fallback auto-dismiss
        let cleanupOutside: (() => void) | null = null;
        let timer: number | null = null;

        const addOutsideCloser = () => {
            const onPointerDown = (evt: Event) => {
                if (el.open && !el.contains(evt.target as Node)) el.removeAttribute("open");
            };
            document.addEventListener("pointerdown", onPointerDown, true);
            cleanupOutside = () =>
                document.removeEventListener("pointerdown", onPointerDown, true);
        };

        const onToggle = () => {
            if (!mq.matches && el.open) {
                addOutsideCloser();
                if (timer) window.clearTimeout(timer);
                timer = window.setTimeout(() => el.removeAttribute("open"), autoCloseMs);
            } else {
                if (cleanupOutside) { cleanupOutside(); cleanupOutside = null; }
                if (timer) { window.clearTimeout(timer); timer = null; }
            }
        };
        el.addEventListener("toggle", onToggle);

        return () => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
            el.removeEventListener("toggle", onToggle);
            summary?.removeEventListener("focus", onFocus);
            summary?.removeEventListener("blur", onBlur);
            if (cleanupOutside) cleanupOutside();
            if (timer) window.clearTimeout(timer);
        };
    }, [autoCloseMs]);

    return (
        <details ref={ref} className={cx("relative inline-flex", className)}>
            <summary
                className={cx(
                    // base trigger styles
                    "list-none inline-flex h-5 w-5 items-center justify-center rounded-full",
                    "border border-slate-400 bg-white text-[10px] leading-none text-slate-700",
                    "focus:outline-none focus:ring-2 focus:ring-slate-900/20",
                    buttonClassName
                )}
                aria-label={label}
            >
                i
            </summary>

            <div
                id="apple-id-help"
                role="tooltip"
                className={cx(
                    // base tooltip styles + centered under trigger
                    "absolute left-1/2 z-30 mt-2 w-60 -translate-x-1/2",
                    "rounded-md bg-slate-900 px-2.5 py-2 text-xs text-white shadow-lg",
                    tooltipClassName
                )}
            >
                {content}
            </div>
        </details>
    );
}