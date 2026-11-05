import Link from "next/link"
import { formatNewsDate, type ApiNews } from "../lib/api"

type NewsCardProps = {
    items: ApiNews[];
    limit?: number;
    showLink?: boolean;
}

export default function NewsCard({ items, limit, showLink = false }: NewsCardProps) {
    const newsToShow = limit ? items.slice(0, limit) : items;

    return (
        <div className="bg-church-gold/5 rounded-[12px] p-6 border border-church-gold/20">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Новости</h3>
            <div className="space-y-4">
                {newsToShow.length === 0 && (
                    <p className="text-sm text-foreground/70">
                        Новостей пока нет. Добавьте их через админку.
                    </p>
                )}

                {newsToShow.map((item) => (
                    <div key={item.id} className="border-b border-church-gold/20 pb-3 last:border-0">
                        <div className="text-sm text-church-brown">{formatNewsDate(item.date)}</div>
                        <div className="font-medium mt-1">{item.title}</div>
                        <p className="text-sm text-foreground/70 mt-1">{item.excerpt}</p>
                    </div>
                ))}
            </div>
            {showLink && (
                <Link href="/news" className="inline-block mt-4 text-church-brown hover:underline text-sm">
                    Все новости →
                </Link>
            )}
        </div>
    )
}
