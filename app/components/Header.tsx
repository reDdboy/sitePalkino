'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown } from 'lucide-react'
import ThemeToggle from './ThemeToggle/ThemeToggle'

type NavLink = {
    name: string
    link: string
}

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAboutOpen, setIsAboutOpen] = useState(false)
    const aboutRef = useRef<HTMLDivElement>(null)

    const handleClose = () => setIsOpen(false)

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Закрытие dropdown по клику вне
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
                setIsAboutOpen(false)
            }
        }
        document.addEventListener('mousedown', onClickOutside)
        return () => document.removeEventListener('mousedown', onClickOutside)
    }, [])

    // Закрытие по Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsAboutOpen(false)
                setIsOpen(false)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    const links: NavLink[] = [
        { name: 'Расписание', link: '/schedule' },
        { name: 'Требы', link: '/requests' },
        { name: 'Деятельность', link: '/activities' },
        { name: 'Помочь храму', link: '/donate' },
    ]

    const linksAbout: NavLink[] = [
        { name: 'Заглушка', link: '/' },
        { name: 'Заглушка', link: '/' },
        { name: 'Заглушка', link: '/' },
        { name: 'Заглушка', link: '/' },
    ]

    return (
        <>
            <header className="bg-background/70 backdrop-blur-md border-b border-church-gold/40 dark:border-church-gold/60 py-2 sm:py-3 transition-colors duration-300 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-2">
                        {/* Левая часть: фото и название */}
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                                <Link
                                    href="/"
                                    className="relative block w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md border-2 border-church-gold/30"
                                >
                                    <Image
                                        src="/hram.jpg"
                                        alt="Храм Серафима Саровского"
                                        fill
                                        sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, (max-width: 1024px) 80px, 96px"
                                        className="object-cover"
                                        priority
                                    />
                                </Link>
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

                        {/* Десктопное меню */}
                        <div className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0">
                            <nav className="flex items-center gap-4 xl:gap-6">
                                {links.map((link) => (
                                    <Link
                                        key={link.link}
                                        href={link.link}
                                        className="font-sans text-sm xl:text-base text-foreground/80 hover:text-church-red transition-colors py-2 whitespace-nowrap"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                {/* Dropdown меню */}
                                <div className="relative" ref={aboutRef}>
                                    <button
                                        onClick={() => setIsAboutOpen((v) => !v)}
                                        aria-expanded={isAboutOpen}
                                        aria-haspopup="true"
                                        className="flex items-center gap-1 font-sans text-sm xl:text-base text-foreground/80 hover:text-church-red transition-colors py-2 whitespace-nowrap"
                                    >
                                        О Храме
                                        <ChevronDown
                                            size={16}
                                            className={`transition-transform duration-200 ${isAboutOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    <div
                                        className={`absolute top-full right-0 mt-2 w-64 py-4 bg-background border border-church-gold/30 rounded-[12px] shadow-xl transition-all duration-200 origin-top-right ${isAboutOpen
                                            ? 'opacity-100 visible scale-100'
                                            : 'opacity-0 invisible scale-95'
                                            }`}
                                    >
                                        {linksAbout.map((link, idx) => (
                                            <Link
                                                key={`${link.link}-${idx}`}
                                                href={link.link}
                                                onClick={() => setIsAboutOpen(false)}
                                                className="block font-sans text-sm text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-colors py-2 px-4"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </nav>
                            <ThemeToggle />
                        </div>

                        {/* Мобильное меню: кнопка */}
                        <div className="lg:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <ThemeToggle />
                            <button
                                className="p-1.5 sm:p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors relative z-50"
                                onClick={() => setIsOpen((v) => !v)}
                                aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
                                aria-expanded={isOpen}
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={handleClose}
                aria-hidden="true"
            />
            <aside
                className={`fixed top-0 right-0 h-full w-64 sm:w-80 bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-hidden={!isOpen}
            >
                <div className="flex items-center justify-between p-4 border-b border-church-gold/30">
                    <h2 className="font-serif text-lg font-semibold text-foreground px-4">
                        Меню
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-church-gold/10 rounded-[12px] transition-colors"
                        aria-label="Закрыть меню"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col p-4 gap-2 overflow-y-auto">
                    {links.map((link) => (
                        <Link
                            key={link.link}
                            href={link.link}
                            onClick={handleClose}
                            className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                        >
                            {link.name}
                        </Link>
                    ))}

                    <h3 className="font-semibold italic text-lg pt-6 text-church-brown px-4">
                        О Храме
                    </h3>

                    {linksAbout.map((link, idx) => (
                        <Link
                            key={`${link.link}-${idx}`}
                            href={link.link}
                            onClick={handleClose}
                            className="font-sans text-base sm:text-lg text-foreground/80 hover:text-church-red hover:bg-church-gold/10 transition-all duration-200 py-3 px-4 rounded-[12px] hover:pl-6"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Header
