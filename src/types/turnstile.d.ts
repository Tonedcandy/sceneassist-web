// src/types/turnstile.d.ts
export { };

declare global {
    type TurnstileWidgetId = string;

    interface TurnstileRenderOptions {
        sitekey: string;
        callback?: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
        'timeout-callback'?: () => void;
        theme?: 'light' | 'dark' | 'auto';
        size?: 'normal' | 'flexible' | 'compact';
        execution?: 'execute' | 'render';
        appearance?: 'always' | 'execute' | 'interaction-only';
        action?: string;
        cdata?: string;
        retry?: 'auto' | 'never';
        tabindex?: number;
        language?: string;
    }

    interface Turnstile {
        render(el: string | HTMLElement, options: TurnstileRenderOptions): TurnstileWidgetId;
        reset(widgetId?: TurnstileWidgetId): void;
        remove(widgetId?: TurnstileWidgetId): void;
        getResponse(widgetId?: TurnstileWidgetId): string;
        isExpired(widgetId?: TurnstileWidgetId): boolean;
        execute?(widgetId?: TurnstileWidgetId): void; // for size:"invisible"
    }

    interface Window {
        turnstile?: Turnstile;
    }
}