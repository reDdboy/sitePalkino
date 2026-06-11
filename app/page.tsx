import Image from "next/image"
import Link from "next/link"
import { scheduleData } from "./data/schedule";
import { newsData } from "./data/news"
import ScheduleCard from "./components/ScheduleCard";
import NewsCard from "./components/NewsCard";

export default function HomePage() {
    return (
        <div className="bg-background transition-colors duration-300">
            {/* Шапка с фото */}
            <div className="relative h-[500px] md:h-[600px] overflow-hidden">
                <Image
                    src="/hram.jpg"
                    alt="Храм Серафима Саровского"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">
                        ХРАМ ПРЕПОДОБНОГО
                    </h1>
                    <h2 className="font-serif text-2xl md:text-4xl font-bold text-church-gold">
                        СЕРАФИМА САРОВСКОГО ЧУДОТВОРЦА
                    </h2>
                    <p className="text-white/80 mt-4">село Палкино, Антроповский район</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* О храме + фото */}
                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">О храме</h3>
                        <p className="text-foreground/80 leading-relaxed mb-4">
                            Храм Преподобного Серафима Саровского расположен в живописном селе Палкино
                            Антроповского района Костромской области.
                        </p>
                        <p className="text-foreground/80 leading-relaxed">
                            Наш храм открыт для всех, кто ищет духовного утешения и хочет
                            прикоснуться к православным святыням.
                        </p>
                        <Link href="/about" className="inline-block mt-4 text-church-brown hover:underline">
                            Подробнее о храме →
                        </Link>
                    </div>
                    <div className="relative h-80 md:h-100 rounded-[12px] overflow-hidden shadow-lg">
                        <Image
                            src="/hram.jpg"
                            alt="Храм"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Расписание и новости в две колонки */}
                <div className="grid md:grid-cols-2 gap-8">
                    <ScheduleCard limit={4} showLink={true} />
                    <NewsCard limit={4} showLink={true} />
                </div>
            </div>
        </div>
    )
}
