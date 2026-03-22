'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle/ThemeToggle'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(false)
    }

    const links = [
        {
            name: "Расписание",
            link: "/shedule",
        },
        {
            name: "Требы",
            link: "/requests",
        },
        {
            name: "Деятельность",
            link: "/activities",
        },
        {
            name: "Помочь храму",
            link: "/donate",
        },
    ]

    return (
        <header className="bg-background border-b border-church-gold/40 dark:border-church-gold/60 py-2 sm:py-3 transition-colors duration-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-2">
                    {/* Левая часть: фото и название */}
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                        {/* Фото меньше на мобильных */}
                        <div className="flex-shrink-0">
                            <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md border-2 border-church-gold/30">
                                <Image
                                    src="/hram.jpg"
                                    alt="Храм Серафима Саровского"
                                    fill
                                    sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, (max-width: 1024px) 80px, 96px"
                                    className="object-fill"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Название - в одну строку на мобильных */}
                        <div className="text-left min-w-0 flex-1">
                            <h1 className="font-serif text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground leading-tight truncate">
                                ХРАМ ПРЕПОДОБНОГО
                            </h1>
                            <div className="font-serif text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground tracking-wider leading-tight truncate">
                                СЕРАФИМА САРОВСКОГО
                            </div>
                        </div>
                    </div>

                    {/* Правая часть: кнопки */}
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="hidden md:flex items-center gap-2 lg:gap-4">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.link}
                                    className="font-sans text-sm lg:text-base text-foreground/80 hover:text-church-red transition-colors px-2 lg:px-3 py-1.5 hover:underline underline-offset-2 whitespace-nowrap"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Тема и мобильное меню */}
                        <ThemeToggle />
                        <button
                            className="md:hidden p-1.5 sm:p-2 hover:bg-church-gold/10 rounded-lg transition-colors relative z-50"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Меню"
                        >
                            {isOpen ? <X size={20} className="sm:w-5 sm:h-5" /> : <Menu size={20} className="sm:w-5 sm:h-5" />}
                        </button>
                    </div>
                </div>

                {/* Мобильное меню */}
                {isOpen && (
                    <div className="md:hidden mt-2 py-2 border-t border-church-gold/30 dark:border-church-gold/50 animate-[slideDown_0.2s_ease]">
                        <div className="flex flex-col">
                            {links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.link}
                                    onClick={handleClick}
                                    className="font-sans text-sm sm:text-base text-foreground/80 hover:text-church-red transition-all duration-200 py-2.5 sm:py-3 px-3 sm:px-4 hover:bg-church-gold/10 rounded-lg hover:pl-4 sm:hover:pl-5"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
