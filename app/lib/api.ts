// Клиент публичного API храма.
// Адрес API задаётся в .env.local:
//   NEXT_PUBLIC_API_URL=http://localhost:3001  (браузер)
//   API_URL=http://127.0.0.1:3001              (серверная часть Next)
// Если оба не заданы, используется локальный API на порту 3001.

const SERVER_API = (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:3001'
).replace(/\/+$/, '');

const publicApi = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').replace(
    /\/+$/,
    ''
);

const isDev = process.env.NODE_ENV === 'development';

export type ApiNewsImage = {
    src: string;
    alt: string;
};

export type ApiNews = {
    id: number;
    title: string;
    /** Дата события в формате ГГГГ-ММ-ДД */
    date: string;
    /** Дата публикации, ISO */
    publishedAt: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    images: ApiNewsImage[];
    isFeatured: boolean;
};

export type ApiScheduleDay = {
    /** Совпадает с isoDate: ГГГГ-ММ-ДД */
    id: string;
    isoDate: string;
    day: string;
    /** Готовая подпись от API, например «8 ноября 2026» */
    date: string;
    saints: string;
    note: string;
    services: { time: string; description: string }[];
};

async function request<T>(path: string): Promise<T | null> {
    try {
        const response = await fetch(`${SERVER_API}${path}`, {
            // В dev-режиме Next не кеширует ответы, поэтому изменения из админки
            // видны сразу после обновления страницы. При статической сборке
            // (output: export) данные забираются один раз на этапе next build.
            ...(isDev ? { cache: 'no-store' as const } : { cache: 'force-cache' as const }),
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            throw new Error(`API ${response.status}: ${path}`);
        }

        return (await response.json()) as T;
    } catch (error) {
        console.warn(
            `[api] Не удалось загрузить ${path}. Проверьте, что сервер запущен: npm run dev`,
            error
        );
        return null;
    }
}

export async function getNews(limit?: number): Promise<ApiNews[]> {
    const query = limit ? `?limit=${limit}` : '';
    return (await request<ApiNews[]>(`/api/news${query}`)) ?? [];
}

export async function getNewsById(id: string): Promise<ApiNews | null> {
    return request<ApiNews>(`/api/news/${encodeURIComponent(id)}`);
}

export async function getSchedule(): Promise<ApiScheduleDay[]> {
    return (
        (await request<ApiScheduleDay[]>(
            '/api/schedule?upcoming=false&limit=100'
        )) ?? []
    );
}

/** Путь к загруженной картинке. Файлы из /uploads лежат на сервере API. */
export function mediaUrl(src: string | null | undefined): string | null {
    if (!src) return null;
    if (src.startsWith('/uploads/')) return `${publicApi}${src}`;
    return src;
}

/** «2026-08-29» → «29.08.2026» для карточек новостей. */
export function formatNewsDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-');
    if (!year || !month || !day) return isoDate;
    return `${day}.${month}.${year}`;
}
