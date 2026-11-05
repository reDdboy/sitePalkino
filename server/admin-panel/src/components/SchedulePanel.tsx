import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Modal } from '@heroui/react';
import { TrashBin } from '@gravity-ui/icons';
import { api, ApiError, errorMessage } from '../api';
import { useDraft, useScrollMemory, useStoredState } from '../persist';
import { goBack, navigate, usePath } from '../router';
import type { ScheduleEntry, ScheduleInput, ServiceItem } from '../types';

interface Props {
    onUnauthorized: () => void;
}

type ScheduleRoute = { view: 'list' } | { view: 'new' } | { view: 'edit'; date: string } | { view: 'delete'; date: string };

function parseScheduleRoute(path: string): ScheduleRoute {
    const [section, second, third] = path.split('/').filter(Boolean);
    if (section !== 'schedule') return { view: 'list' };
    if (second === 'new') return { view: 'new' };
    if (!second || !/^\d{4}-\d{2}-\d{2}$/.test(second)) return { view: 'list' };
    return third === 'delete' ? { view: 'delete', date: second } : { view: 'edit', date: second };
}

const todayLocal = () => new Date().toLocaleDateString('en-CA');

const defaultServices = (): ServiceItem[] => [
    { time: '08:00', description: 'Часы' },
    { time: '08:30', description: 'Литургия' }
];

export default function SchedulePanel({ onUnauthorized }: Props) {
    const path = usePath();
    const route = useMemo(() => parseScheduleRoute(path), [path]);

    const [entries, setEntries] = useState<ScheduleEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPast, setShowPast] = useStoredState<boolean>('schedule:showPast', false);

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
            setEntries(await api.listSchedule());
        } catch (e) {
            fail(e);
        } finally {
            setLoading(false);
        }
    }, [fail]);

    useEffect(() => {
        load();
    }, [load]);

    const editDate = route.view === 'edit' ? route.date : null;
    const deleteDate = route.view === 'delete' ? route.date : null;
    const editEntry = editDate === null ? null : (entries.find((entry) => entry.id === editDate) ?? null);
    const deleteTarget = deleteDate === null ? null : (entries.find((entry) => entry.id === deleteDate) ?? null);

    useEffect(() => {
        if (loading || error) return;
        if (editDate !== null && !editEntry) {
            setError('Запись расписания не найдена. Возможно, её уже удалили.');
            navigate('/schedule', { replace: true });
            return;
        }
        if (deleteDate !== null && !deleteTarget) {
            setError('Запись расписания не найдена. Возможно, её уже удалили.');
            navigate('/schedule', { replace: true });
        }
    }, [loading, error, editDate, editEntry, deleteDate, deleteTarget]);

    const scrollKey =
        route.view === 'new'
            ? 'schedule:new'
            : route.view === 'edit'
                ? `schedule:edit:${route.date}`
                : 'schedule:list';
    useScrollMemory(scrollKey, !loading);

    function handleDeleted(entry: ScheduleEntry) {
        navigate('/schedule', { replace: true });
        setEntries((prev) => prev.filter((item) => item.id !== entry.id));
    }

    if (route.view === 'new' || (route.view === 'edit' && editEntry)) {
        return (
            <ScheduleEditor
                key={route.view === 'new' ? 'new' : `edit-${route.date}`}
                entry={route.view === 'edit' ? editEntry : null}
                onUnauthorized={onUnauthorized}
                onCancel={() => goBack('/schedule')}
                onSaved={() => {
                    goBack('/schedule');
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
                    <button type="button" className="btn ghost" onClick={() => navigate('/schedule', { replace: true })}>
                        ← К расписанию
                    </button>
                )}
            </section>
        );
    }

    const today = todayLocal();
    const visible = entries.filter((entry) => showPast || entry.id >= today).sort((a, b) => a.id.localeCompare(b.id));

    return (
        <section>
            <div className="toolbar">
                <h2>Расписание богослужений</h2>
                <button type="button" className="btn primary" onClick={() => navigate('/schedule/new')}>
                    + Добавить день
                </button>
            </div>

            <label className="check">
                <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} />
                <span>Показывать прошедшие даты</span>
            </label>

            {error && <div className="alert error">{error}</div>}
            {loading && <div className="muted">Загрузка…</div>}
            {!loading && !error && visible.length === 0 && (
                <div className="card muted">Предстоящих служб в расписании нет.</div>
            )}

            <ul className="list">
                {visible.map((entry) => (
                    <li key={entry.id} className="card item">
                        <div className="day">
                            <strong>{entry.day}</strong>
                        </div>
                        <div className="grow">
                            <strong>{entry.date}</strong>
                            {entry.saints && <div>{entry.saints}</div>}
                            <div className="muted">
                                {entry.services.length
                                    ? entry.services.map((s) => `${s.time} ${s.description}`).join(' · ')
                                    : 'Службы не указаны'}
                            </div>
                            {entry.note && <div className="muted">{entry.note}</div>}
                        </div>
                        <div className="actions">
                            <button
                                type="button"
                                className="btn ghost small"
                                onClick={() => navigate(`/schedule/${entry.id}`)}
                            >
                                Изменить
                            </button>
                            <button
                                type="button"
                                className="btn danger small"
                                onClick={() => navigate(`/schedule/${entry.id}/delete`, { replace: true })}
                            >
                                Удалить
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <DeleteScheduleModal
                item={route.view === 'delete' ? deleteTarget : null}
                onClose={() => navigate('/schedule', { replace: true })}
                onDeleted={handleDeleted}
                onUnauthorized={onUnauthorized}
            />
        </section>
    );
}

interface DeleteModalProps {
    item: ScheduleEntry | null;
    onClose: () => void;
    onDeleted: (item: ScheduleEntry) => void;
    onUnauthorized: () => void;
}

function DeleteScheduleModal({ item, onClose, onDeleted, onUnauthorized }: DeleteModalProps) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const lastItem = useRef<ScheduleEntry | null>(null);
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
            await api.deleteSchedule(item.id);
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
                            <span>Удалить расписание?</span>
                        </Modal.Header>

                        <Modal.Body>
                            {shown && (
                                <div className="flex items-center gap-3 rounded-xl border border-default-200 bg-default-50 p-3">
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold">{shown.date}</div>
                                        <div className="text-sm text-default-500">{shown.day}</div>
                                    </div>
                                </div>
                            )}
                            <p className="text-sm text-default-600">
                                Дата будет удалена навсегда. Это действие нельзя отменить.
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

interface EditorProps {
    entry: ScheduleEntry | null;
    onSaved: () => void;
    onCancel: () => void;
    onUnauthorized: () => void;
}

interface FormState {
    date: string;
    saints: string;
    note: string;
    services: ServiceItem[];
}

function initialForm(entry: ScheduleEntry | null): FormState {
    return entry
        ? { date: entry.id, saints: entry.saints, note: entry.note, services: entry.services }
        : { date: todayLocal(), saints: '', note: '', services: defaultServices() };
}

function sanitizeForm(raw: unknown): FormState | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.date !== 'string' || typeof r.saints !== 'string' || typeof r.note !== 'string') return null;
    if (!Array.isArray(r.services)) return null;
    const services = r.services.filter(
        (item): item is ServiceItem =>
            !!item && typeof item.time === 'string' && typeof item.description === 'string'
    );
    return { date: r.date, saints: r.saints, note: r.note, services };
}

function ScheduleEditor({ entry, onSaved, onCancel, onUnauthorized }: EditorProps) {
    const { value: form, setValue: setForm, restored, clear, discard } = useDraft<FormState>(
        entry ? `schedule:${entry.id}` : 'schedule:new',
        initialForm(entry),
        sanitizeForm
    );
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    function setService(index: number, patch: Partial<ServiceItem>) {
        setForm((prev) => ({
            ...prev,
            services: prev.services.map((item, i) => (i === index ? { ...item, ...patch } : item))
        }));
    }

    async function submit(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError('');

        const input: ScheduleInput = {
            date: form.date,
            saints: form.saints,
            note: form.note,
            services: form.services
        };

        try {
            if (entry) {
                await api.updateSchedule(entry.id, input);
            } else {
                await api.createSchedule(input);
            }
            clear();
            onSaved();
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                onUnauthorized();
                return;
            }
            setError(errorMessage(e));
            setBusy(false);
        }
    }

    return (
        <form className="card" onSubmit={submit}>
            <h2>{entry ? `Расписание на ${entry.date}` : 'Новый день расписания'}</h2>

            {restored && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-2 text-sm text-warning-700">
                    <span>Восстановлен несохранённый черновик.</span>
                    <button type="button" className="btn ghost small" onClick={discard}>
                        Сбросить
                    </button>
                </div>
            )}

            <label className="field">
                <span>Дата</span>
                <input
                    type="date"
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                    disabled={Boolean(entry)}
                    required
                />
            </label>

            <label className="field">
                <span>Святые и праздники</span>
                <input value={form.saints} onChange={(e) => update('saints', e.target.value)} maxLength={255} />
            </label>

            <div className="field">
                <span>Богослужения</span>
                <ul className="services">
                    {form.services.map((service, index) => (
                        <li key={index}>
                            <input
                                type="time"
                                value={service.time}
                                onChange={(e) => setService(index, { time: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Например: Литургия"
                                value={service.description}
                                onChange={(e) => setService(index, { description: e.target.value })}
                                maxLength={255}
                                required
                            />
                            <button
                                type="button"
                                className="btn danger small"
                                onClick={() =>
                                    update(
                                        'services',
                                        form.services.filter((_, i) => i !== index)
                                    )
                                }
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    type="button"
                    className="btn ghost small"
                    onClick={() => update('services', [...form.services, { time: '', description: '' }])}
                >
                    + Добавить службу
                </button>
            </div>

            <label className="field">
                <span>Примечание</span>
                <textarea
                    rows={2}
                    value={form.note}
                    onChange={(e) => update('note', e.target.value)}
                    maxLength={2000}
                />
            </label>

            {error && <div className="alert error">{error}</div>}

            <div className="actions">
                <button type="submit" className="btn primary" disabled={busy}>
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
