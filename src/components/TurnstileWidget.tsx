// src/components/TurnstileWidget.tsx
import React, {
    useEffect, useRef, useImperativeHandle, forwardRef,
} from 'react';
import { useTurnstile } from '../lib/useTurnstile';

export interface TurnstileRef {
    getToken(): string;
    reset(): void;
    remove(): void;
    isExpired(): boolean;
    execute(): void; // no-op unless size:"invisible"
}

type BaseOpts = Omit<TurnstileRenderOptions, 'sitekey' | 'callback' | 'error-callback' | 'expired-callback'>;

export type TurnstileWidgetProps = {
    siteKey: string;
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    /**
     * For manual/invisible-like behavior, keep size "normal"/"compact"/"flexible"
     * and drive execution via { appearance: "execute" } + ref.execute().
     */
    options?: BaseOpts & {
        size?: TurnstileRenderOptions['size'];
        execution?: 'execute' | 'render';
    };
    className?: string;
    /**
     * Re-render when this key changes (handy if action/cdata changes per form).
     */
    instanceKey?: string | number;
};

const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(function TurnstileWidget(
    { siteKey, onVerify, onError, onExpire, options, className, instanceKey },
    ref
) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
    const { ready, turnstile } = useTurnstile();

    useEffect(() => {
        if (!ready || !turnstile || !containerRef.current) return;

        // Clean up prior instance if instanceKey flips
        if (widgetIdRef.current) {
            try { turnstile.remove(widgetIdRef.current); } catch { }
            widgetIdRef.current = null;
        }

        widgetIdRef.current = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            size: 'normal',
            ...options,
            callback: (token: string) => onVerify?.(token),
            'error-callback': () => onError?.(),
            'expired-callback': () => onExpire?.(),
        });

        return () => {
            if (widgetIdRef.current) {
                try { turnstile.remove(widgetIdRef.current); } catch { }
                widgetIdRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, turnstile, siteKey, instanceKey, JSON.stringify(options)]);

    useImperativeHandle(ref, (): TurnstileRef => ({
        getToken() {
            return widgetIdRef.current && turnstile
                ? turnstile.getResponse(widgetIdRef.current)
                : '';
        },
        reset() {
            if (widgetIdRef.current && turnstile) turnstile.reset(widgetIdRef.current);
        },
        remove() {
            if (widgetIdRef.current && turnstile) {
                turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        },
        isExpired() {
            return !!(widgetIdRef.current && turnstile && turnstile.isExpired(widgetIdRef.current));
        },
        execute() {
            // Only meaningful for size:"invisible"
            if (widgetIdRef.current && turnstile?.execute) turnstile.execute(widgetIdRef.current);
        },
    }), [turnstile]);

    return <div ref={containerRef} className={className} />;
});

export default TurnstileWidget;