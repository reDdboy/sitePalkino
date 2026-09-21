import Link from "next/link"

export default function AboutCard({ limit = false }: { limit?: boolean }) {
    const fullText = (
        <>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">О храме</h3>
            <p className="text-foreground/80 leading-relaxed mb-4">
                Храм Преподобного Серафима Саровского расположен в живописном селе Палкино
                Антроповского района Костромской области.
            </p>
            <p className="text-foreground/80 leading-relaxed">
                Наш храм открыт для всех, кто ищет духовного утешения и хочет
                прикоснуться к православным святыням.
            </p>
        </>
    )

    const shortText = (
        <>
            <p>
                Краткий текст о храме
            </p>
        </>
    )

    return (
        // <div className="bg-church-gold/5 rounded-[12px] p-6 border border-church-gold/20">
        <div className="rounded-[12px] p-6">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                {limit ? "О храме" : "История и святыни"}
            </h3>

            {limit ? shortText : fullText}

            {limit && (
                <Link href="/about" className="inline-block mt-4 text-church-brown hover:underline">
                    Подробнее о храме →
                </Link>
            )}
        </div>
    )
}
