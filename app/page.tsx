import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
    // Временные данные для расписания
    const schedule = [
        { day: "Суббота", time: "17:00", service: "Всенощное бдение" },
        { day: "Воскресенье", time: "08:30", service: "Божественная литургия" },
    ]

    // Временные данные для новостей
    const news = [
        { title: "Престольный праздник", date: "15 января", excerpt: "В храме прошло торжественное богослужение..." },
        { title: "Благотворительная трапеза", date: "10 января", excerpt: "Состоялась традиционная трапеза для прихожан..." },
    ]

    return (
        <div className="bg-background transition-colors duration-300">
            {/* Шапка с фото */}
            <div className="relative h-[400px] md:h-[500px] overflow-hidden">
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
                        СЕРАФИМА САРОВСКОГО
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
                    <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
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
                    {/* Расписание */}
                    <div className="bg-church-gold/5 rounded-lg p-6 border border-church-gold/20">
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Расписание богослужений</h3>
                        <div className="space-y-3">
                            {schedule.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-church-gold/20 pb-3">
                                    <div>
                                        <div className="font-medium">{item.day}</div>
                                        <div className="text-sm text-foreground/70">{item.service}</div>
                                    </div>
                                    <div className="text-church-brown font-semibold">{item.time}</div>
                                </div>
                            ))}
                        </div>
                        <Link href="/schedule" className="inline-block mt-4 text-church-brown hover:underline text-sm">
                            Полное расписание →
                        </Link>
                    </div>

                    {/* Новости */}
                    <div className="bg-church-gold/5 rounded-lg p-6 border border-church-gold/20">
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Новости</h3>
                        <div className="space-y-4">
                            {news.map((item, idx) => (
                                <div key={idx}>
                                    <div className="text-sm text-church-brown">{item.date}</div>
                                    <div className="font-medium">{item.title}</div>
                                    <p className="text-sm text-foreground/70">{item.excerpt}</p>
                                </div>
                            ))}
                        </div>
                        <Link href="/news" className="inline-block mt-4 text-church-brown hover:underline text-sm">
                            Все новости →
                        </Link>
                    </div>
                </div>

                {/* Контакты и карта */}
                <div className="mt-12 p-6 bg-church-gold/5 rounded-lg border border-church-gold/20 text-center">
                    <h3 className="font-serif text-xl font-bold mb-2">Свяжитесь с нами</h3>
                    <p className="text-foreground/80 mb-3">Настоятель храма о. Александр: +7 (926) 490-48-19</p>
                    <a
                        href="https://yandex.ru/maps/?ll=42.938343%2C58.247226&z=16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-church-brown hover:underline"
                    >
                        Село Палкино, Антроповский район →
                    </a>
                </div>
            </div>
        </div>
    )
}
