import { useSyncExternalStore } from 'react';

// Мини-роутер на location.hash. Адрес всегда отражает, где вы находитесь
// (вкладка, открытый редактор, окно удаления), поэтому после F5 страница возвращается туда же:
//   #/news                  список новостей
//   #/news/new              новая новость
//   #/news/12               редактирование новости 12
//   #/news/12/delete        список + окно «Удалить новость?»
//   #/schedule              расписание
//   #/schedule/new          новый день
//   #/schedule/2026-10-20   редактирование дня

const DEFAULT_PATH = '/news';
const listeners = new Set<() => void>();

// Сколько переходов «внутри панели» стоит за текущей записью истории. Хранится в history.state,
// поэтому переживает перезагрузку. Нужно, чтобы «Отмена» и «Сохранить» возвращали назад,
// а не добавляли в историю лишние записи.
let depth = readDepth();

function readDepth(): number {
    const state = window.history.state as { depth?: unknown } | null;
    return state && typeof state.depth === 'number' ? state.depth : 0;
}

function notify() {
    listeners.forEach((listener) => listener());
}

export function getPath(): string {
    const raw = window.location.hash.slice(1);
    return raw.startsWith('/') ? raw : DEFAULT_PATH;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

window.addEventListener('popstate', () => {
    depth = readDepth();
    notify();
});
window.addEventListener('hashchange', notify);

// Позицию прокрутки восстанавливаем сами (см. useScrollMemory в persist.ts),
// иначе браузер на перезагрузке успевает промотать страницу до того, как загрузится список.
if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

export function navigate(path: string, options: { replace?: boolean } = {}) {
    if (options.replace) {
        window.history.replaceState({ depth }, '', `#${path}`);
    } else {
        if (path === getPath()) return;
        depth += 1;
        window.history.pushState({ depth }, '', `#${path}`);
    }
    notify();
}

/** Назад по истории панели; если назад идти некуда (зашли по прямой ссылке) — заменяем адрес на fallback. */
export function goBack(fallback: string) {
    if (depth > 0) {
        window.history.back();
    } else {
        navigate(fallback, { replace: true });
    }
}

export function usePath(): string {
    return useSyncExternalStore(subscribe, getPath, () => DEFAULT_PATH);
}
