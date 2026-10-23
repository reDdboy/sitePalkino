import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import { scheduleData } from "./data/schedule";
import { newsData } from "./data/news"
import ScheduleCard from "./components/ScheduleCard";
import NewsCard from "./components/NewsCard";
import AboutCard from "./components/AboutCard";
import Widget from "./components/Widget/Widget";

export default function HomePage() {
    return (
        <div className="bg-background transition-colors duration-300">
            {/* Шапка с фото */}
            <div className="relative w-full h-[70svh] md:h-screen">
                <Image
                    src="/hram.jpg"
                    alt="Храм Серафима Саровского"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-church-light mb-2">
                        ХРАМ ПРЕПОДОБНОГО
                    </h1>
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-church-gold">
                        СЕРАФИМА САРОВСКОГО ЧУДОТВОРЦА
                    </h2>
                    <p className="text-church-light/80 mt-4">село Палкино, Антроповский район</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* О храме + фото */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <AboutCard limit={true} />
                    <div className="relative h-80 md:h-100 rounded-[12px] overflow-hidden shadow-lg">
                        <Image src="/hram.jpg" alt="Храм" fill className="object-cover" />
                    </div>
                </div>

                {/* Основной контент */}
                <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
                    {/* Левая колонка */}
                    <div className="space-y-8">
                        <ScheduleCard limit={4} showLink={true} />
                        <NewsCard limit={4} showLink={true} />
                    </div>

                    {/* Правая колонка */}
                    <aside className="lg:sticky lg:top-40">
                        <div className="rounded-[12px] border border-church-gold/30 bg-card p-4">
                            {/* <h3 className="font-serif text-xl font-bold text-church-gold mb-4">
                                Новомученики и исповедники
                            </h3> */}
                            <Widget />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
