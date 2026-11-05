import type { NewsInput, NewsItem, ScheduleEntry, ScheduleInput } from './types';

// Пусто = тот же адрес, откуда открыта панель (в dev работает прокси Vite).
const BASE: string = import.meta.env.VITE_API_BASE ?? '';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

/** Адрес картинки для превью: загруженные файлы лежат на сервере API. */
export function assetUrl(src: string): string {
    return src.startsWith('/uploads/') ? BASE + src : src;
}

export function errorMessage(error: unknown): string {
    if (error instanceof ApiError) return error.message;
    return 'Нет связи с сервером. Проверьте, что API запущен.';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (init.body && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(BASE + path, { ...init, headers, credentials: 'include' });
    const text = await response.text();

    let data: any = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = null;
    }

    if (!response.ok) {
        throw new ApiError(response.status, data?.error ?? `Ошибка сервера (${response.status})`);
    }
    return data as T;
}

const json = (method: string, body?: unknown): RequestInit => ({
    method,
    body: body === undefined ? undefined : JSON.stringify(body)
});

export const api = {
    session: () => request<{ authenticated: boolean }>('/api/admin/session'),
    login: (password: string) => request<{ ok: true }>('/api/admin/login', json('POST', { password })),
    logout: () => request<{ ok: true }>('/api/admin/logout', json('POST')),

    listNews: () => request<NewsItem[]>('/api/admin/news'),
    createNews: (input: NewsInput) => request<NewsItem>('/api/admin/news', json('POST', input)),
    updateNews: (id: number, input: NewsInput) =>
        request<NewsItem>(`/api/admin/news/${id}`, json('PUT', input)),
    deleteNews: (id: number) => request<{ deleted: true }>(`/api/admin/news/${id}`, json('DELETE')),

    listSchedule: () => request<ScheduleEntry[]>('/api/admin/schedule'),
    createSchedule: (input: ScheduleInput) =>
        request<ScheduleEntry>('/api/admin/schedule', json('POST', input)),
    updateSchedule: (date: string, input: ScheduleInput) =>
        request<ScheduleEntry>(`/api/admin/schedule/${date}`, json('PUT', input)),
    deleteSchedule: (date: string) =>
        request<{ deleted: true }>(`/api/admin/schedule/${date}`, json('DELETE')),

    /** Загружает картинки и возвращает их адреса вида /uploads/xxxx.jpg */
    async upload(files: File[]): Promise<string[]> {
        const form = new FormData();
        files.forEach((file) => form.append('files', file));
        const result = await request<{ src: string }[]>('/api/admin/upload', {
            method: 'POST',
            body: form
        });
        return result.map((item) => item.src);
    }
};
