'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(false)
    }

    return (
        <header className="bg-white border-b border-gray-200 py-4 center">
            <div className="max-w-7xl mx-auto px-4">
                {/* Основная строка с фото, названием и навигацией */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Левая часть: фото и название */}
                    <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto">
                        {/* Фотография - теперь с явными размерами для отладки */}
                        <div className="flex w-40 h-40 md:w-20 md:h-20 rounded-full overflow-hidden shadow-md flex-shrink-0 py-2">
                            <Image
                                src="/hram.jpg"
                                alt="Храм Серафима Саровского"
                                width={150}
                                height={150}
                                className="object-cover w-full h-full"
                                priority
                            />
                        </div>

                        {/* Название храма */}
                        <div className="text-center lg:text-left flex-1">
                            <h1 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                ХРАМ ПРЕПОДОБНОГО
                            </h1>
                            <div className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-wider">
                                СЕРАФИМА САРОВСКОГО
                            </div>
                        </div>
                    </div>

                    <nav className="w-full lg:w-auto">
                        <div className="hidden md:flex flex-wrap justify-center lg:justify-end gap-x-4 md:gap-x-6 gap-y-3">
                            <Link
                                href="/schedule"
                                className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 px-2 hover:underline"
                            >
                                Расписание
                            </Link>
                            <Link
                                href="/requests"
                                className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 px-2 hover:underline"
                            >
                                Требы и целевые сборы
                            </Link>
                            <Link
                                href="/activities"
                                className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 px-2 hover:underline"
                            >
                                Деятельность
                            </Link>
                            <Link
                                href="/donate"
                                className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 px-2 hover:underline"
                            >
                                Помочь храму
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 md:hidden">
                            <button
                                className="p-2"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {isOpen && (
                            <div className="md:hidden mt-4 pb-4 border-t border-gray-300 dark:border-gray-800 pt-4">
                                <div className="flex flex-col space-y-4">
                                    <Link
                                        href="/schedule"
                                        onClick={handleClick}
                                        className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 hover:underline"
                                    >
                                        Расписание
                                    </Link>
                                    <Link
                                        href="/requests"
                                        onClick={handleClick}
                                        className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 hover:underline"
                                    >
                                        Требы и целевые сборы
                                    </Link>
                                    <Link
                                        href="/activities"
                                        onClick={handleClick}
                                        className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 hover:underline"
                                    >
                                        Деятельность
                                    </Link>
                                    <Link
                                        href="/donate"
                                        onClick={handleClick}
                                        className="font-sans text-base text-gray-700 hover:text-church-red transition-colors py-1 hover:underline"
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
