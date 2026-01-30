'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Cross, Church, Calendar, Phone, MapPin, Newspaper } from 'lucide-react'

const navItems = [
    { name: 'О храме', href: '/about', icon: Church },
    { name: 'Расписание', href: '/schedule', icon: Calendar },
    { name: 'Новости', href: '/news', icon: Newspaper },
    { name: 'Контакты', href: '/contacts', icon: Phone },
]

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-amber-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <Cross className="h-10 w-10 text-church-red" />
                            <div className="absolute inset-0 bg-church-gold/10 rounded-full blur-sm group-hover:blur-md transition-all" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-church-brown">
                                Храм Серафима Саровского
                            </h1>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>с. Палкино, Антроповский район</span>
                            </div>
                        </div>
                    </Link>

                    {/* Десктопная навигация */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-2 text-gray-700 hover:text-church-brown transition-colors px-3 py-2 rounded-lg hover:bg-amber-50"
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Кнопка мобильного меню */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                        aria-label="Меню"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Мобильное меню */}
                {isMenuOpen && (
                    <div className="md:hidden pb-6">
                        <nav className="flex flex-col gap-4 mt-4">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-3 text-gray-700 hover:text-church-brown transition-colors px-4 py-3 rounded-lg hover:bg-amber-50"
                                    >
                                        {Icon && <Icon className="h-5 w-5" />}
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
