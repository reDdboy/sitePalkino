import type { Metadata } from "next";
import { getSchedule } from "../lib/api";
import ScheduleView from "./ScheduleView";

export const metadata: Metadata = {
    title: "Расписание богослужений — Храм Преподобного Серафима Саровского",
    description: "Расписание богослужений храма Преподобного Серафима Саровского в селе Палкино.",
};

export default async function Schedule() {
    const entries = await getSchedule();

    return (
        <main className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
            <h1 className="mb-8 text-center font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Расписание богослужений
            </h1>

            <ScheduleView entries={entries} />
        </main>
    );
}
