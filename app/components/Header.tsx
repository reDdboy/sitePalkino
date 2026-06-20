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
        { name: "Расписание", link: "/schedule" },
        { name: "Требы", link: "/requests" },
        { name: "Деятельность", link: "/activities" },
        { name: "Помочь храму", link: "/donate" },
    ]

    const linksAbout = [
        { name: "Заглушка", link: "/" },
        { name: "Заглушка", link: "/" },
        { name: "Заглушка", link: "/" },
        { name: "Заглушка", link: "/" },
    ]

    return (
        <>
            <header className="bg-background/70 backdrop-blur-md border-b border-church-gold/40 dark:border-church-gold/60 py-2 sm:py-3 transition-colors duration-300 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-2">
                        {/* Левая часть: фото и название */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md border-2 border-church-gold/30">
                                    <a href='/'>
                                        <Image
                                            src="/hram.jpg"
                                            alt="Храм Серафима Саровского"
                                            fill
                                            sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, (max-width: 1024px) 80px, 96px"
                                            // className="object-cover"
                                            priority
                                        />
                                    </a>
                                </div>
                            </div>

                            <div className="text-left min-w-0 flex-1">
                                <h1 className="font-serif text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground leading-tight truncate">
                                    ХРАМ ПРЕПОДОБНОГО
                                </h1>
                                <div className="font-serif text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground tracking-wider leading-tight truncate">
                                    СЕРАФИМА САРОВСКОГО
                                </div>
                            </div>
                        </div>

                        {/* Десктопное меню*/}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
                            <nav className="flex items-center gap-4 xl:gap-6">
                                {links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.link}
                                        className="font-sans text-base lg:text-sm xl:text-base text-foreground/80 hover:text-church-red transition-colors py-2 whitespace-nowrap"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                            <ThemeToggle />

                            <button
                                className="p-1.5 sm:p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors relative z-50"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Меню"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>

                        {/* Мобильное меню - кнопка */}
                        <div className="lg:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <ThemeToggle />
                            <button
                                className="p-1.5 sm:p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors relative z-50"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-label="Меню"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Десктопное выдвижное меню */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={handleClick}
            />
            <div
                className={`fixed top-0 right-0 h-full w-60 sm:w-70 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-church-gold/30">
                    <h2 className="font-serif text-lg font-semibold text-foreground">Меню</h2>
                    <button
                        onClick={handleClick}
                        className="p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex flex-col p-4 gap-2">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.link}
                            onClick={handleClick}
                            className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <h2 className='font-semibold text-church-brown'>О Храме</h2>

                    {linksAbout.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.link}
                            onClick={handleClick}
                            className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Мобильное выдвижное меню */}
            < div className="lg:hidden" >
                <div
                    className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    onClick={handleClick}
                />
                <div
                    className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between p-4 border-b border-church-gold/30">
                        <h2 className="font-serif text-lg font-semibold text-foreground">Меню</h2>
                        <button
                            onClick={handleClick}
                            className="p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col p-4 gap-2">
                        {links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.link}
                                onClick={handleClick}
                                className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <h2 className='font-semibold text-church-brown'>О Храме</h2>

                        {linksAbout.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.link}
                                onClick={handleClick}
                                className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div >
        </>
    );
};

export default Header;
