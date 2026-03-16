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

    return (
        <header className="bg-background border-b border-church-gold/40 dark:border-church-gold/60 py-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
                    {/* Левая часть: фото и название */}
                    <div className="flex items-center gap-3 sm:gap-4 md:gap-6 w-full lg:w-auto">
                        {/* Фотография - исправленные размеры */}
                        <div className="flex-shrink-0">
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md border-2 border-church-gold/30">
                                <Image
                                    src="/hram.jpg"
                                    alt="Храм Серафима Саровского"
                                    fill
                                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Название храма */}
                        <div className="text-center lg:text-left">
                            <h1 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground leading-tight">
                                ХРАМ ПРЕПОДОБНОГО
                            </h1>
                            <div className="font-serif text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground tracking-wider leading-tight">
                                СЕРАФИМА САРОВСКОГО
                            </div>
                        </div>
                    </div>

                    {/* Навигация */}
                    <nav className="w-full lg:w-auto">
                        {/* Десктопная навигация */}
                        <div className="hidden md:flex flex-wrap justify-center lg:justify-end items-center gap-2 lg:gap-4">
                            <Link
                                href="/schedule"
                                className="font-sans text-sm lg:text-base text-foreground/80 hover:text-church-red transition-colors px-2 lg:px-3 py-1.5 hover:underline underline-offset-2"
                            >
                                Расписание
                            </Link>
                            <Link
                                href="/requests"
                                className="font-sans text-sm lg:text-base text-foreground/80 hover:text-church-red transition-colors px-2 lg:px-3 py-1.5 hover:underline underline-offset-2"
                            >
                                Требы
                            </Link>
                            <Link
                                href="/activities"
                                className="font-sans text-sm lg:text-base text-foreground/80 hover:text-church-red transition-colors px-2 lg:px-3 py-1.5 hover:underline underline-offset-2"
                            >
                                Деятельность
                            </Link>
                            <Link
                                href="/donate"
                                className="font-sans text-sm lg:text-base text-foreground/80 hover:text-church-red transition-colors px-2 lg:px-3 py-1.5 hover:underline underline-offset-2"
                            >
                                Помочь храму
                            </Link>
                            <div className="ml-2">
                                <ThemeToggle />
                            </div>
                        </div>

                        {/* Мобильная навигация */}
                        <div className="flex items-center justify-end space-x-2 md:hidden">
                            <ThemeToggle />
                            <button
                                className="p-2 hover:bg-church-gold/10 rounded-lg transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Меню"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        {/* Мобильное меню */}
                        {isOpen && (
                            <div className="md:hidden mt-4 py-3 border-t border-church-gold/30 dark:border-church-gold/50">
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href="/schedule"
                                        onClick={handleClick}
                                        className="font-sans text-base text-foreground/80 hover:text-church-red transition-colors py-2 px-3 hover:bg-church-gold/5 rounded-lg"
                                    >
                                        Расписание
                                    </Link>
                                    <Link
                                        href="/requests"
                                        onClick={handleClick}
                                        className="font-sans text-base text-foreground/80 hover:text-church-red transition-colors py-2 px-3 hover:bg-church-gold/5 rounded-lg"
                                    >
                                        Требы и целевые сборы
                                    </Link>
                                    <Link
                                        href="/activities"
                                        onClick={handleClick}
                                        className="font-sans text-base text-foreground/80 hover:text-church-red transition-colors py-2 px-3 hover:bg-church-gold/5 rounded-lg"
                                    >
                                        Деятельность
                                    </Link>
                                    <Link
                                        href="/donate"
                                        onClick={handleClick}
                                        className="font-sans text-base text-foreground/80 hover:text-church-red transition-colors py-2 px-3 hover:bg-church-gold/5 rounded-lg"
                                    >
                                        Помочь храму
                                    </Link>
                                </div>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
