import Link from "next/link";
import { scheduleData } from "../data/schedule";

type ScheduleCardProps = {
    limit?: number;
    showLink?: boolean;
};

function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
    }).format(new Date(year, month - 1, day));
}

function getTodayDate() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

export default function ScheduleCard({
    limit,
    showLink = false,
}: ScheduleCardProps) {
    const today = getTodayDate();

    const grouped = new Map<
        string,
        {
            date: string;
            isoDate: string;
            day: string;
            saints: string[];
            notes: string[];
            services: {
                time: string;
                description: string;
            }[];
        }
    >();

    for (const item of scheduleData) {
        if (item.isoDate < today) continue;

        const existing = grouped.get(item.isoDate) ?? {
            date: item.date,
            isoDate: item.isoDate,
            day: item.day,
            saints: [],
            notes: [],
            services: [],
        };

        if (item.saints?.trim()) {
            existing.saints.push(item.saints);
        }

        if (item.note?.trim()) {
            existing.notes.push(item.note);
        }

        existing.services.push(...item.services);

        grouped.set(item.isoDate, existing);
    }

    const entries = [...grouped.values()]
        .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
        .slice(0, limit);

    return (
        <section className="rounded-2xl border border-church-gold/20 bg-church-gold/5 p-4 sm:p-6">
            <h2 className="mb-6 font-serif text-2xl font-bold text-foreground">
                Ближайшие богослужения
            </h2>

            {entries.length === 0 ? (
                <p className="text-foreground/70">
                    Ближайшее расписание пока не опубликовано.
                    Пожалуйста, уточните информацию по телефону храма.
                </p>
            ) : (
                <div className="space-y-4">
                    {entries.map((entry) => (
                        <article
                            key={entry.isoDate}
                            className="rounded-xl border border-church-gold/20 bg-background/70 p-4"
                        >
                            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <h3 className="font-semibold text-church-brown">
                                    {entry.day}
                                </h3>

                                <time
                                    dateTime={entry.isoDate}
                                    className="text-sm capitalize text-foreground/65"
                                >
                                    {formatDate(entry.isoDate)}
                                </time>
                            </div>

                            {entry.saints.length > 0 && (
                                <div className="mb-3 space-y-1">
                                    {entry.saints.map((saint, index) => (
                                        <p
                                            key={`${entry.isoDate}-saint-${index}`}
                                            className="text-sm italic text-foreground/70"
                                        >
                                            {saint}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {entry.notes.map((note, index) => (
                                <p
                                    key={`${entry.isoDate}-note-${index}`}
                                    className="mb-3 rounded-lg bg-church-gold/10 p-3 text-sm text-foreground"
                                >
                                    {note}
                                </p>
                            ))}

                            {entry.services.length > 0 ? (
                                <ul className="space-y-3">
                                    {entry.services.map((service, index) => (
                                        <li
                                            key={`${entry.isoDate}-${service.time}-${index}`}
                                            className="flex flex-col gap-1 sm:flex-row sm:gap-4"
                                        >
                                            <time className="shrink-0 font-semibold text-church-brown">
                                                {service.time}
                                            </time>

                                            <span className="text-foreground/85">
                                                {service.description}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : entry.notes.length === 0 ? (
                                <p className="text-sm text-foreground/60">
                                    Время богослужений не указано.
                                </p>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}

            {showLink && (
                <Link
                    href="/schedule"
                    className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold text-church-brown transition-colors hover:text-church-red"
                >
                    Полное расписание <span aria-hidden="true">→</span>
                </Link>
            )}
        </section>
    );
}
