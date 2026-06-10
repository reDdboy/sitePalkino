import Image from "next/image"
import Link from "next/link"
import { scheduleData } from "./data/schedule";
import { newsData } from "./data/news"

export default function HomePage() {
    const monthMap: Record<string, number> = {
        'января': 0,
        'февраля': 1,
        'марта': 2,
        'апреля': 3,
        'мая': 4,
        'июня': 5,
        'июля': 6,
        'августа': 7,
        'сентября': 8,
        'октября': 9,
        'ноября': 10,
        'декабря': 11,
    };

    //Разибваем дату на части, пример: 6 июня -> "6"  "июня"
    function parseDate(dateString: string) {
        const parts = dateString.split(' ');
        const day = parseInt(parts[0]);
        const monthName = parts[1];
        const month = monthMap[monthName];
        let year = new Date().getFullYear();

        // Создаем дату
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Если дата уже прошла в этом году, берем следующий год
        if (date < today) {
            date.setFullYear(year + 1);
        }

        return date;
    }

    // Определяем today ДО использования
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureServices = scheduleData.filter(item => {
        const serviceDate = parseDate(item.date);
        return serviceDate >= today;
    });

    const sortedServices = futureServices.sort((a, b) => {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    const upcomingSchedule = sortedServices.slice(0, 4);

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
                        <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Ближайшие богослужения</h3>
                        <div className="space-y-4">
                            {upcomingSchedule.map((item, idx) => (
                                <div key={idx} className="border-b border-church-gold/20 pb-3 last:border-0">
                                    {/* Дата и день */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-church-brown">{item.day}</span>
                                            <span className="text-foreground/70 ml-2">{item.date}</span>
                                        </div>
                                    </div>

                                    {/* Святые (если есть) */}
                                    {item.saints && item.saints !== "" && (
                                        <div className="text-sm text-foreground/70 italic mb-2">
                                            {item.saints}
                                        </div>
                                    )}

                                    {/* Услуги */}
                                    <div className="space-y-1">
                                        {item.services.map((service, serviceIdx) => (
                                            <div key={serviceIdx} className="flex flex-wrap gap-2 text-sm">
                                                <span className="font-semibold text-church-brown">{service.time}</span>
                                                <span className="text-foreground/80">{service.description}</span>
                                            </div>
                                        ))}
                                    </div>
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
                            {newsData.slice(0, 4).map((item, idx) => (
                                <div key={idx} className="border-b border-church-gold/20 pb-3 last:border-0">
                                    <div className="text-sm text-church-brown">{item.date}</div>
                                    <div className="font-medium mt-1">{item.title}</div>
                                    <p className="text-sm text-foreground/70 mt-1">{item.excerpt}</p>
                                </div>
                            ))}
                        </div>
                        <Link href="/news" className="inline-block mt-4 text-church-brown hover:underline text-sm">
                            Все новости →
                        </Link>
                    </div>
                </div>

                {/* Контакты */}
                <div className="mt-12 p-6 bg-church-gold/5 rounded-lg border border-church-gold/20 text-center">
                    <h3 className="font-serif text-xl font-bold mb-2">Свяжитесь с нами</h3>
                    <p className="text-foreground/80 mb-3">
                        Настоятель храма о. Александр: <a href="tel:+79264904819" className="text-church-brown hover:underline">+7 (926) 490-48-19</a>
                    </p>
                    <p className="text-foreground/80 mb-3">
                        Матушка Наталия: <a href="tel:+79999040403" className="text-church-brown hover:underline">+7 (999) 904-04-03</a>
                    </p>
                    <a
                        href="https://yandex.ru/maps/?ll=42.938343%2C58.247226&z=16"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-church-brown hover:underline inline-flex items-center gap-1"
                    >
                        Село Палкино, Антроповский район →
                    </a>
                </div>
            </div>
        </div>
    )
}
