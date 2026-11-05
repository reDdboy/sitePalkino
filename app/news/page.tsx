import type { Metadata } from "next";
import NewsCard from "../components/NewsCard";
import { getNews } from "../lib/api";

export const metadata: Metadata = {
    title: "Новости — Храм Преподобного Серафима Саровского",
    description: "Новости храма Преподобного Серафима Саровского в селе Палкино.",
};

export default async function News() {
    const news = await getNews();

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground text-center mb-8">
                Новости
            </h1>
            <NewsCard items={news} />
        </div>
    )
}
