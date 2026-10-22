import Image from "next/image"

export default function Clergy() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-center mb-8">
                Духовенство
            </h1>

            <div className="flex flex-col items-center">
                <Image
                    src="/clergy/main.jpg"
                    alt="Иерей Александр Семченко, настоятель храма"
                    width={300}
                    height={200}
                    priority
                    className="rounded-lg shadow-md object-cover"
                />
                <h2 className="font-serif text-2xl font-bold text-center mt-4">
                    Иерей Александр Семченко
                </h2>
                <h3 className="font-serif text-lg text-foreground/70 text-center mt-1">
                    Настоятель храма
                </h3>
            </div>
        </div>
    )
}
