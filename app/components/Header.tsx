'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle/ThemeToggle'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

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
        <>
            <header className="bg-background border-b border-church-gold/40 dark:border-church-gold/60 py-2 sm:py-3 transition-colors duration-300 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-2">
                        {/* Левая часть: фото и название */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:w-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md border-2 border-church-gold/30">
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
                            {/* Десктопное меню - скрыто, везде используем выдвижное */}
                            <ThemeToggle />
                            <button
                                className="p-1.5 sm:p-2 hover:bg-church-gold/10 rounded-lg transition-colors relative z-50"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Меню"
                            >
                                {isOpen ? <X size={20} className="sm:w-5 sm:h-5" /> : <Menu size={20} className="sm:w-5 sm:h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Выдвижное меню справа для всех устройств */}
            <>
                {/* Оверлей */}
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    onClick={handleClick}
                />

                {/* Само меню */}
                <div
                    className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    {/* Шапка меню */}
                    <div className="flex items-center justify-between p-4 border-b border-church-gold/30 dark:border-church-gold/50">
                        <h2 className="font-serif text-lg font-semibold text-foreground">Меню</h2>
                        <button
                            onClick={handleClick}
                            className="p-2 hover:bg-church-gold/10 rounded-lg transition-colors"
                            aria-label="Закрыть меню"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Ссылки */}
                    <div className="flex flex-col p-4 gap-2">
                        {links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.link}
                                onClick={handleClick}
                                className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-lg hover:pl-6"
                                style={{
                                    animation: isOpen ? `slideInFromRight 0.3s ease-out ${idx * 0.05}s forwards` : 'none',
                                    opacity: 0,
                                    transform: 'translateX(20px)'
                                }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </>

            <style jsx>{`
                @keyframes slideInFromRight {
                    0% {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
};

export default Header;
