import { ChangeEvent, FormEvent, useState } from 'react';
import { api, ApiError, assetUrl, errorMessage } from '../api';
import { useDraft } from '../persist';
import type { NewsImage, NewsInput, NewsItem } from '../types';

interface Props {
    item: NewsItem | null; // null = новая новость
    onSaved: () => void;
    onCancel: () => void;
    onUnauthorized: () => void;
}

interface FormState {
    title: string;
    date: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    images: NewsImage[];
    isFeatured: boolean;
}

const todayLocal = () => new Date().toLocaleDateString('en-CA');

function initialForm(item: NewsItem | null): FormState {
    return item
        ? {
            title: item.title,
            date: item.date,
            excerpt: item.excerpt,
            content: item.content,
            featuredImage: item.featuredImage ?? '',
            images: item.images,
            isFeatured: item.isFeatured
        }
        : {
            title: '',
            date: todayLocal(),
            excerpt: '',
            content: '',
            featuredImage: '',
            images: [],
            isFeatured: false
        };
}

/** Черновик из хранилища может быть чем угодно: берём его, только если форма целая. */
function sanitizeForm(raw: unknown): FormState | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    const strings = ['title', 'date', 'excerpt', 'content', 'featuredImage'] as const;
    if (!strings.every((key) => typeof r[key] === 'string')) return null;
    if (typeof r.isFeatured !== 'boolean' || !Array.isArray(r.images)) return null;
    const images = r.images.filter(
        (image): image is NewsImage =>
            !!image && typeof image.src === 'string' && typeof image.alt === 'string'
    );
    return {
        title: r.title as string,
        date: r.date as string,
        excerpt: r.excerpt as string,
        content: r.content as string,
        featuredImage: r.featuredImage as string,
        images,
        isFeatured: r.isFeatured
    };
}

function Thumb({ src }: { src: string }) {
    return (
        <img
            className="thumb"
            src={assetUrl(src)}
            alt=""
            onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
            }}
        />
    );
}

export default function NewsEditor({ item, onSaved, onCancel, onUnauthorized }: Props) {
    // Черновик хранится в sessionStorage: после F5 введённый текст остаётся на месте
    const { value: form, setValue: setForm, restored, clear, discard } = useDraft<FormState>(
        item ? `news:${item.id}` : 'news:new',
        initialForm(item),
        sanitizeForm
    );
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function fail(e: unknown) {
        if (e instanceof ApiError && e.status === 401) {
            onUnauthorized();
            return;
        }
        setError(errorMessage(e));
    }

    async function upload(event: ChangeEvent<HTMLInputElement>): Promise<string[]> {
        const files = Array.from(event.target.files ?? []);
        event.target.value = ''; // чтобы можно было выбрать тот же файл ещё раз
        if (!files.length) return [];

        setUploading(true);
        setError('');
        try {
            return await api.upload(files);
        } catch (e) {
            fail(e);
            return [];
        } finally {
            setUploading(false);
        }
    }

    async function pickFeatured(event: ChangeEvent<HTMLInputElement>) {
        const [src] = await upload(event);
        if (src) update('featuredImage', src);
    }

    async function pickGallery(event: ChangeEvent<HTMLInputElement>) {
        const sources = await upload(event);
        if (sources.length) {
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, ...sources.map((src) => ({ src, alt: '' }))]
            }));
        }
    }

    function setAlt(index: number, alt: string) {
        setForm((prev) => ({
            ...prev,
            images: prev.images.map((image, i) => (i === index ? { ...image, alt } : image))
        }));
    }

    function removeImage(index: number) {
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError('');

        const input: NewsInput = {
            title: form.title,
            date: form.date,
            excerpt: form.excerpt,
            content: form.content,
            featuredImage: form.featuredImage.trim() || null,
            images: form.images,
            isFeatured: form.isFeatured,
            publishedAt: item?.publishedAt
        };

        try {
            if (item) {
                await api.updateNews(item.id, input);
            } else {
                await api.createNews(input);
            }
            clear();
            onSaved();
        } catch (e) {
            fail(e);
            setBusy(false);
        }
    }

    return (
        <form className="card" onSubmit={submit}>
            <h2>{item ? 'Редактирование новости' : 'Новая новость'}</h2>

            {restored && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
                    <span>Восстановлен несохранённый черновик.</span>
                    <button type="button" className="btn ghost small" onClick={discard}>
                        Сбросить
                    </button>
                </div>
            )}

            <label className="field">
                <span>Заголовок</span>
                <input
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    maxLength={255}
                    required
                />
            </label>

            <div className="row">
                <label className="field">
                    <span>Дата события</span>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update('date', e.target.value)}
                        required
                    />
                </label>
                <label className="check">
                    <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => update('isFeatured', e.target.checked)}
                    />
                    <span>Важная новость (показывать на главной)</span>
                </label>
            </div>

            <label className="field">
                <span>Краткое описание</span>
                <textarea
                    rows={2}
                    value={form.excerpt}
                    onChange={(e) => update('excerpt', e.target.value)}
                    maxLength={2000}
                />
            </label>

            <label className="field">
                <span>Текст новости</span>
                <textarea
                    rows={9}
                    value={form.content}
                    onChange={(e) => update('content', e.target.value)}
                />
            </label>

            <div className="field">
                <span>Главная картинка</span>
                <div className="featured">
                    {form.featuredImage ? <Thumb src={form.featuredImage} /> : <div className="thumb empty" />}
                    <div className="stack">
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={pickFeatured} />
                        <input
                            placeholder="…или адрес картинки, например /uploads/photo.jpg"
                            value={form.featuredImage}
                            onChange={(e) => update('featuredImage', e.target.value)}
                        />
                        {form.featuredImage && (
                            <button type="button" className="btn ghost small" onClick={() => update('featuredImage', '')}>
                                Убрать картинку
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="field">
                <span>Галерея ({form.images.length})</span>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={pickGallery}
                />
                {form.images.length > 0 && (
                    <ul className="gallery">
                        {form.images.map((image, index) => (
                            <li key={`${image.src}-${index}`}>
                                <Thumb src={image.src} />
                                <input
                                    placeholder="Подпись к фото"
                                    value={image.alt}
                                    onChange={(e) => setAlt(index, e.target.value)}
                                    maxLength={255}
                                />
                                <button
                                    type="button"
                                    className="btn ghost small"
                                    onClick={() => update('featuredImage', image.src)}
                                >
                                    Сделать главной
                                </button>
                                <button type="button" className="btn danger small" onClick={() => removeImage(index)}>
                                    Убрать
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {uploading && <div className="muted">Загружаем файлы…</div>}
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="actions">
                <button type="submit" className="btn primary" disabled={busy || uploading}>
                    {busy ? 'Сохраняем…' : 'Сохранить'}
                </button>
                <button
                    type="button"
                    className="btn ghost"
                    disabled={busy}
                    onClick={() => {
                        clear();
                        onCancel();
                    }}
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}
