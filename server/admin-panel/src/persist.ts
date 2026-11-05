import { useCallback, useEffect, useRef, useState } from 'react';

// Всё хранится в sessionStorage: живёт, пока открыта вкладка (переживает F5), и не мешает другим вкладкам.
// Везде try/catch: в приватном режиме или при запрете хранилища панель просто работает без сохранения.

const PREFIX = 'palkino-admin:';

function readJson(key: string): unknown {
    try {
        const raw = window.sessionStorage.getItem(PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeJson(key: string, value: unknown) {
    try {
        window.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
        /* хранилище недоступно, не страшно */
    }
}

function removeKey(key: string) {
    try {
        window.sessionStorage.removeItem(PREFIX + key);
    } catch {
        /* хранилище недоступно, не страшно */
    }
}

/** Простое значение интерфейса (например, галочка), которое переживает перезагрузку. */
export function useStoredState<T extends string | number | boolean>(key: string, initial: T) {
    const [value, setValue] = useState<T>(() => {
        const saved = readJson(`state:${key}`);
        return typeof saved === typeof initial ? (saved as T) : initial;
    });

    const set = useCallback(
        (next: T) => {
            setValue(next);
            writeJson(`state:${key}`, next);
        },
        [key]
    );

    return [value, set] as const;
}

/**
 * Состояние формы с автосохранением черновика.
 * - после перезагрузки форма открывается с тем, что успели ввести (restored = true);
 * - если форма равна исходной, черновик не хранится вообще (поэтому устаревших черновиков не бывает);
 * - clear() вызывайте после сохранения и отмены, discard() сбрасывает форму к исходным данным.
 */
export function useDraft<T>(key: string, baseline: T, sanitize: (raw: unknown) => T | null) {
    const baselineRef = useRef(baseline);
    const baselineJson = useRef(JSON.stringify(baseline));
    const initial = useRef<{ value: T; restored: boolean } | null>(null);

    if (initial.current === null) {
        const saved = sanitize(readJson(`draft:${key}`));
        const restored = saved !== null && JSON.stringify(saved) !== baselineJson.current;
        initial.current = { value: restored ? (saved as T) : baseline, restored };
    }

    const [value, setValue] = useState<T>(initial.current.value);
    const [restored, setRestored] = useState(initial.current.restored);

    useEffect(() => {
        if (JSON.stringify(value) === baselineJson.current) {
            removeKey(`draft:${key}`);
        } else {
            writeJson(`draft:${key}`, value);
        }
    }, [key, value]);

    const clear = useCallback(() => removeKey(`draft:${key}`), [key]);

    const discard = useCallback(() => {
        removeKey(`draft:${key}`);
        setValue(baselineRef.current);
        setRestored(false);
    }, [key]);

    return { value, setValue, restored, clear, discard };
}

/**
 * Запоминает прокрутку страницы для данного экрана и возвращает её после перезагрузки
 * и при возврате из редактора. ready = true, когда содержимое уже отрисовано.
 */
export function useScrollMemory(key: string, ready: boolean) {
    useEffect(() => {
        if (!ready) return undefined;

        let active = true;
        let ticking = false;

        const saved = readJson(`scroll:${key}`);
        const top = typeof saved === 'number' ? saved : 0;
        const restoreFrame = requestAnimationFrame(() => {
            if (active) window.scrollTo(0, top);
        });

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                // active=false после ухода с экрана: иначе сохранили бы прокрутку уже другой страницы
                if (active) writeJson(`scroll:${key}`, Math.round(window.scrollY));
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            active = false;
            cancelAnimationFrame(restoreFrame);
            window.removeEventListener('scroll', onScroll);
        };
    }, [key, ready]);
}
