import Link from "next/link"
import { newsData } from "../data/news"

export default function NewsCard({ limit }: { limit?: number }) {
    const newsToShow = limit ? newsData.slice(0, limit) : newsData;

    return (
        <div className="bg-church-gold/5 rounded-[12px] p-6 border border-church-gold/20">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Новости</h3>
            <div className="space-y-4">
                {newsToShow.map((item, idx) => (
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
    )
}
