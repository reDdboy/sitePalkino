"use client";

import { useMemo, useState } from "react";
import { Calendar } from "@heroui/react";
import {
    today,
    getLocalTimeZone,
    parseDate,
    type DateValue,
} from "@internationalized/date";
import { scheduleData } from "../data/schedule";

function formatSelectedDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}

export default function ScheduleCalendar() {
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(
        () => today(getLocalTimeZone())
    );

    const entriesByDate = useMemo(() => {
        const map = new Map<string, typeof scheduleData>();

        for (const item of scheduleData) {
            const entries = map.get(item.isoDate) ?? [];
            entries.push(item);
            map.set(item.isoDate, entries);
        }

        return map;
    }, []);

    const selectedDateString = selectedDate?.toString() ?? "";
    const selectedEntries = entriesByDate.get(selectedDateString) ?? [];

    return (
        <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* Календарь HeroUI */}
            <div className="min-w-0 rounded-2xl border border-church-gold/20 bg-church-gold/5 p-3 sm:p-6">
                <h2 className="mb-5 font-serif text-2xl font-bold text-foreground">
                    Выберите дату
                </h2>

                <Calendar
                    aria-label="Дата богослужения"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    firstDayOfWeek="mon"
                    className="mx-auto w-full max-w-md rounded-xl border border-church-gold/20 bg-background p-3 sm:p-4"
                >
                    <Calendar.Header className="mb-4 flex items-center justify-between gap-2">
                        <Calendar.NavButton
                            slot="previous"
                            className="text-church-brown"
                        />

                        <Calendar.Heading className="text-center font-serif font-bold text-foreground" />

                        <Calendar.NavButton
                            slot="next"
                            className="text-church-brown"
                        />
                    </Calendar.Header>

                    <Calendar.Grid className="w-full border-separate border-spacing-1">
                        <Calendar.GridHeader>
                            {(day) => (
                                <Calendar.HeaderCell className="pb-2 text-center text-xs font-semibold text-foreground/60 sm:text-sm">
                                    {day}
                                </Calendar.HeaderCell>
                            )}
                        </Calendar.GridHeader>

                        <Calendar.GridBody>
                            {(date) => {
                                const hasEvents = entriesByDate.has(
                                    date.toString()
                                );

                                return (
                                    <Calendar.Cell
                                        date={date}
                                        className="
                                            group relative cursor-pointer rounded-lg text-sm
                                            transition-all duration-150
                                            hover:bg-church-gold/20
                                            hover:text-church-gold
                                            hover:ring-1 hover:ring-church-gold/60
                                            focus-visible:outline-none
                                            focus-visible:ring-2 focus-visible:ring-church-gold
                                        "
                                    >
                                        {({ formattedDate }) => {
                                            const hasEvents = entriesByDate.has(date.toString());

                                            return (
                                                <span className="relative flex min-h-9 w-full flex-col items-center justify-center gap-0.5 sm:min-h-10">
                                                    <span className="font-medium transition-colors group-hover:text-church-gold">
                                                        {formattedDate}
                                                    </span>

                                                    {hasEvents && (
                                                        <Calendar.CellIndicator className="h-1.5 w-1.5 rounded-full bg-church-gold" />
                                                    )}
                                                </span>
                                            );
                                        }}
                                    </Calendar.Cell>
                                );
                            }}
                        </Calendar.GridBody>
                    </Calendar.Grid>
                </Calendar>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground/65">
                    <span className="h-2 w-2 rounded-full bg-church-gold" />
                    Есть события в расписании
                </div>
            </div>

            {/* События выбранной даты */}
            <div className="min-w-0 rounded-2xl border border-church-gold/20 bg-church-gold/5 p-4 sm:p-6">
                <h2 className="mb-5 font-serif text-xl font-bold capitalize text-foreground sm:text-2xl">
                    {selectedDateString
                        ? formatSelectedDate(selectedDateString)
                        : "Выберите дату"}
                </h2>

                {!selectedDateString || selectedEntries.length === 0 ? (
                    <p className="text-sm leading-relaxed text-foreground/70">
                        На эту дату нет опубликованных событий.
                        Выберите другой день в календаре.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {selectedEntries.map((entry) => (
                            <article
                                key={entry.id}
                                className="border-b border-church-gold/20 pb-4 last:border-0 last:pb-0"
                            >
                                {entry.saints && (
                                    <p className="mb-3 text-sm italic leading-relaxed text-foreground/70">
                                        {entry.saints}
                                    </p>
                                )}

                                {entry.note && (
                                    <p className="mb-3 rounded-lg bg-church-gold/10 p-3 text-sm leading-relaxed text-foreground">
                                        {entry.note}
                                    </p>
                                )}

                                {entry.services.length > 0 ? (
                                    <ul className="space-y-3">
                                        {entry.services.map(
                                            (service, index) => (
                                                <li
                                                    key={`${entry.id}-${index}`}
                                                    className="flex flex-col gap-1 sm:flex-row sm:gap-4"
                                                >
                                                    <time className="shrink-0 font-semibold text-church-brown">
                                                        {service.time}
                                                    </time>

                                                    <span className="text-foreground/85">
                                                        {service.description}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : !entry.note ? (
                                    <p className="text-sm text-foreground/60">
                                        Время богослужений не указано.
                                    </p>
                                ) : null}
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
