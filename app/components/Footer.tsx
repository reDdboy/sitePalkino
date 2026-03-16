import { Phone, MapPin } from 'lucide-react'

export default function Footer() {
    const links = [
        {
            name: "О храме",
            link: "/about",
        },
        {
            name: "Расписание богослужений",
            link: "/shedule",
        },
        {
            name: "Новости",
            link: "/news",
        },
        {
            name: "Помочь храму",
            link: "/donate",
        },
    ]

    return (
        <footer className="bg-background border-t border-church-gold/60 mt-16 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                    {/* Левая часть: информация о храме */}
                    <div className="flex-1">
                        <div className="mb-4">
                            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                                © {new Date().getFullYear()}. ХРАМ ПРЕПОДОБНОГО
                            </h3>
                            <div className="font-serif text-xl font-bold text-gray-900 tracking-wider">
                                СЕРАФИМА САРОВСКОГО
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Храм Преподобного Серафима Саровского в селе Палкино
                            Антроповского района РО «Галичская Епархия РПЦ (МП)»
                        </p>
                    </div>

                    {/* Центральная часть: разделы сайта */}
                    <div className="flex-1">
                        <h4 className="font-sans text-lg font-semibold mb-4 text-church-brown">
                            Разделы сайта
                        </h4>
                        <ul className="space-y-3">
                            {links.map((link, idx) => (
                                <li key={idx}>
                                    <a
                                        href={link.link}
                                        className="font-sans text-gray-700 hover:text-church-red transition-colors flex items-center gap-2"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Правая часть: контакты */}
                    <div className="flex-1">
                        <h4 className="font-sans text-lg font-semibold mb-4 text-church-brown">
                            Контакты
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-church-brown flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-sans text-gray-700 font-medium">Настоятель Храма о. Александр</div>
                                    <div className="font-sans text-gray-600">
                                        <a className="hover:text-church-red"
                                            href='tel:+79264904819'>
                                            +7 (926) 490-48-19
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-church-brown flex-shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-sans text-gray-700 font-medium">Матушка Наталия</div>
                                    <div className="font-sans text-gray-600">
                                        <a className='hover:text-church-red'
                                            href='tel:+79999040403'>
                                            +7 (999) 904-04-03
                                        </a>
                                    </div>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-church-brown flex-shrink-0 mt-0.5" />
                                <div className="font-sans text-gray-600">
                                    село Палкино,<br />
                                    Антроповский район
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer >
    )
}
