import AboutCard from "../components/AboutCard";

export default function About() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-8 text-center">
                О храме
            </h1>

            <div className="max-w-4xl mx-auto">
                <AboutCard limit={false} />
            </div>
        </div>
    )
}
