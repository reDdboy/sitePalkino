import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from '@heroui/react';
import { TrashBin } from '@gravity-ui/icons';
import { api, ApiError, assetUrl, errorMessage } from '../api';
import { goBack, navigate, usePath } from '../router';
import { useScrollMemory } from '../persist';
import type { NewsItem } from '../types';
import NewsEditor from './NewsEditor';

interface Props {
    onUnauthorized: () => void;
}

type NewsRoute =
    | { view: 'list' }
    | { view: 'new' }
    | { view: 'edit'; id: number }
    | { view: 'delete'; id: number };

function parseNewsRoute(path: string): NewsRoute {
    const [section, second, third] = path.split('/').filter(Boolean);
    if (section !== 'news') return { view: 'list' };
    if (second === 'new') return { view: 'new' };

    const id = Number(second);
    if (!second || !Number.isInteger(id) || id <= 0) return { view: 'list' };
    return third === 'delete' ? { view: 'delete', id } : { view: 'edit', id };
}

const formatDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

export default function NewsPanel({ onUnauthorized }: Props) {
    const path = usePath();
    const route = useMemo(() => parseNewsRoute(path), [path]);

    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fail = useCallback(
        (e: unknown) => {
            if (e instanceof ApiError && e.status === 401) {
                onUnauthorized();
                return;
            }
            setError(errorMessage(e));
        },
        [onUnauthorized]
    );

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            setItems(await api.listNews());
        } catch (e) {
            fail(e);
        } finally {
            setLoading(false);
        }
    }, [fail]);

    useEffect(() => {
        load();
    }, [load]);

    const targetId = route.view === 'edit' || route.view === 'delete' ? route.id : null;
    const target = targetId === null ? null : (items.find((entry) => entry.id === targetId) ?? null);

    useEffect(() => {
        if (loading || error || targetId === null || target) return;
        setError('Новость не найдена. Возможно, её уже удалили.');
        navigate('/news', { replace: true });
    }, [loading, error, targetId, target]);

    const scrollKey =
        route.view === 'new' ? 'news:new' : route.view === 'edit' ? `news:edit:${route.id}` : 'news:list';
    useScrollMemory(scrollKey, !loading);

    function handleDeleted(item: NewsItem) {
        navigate('/news', { replace: true });
        setItems((prev) => prev.filter((entry) => entry.id !== item.id));
    }

    if (route.view === 'new' || (route.view === 'edit' && target)) {
        return (
            <NewsEditor
                key={route.view === 'new' ? 'new' : `edit-${route.id}`}
                item={route.view === 'edit' ? target : null}
                onUnauthorized={onUnauthorized}
                onCancel={() => goBack('/news')}
                onSaved={() => {
                    goBack('/news');
                    load();
                }}
            />
        );
    }

    if (route.view === 'edit') {
        return (
            <section>
                {error && <div className="alert error">{error}</div>}
                {loading ? (
                    <div className="muted">Загрузка…</div>
                ) : (
                    <button type="button" className="btn ghost" onClick={() => navigate('/news', { replace: true })}>
                        ← К списку новостей
                    </button>
                )}
            </section>
        );
    }

    return (
        <section>
            <div className="toolbar">
                <h2>Новости</h2>
                <button type="button" className="btn primary" onClick={() => navigate('/news/new')}>
                    + Добавить новость
                </button>
            </div>

            {error && <div className="alert error">{error}</div>}
            {loading && <div className="muted">Загрузка…</div>}
            {!loading && !error && items.length === 0 && (
                <div className="card muted">Новостей пока нет.</div>
            )}

            <ul className="list">
                {items.map((item) => (
                    <li key={item.id} className="card item news-item">
                        {item.featuredImage ? (
                            <img
                                className="thumb"
                                src={assetUrl(item.featuredImage)}
                                alt=""
                                onError={(e) => {
                                    e.currentTarget.style.visibility = 'hidden';
                                }}
                            />
                        ) : (
                            <div className="thumb empty" />
                        )}
                        <div className="grow">
                            <div className="title-row">
                                <strong>{item.title}</strong>
                                {item.isFeatured && <span className="badge">Важная</span>}
                            </div>
                            <div className="muted">{formatDate(item.date)}</div>
                            {item.excerpt && <p className="excerpt">{item.excerpt}</p>}
                        </div>
                        <div className="actions">
                            <button
                                type="button"
                                className="btn ghost small"
                                onClick={() => navigate(`/news/${item.id}`)}
                            >
                                Изменить
                            </button>
                            <button
                                type="button"
                                className="btn danger small"
                                onClick={() => navigate(`/news/${item.id}/delete`, { replace: true })}
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <DeleteNewsModal
                item={route.view === 'delete' ? target : null}
                onClose={() => navigate('/news', { replace: true })}
                onDeleted={handleDeleted}
                onUnauthorized={onUnauthorized}
            />
        </section>
    );
}

interface DeleteModalProps {
    item: NewsItem | null;
    onClose: () => void;
    onDeleted: (item: NewsItem) => void;
    onUnauthorized: () => void;
}

function DeleteNewsModal({ item, onClose, onDeleted, onUnauthorized }: DeleteModalProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const lastItem = useRef<NewsItem | null>(null);
    if (item) lastItem.current = item;
    const shown = lastItem.current;

    const openId = item?.id;
    useEffect(() => {
        setError('');
    }, [openId]);

    async function confirm() {
        if (!item) return;

        setBusy(true);
        setError('');
        try {
            await api.deleteNews(item.id);
            onDeleted(item);
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                onUnauthorized();
            } else if (e instanceof ApiError && e.status === 404) {
                onDeleted(item);
            } else {
                setError(errorMessage(e));
            }
        } finally {
            setBusy(false);
        }
    }

    return (
        <Modal isOpen={item !== null} onOpenChange={(open) => {
            if (!open && !busy) onClose();
        }}>
            <Modal.Backdrop variant="blur">
                <Modal.Container className="sm:max-w-[420px]">
                    <Modal.Dialog>
                        <Modal.Header className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-danger-50 text-danger">
                                <TrashBin className="size-5" />
                            </span>
                            <span>Удалить новость?</span>
                        </Modal.Header>

                        <Modal.Body>
                            {shown && (
                                <div className="flex items-center gap-3 rounded-xl border border-default-200 bg-default-50 p-3">
                                    {shown.featuredImage ? (
                                        <img
                                            className="h-14 w-14 shrink-0 rounded-lg bg-default-100 object-cover"
                                            src={assetUrl(shown.featuredImage)}
                                            alt=""
                                            onError={(e) => {
                                                e.currentTarget.style.visibility = 'hidden';
                                            }}
                                        />
                                    ) : (
                                        <div className="h-14 w-14 shrink-0 rounded-lg bg-default-100" />
                                    )}
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold">{shown.title}</div>
                                        <div className="text-sm text-default-500">{formatDate(shown.date)}</div>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-default-600">
                                Новость будет удалена навсегда. Это действие нельзя отменить.
                            </p>
                            {error && (
                                <div role="alert" className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger">
                                    {error}
                                </div>
                            )}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="tertiary" onPress={onClose} isDisabled={busy}>
                                Отмена
                            </Button>
                            <Button variant="danger" onPress={confirm} isDisabled={busy}>
                                {error ? 'Повторить' : 'Удалить'}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
