import { Cross, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-church-brown text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Информация о храме */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold">© {new Date().getFullYear()}. Храм Серафима Саровского</h3>
                        </div>
                        <p className="text-amber-100 mb-6">
                            Храм Преподобного Серафима Саровского в селе Палкино Антроповского района РО «Галичская Епархия РПЦ (МП)»
                        </p>
                    </div>

                    {/* Контакты */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-church-gold">Контакты</h4>
                        <ul className="space-y-3">
                            {/* <li className="flex items-center gap-3">
                                <MapPin className="h-4 w-4 text-amber-200" />
                                <span>с. Палкино, Антроповский район</span>
                            </li> */}
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-amber-200" />
                                <span>Настоятель Храма о. Александр +79164904819</span>
                            </li>
                            <li className="flex items-center gap-3 px-7">
                                <span>Матушка Наталия +79999040403</span>
                            </li>
                        </ul>
                    </div>

                    {/* Быстрые ссылки */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-church-gold">Разделы сайта</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="text-amber-100 hover:text-white transition-colors">
                                    О храме
                                </a>
                            </li>
                            <li>
                                <a href="/schedule" className="text-amber-100 hover:text-white transition-colors">
                                    Расписание богослужений
                                </a>
                            </li>
                            <li>
                                <a href="/news" className="text-amber-100 hover:text-white transition-colors">
                                    Новости
                                </a>
                            </li>
                            <li>
                                <a href="/contacts" className="text-amber-100 hover:text-white transition-colors">
                                    Контакты
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer >
    )
}
