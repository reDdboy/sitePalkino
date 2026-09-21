import Image from "next/image";
import AboutCard from "../components/AboutCard";

export default function About() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-8 text-center">
                О храме
            </h1>

            <div className="grid grid-cols-2 gap-12">
                <div className="max-w-4xl mx-auto">
                    <AboutCard limit={false} />
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
        </div>
    )
}
