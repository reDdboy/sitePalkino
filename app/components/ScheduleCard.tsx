import Link from "next/link"
import { scheduleData } from "../data/schedule"

export default function ScheduleCard({ limit, showLink = false }: { limit?: number; showLink?: boolean }) {
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

    function parseDate(dateString: string) {
        const parts = dateString.split(' ');
        const day = parseInt(parts[0]);
        const monthName = parts[1];
        const month = monthMap[monthName];
        let year = new Date().getFullYear();

        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            date.setFullYear(year + 1);
        }

        return date;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureServices = scheduleData.filter(item => {
        const serviceDate = parseDate(item.date);
        return serviceDate >= today;
    });

    const sortedServices = futureServices.sort((a, b) => {
        return parseDate(a.date).getTime() - parseDate(b.date).getTime();
    });

    const scheduleToShow = limit ? sortedServices.slice(0, limit) : sortedServices;

    return (
        <div className="bg-church-gold/5 rounded-[12px] p-6 border border-church-gold/20">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Ближайшие богослужения</h3>
            <div className="space-y-4">
                {scheduleToShow.map((item, idx) => (
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
            {showLink && (
                <Link href="/schedule" className="inline-block mt-4 text-church-brown hover:underline text-sm">
                    Полное расписание →
                </Link>
            )}
        </div>
    )
}
