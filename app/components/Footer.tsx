import { Phone, MapPin } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
    const links = [
        {
            name: "О храме",
            link: "/about",
        },
        {
            name: "Расписание богослужений",
            link: "/schedule",
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
                                    <a className='hover:text-church-red'
                                        href='https://yandex.ru/maps/?ll=42.939254%2C58.245402&mode=poi&poi%5Bpoint%5D=42.938343%2C58.247226&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D1374904968&z=16.6'
                                        rel='noopener noreferrer'
                                        target='_blank'>
                                        село Палкино,<br />
                                        Антроповский район
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Сообщества */}
                    <div className="flex-1 w-full">
                        <h4 className="font-sans text-lg font-semibold mb-4 text-church-brown">
                            Сообщества
                        </h4>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://vk.com/hrampalkino"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-church-gold/20 rounded-xl hover:bg-church-gold/10 transition-all duration-300 hover:border-church-gold/40 hover:shadow-md group"
                            >
                                <div className="w-10 h-10 rounded-full  flex items-center justify-center flex-shrink-0 transition-colors">
                                    <Image
                                        src="/vk_logo.svg"
                                        alt="Логотип ВКонтакте"
                                        width={24}
                                        height={24}
                                        className=""
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-foreground">ВКонтакте</div>
                                    <div className="text-xs text-foreground/60">Подписывайтесь на новости</div>
                                </div>
                            </a>
                            {/*
                            <a
                                href="https://t.me/hrampalkino"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-white/5 border border-church-gold/20 rounded-xl hover:bg-church-gold/10 transition-all duration-300 hover:border-church-gold/40 hover:shadow-md group"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#26A5E4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#26A5E4]/20 transition-colors">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#26A5E4">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-medium text-foreground">Telegram</div>
                                    <div className="text-xs text-foreground/60">Присоединяйтесь к каналу</div>
                                </div>
                            </a> */}
                        </div>
                    </div>

                    {/* Левая часть: информация о храме */}
                    <div className="flex-1">
                        <div className="mb-4">
                            <h3 className="font-serif text-xl font-bold color-church-light mb-2">
                                © {new Date().getFullYear()}. ХРАМ ПРЕПОДОБНОГО
                            </h3>
                            <div className="font-serif text-xl font-bold color-church-light tracking-wider">
                                СЕРАФИМА САРОВСКОГО
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6 max-w-md">
                            Храм Преподобного Серафима Саровского в селе Палкино
                            Антроповского района РО «Галичская Епархия РПЦ (МП)»
                        </p>
                    </div>

                </div>
            </div>
        </footer>
    )
}
