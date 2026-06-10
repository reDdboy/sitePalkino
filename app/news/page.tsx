import NewsCard from "../components/NewsCard";

export default function News() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground text-center mb-8">
                Новости
            </h1>
            <NewsCard />
        </div>
    )
}
