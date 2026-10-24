"use client";

import { useState } from "react";
import ScheduleCard from "../components/ScheduleCard";
import ScheduleCalendar from "../components/ScheduleCalendar";

type ViewMode = "list" | "calendar";

export default function Schedule() {
    const [view, setView] = useState<ViewMode>("list");

    return (
        <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
            <h1 className="mb-8 text-center font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Расписание богослужений
            </h1>

            <div className="mb-6 flex justify-center">
                <div
                    className="inline-flex rounded-xl border border-church-gold/30 bg-church-gold/5 p-1"
                    role="group"
                    aria-label="Вид расписания"
                >
                    <button
                        type="button"
                        onClick={() => setView("list")}
                        aria-pressed={view === "list"}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${view === "list"
                            ? "bg-church-brown text-white"
                            : "text-foreground/75 hover:bg-church-gold/10"
                            }`}
                    >
                        Список
                    </button>

                    <button
                        type="button"
                        onClick={() => setView("calendar")}
                        aria-pressed={view === "calendar"}
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${view === "calendar"
                            ? "bg-church-brown text-white"
                            : "text-foreground/75 hover:bg-church-gold/10"
                            }`}
                    >
                        Календарь
                    </button>
                </div>
            </div>

            {view === "list" ? (
                <ScheduleCard />
            ) : (
                <ScheduleCalendar />
            )}
        </main>
    );
}
