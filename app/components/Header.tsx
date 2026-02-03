// app/components/Header.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4">
                {/* Основная строка с фото, названием и навигацией */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Левая часть: фото и название */}
                    <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto">
                        {/* Фотография - теперь с явными размерами для отладки */}
                        <div className="flex px-1 w-40 h-40 md:w-45 md:h-45 rounded-full overflow-hidden shadow-md flex-shrink-0 py-2">
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

                    {/* Правая часть: Навигация */}
                    <nav className="w-full lg:w-auto">
                        <div className="flex flex-wrap justify-center lg:justify-end gap-x-4 md:gap-x-6 gap-y-3">
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
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
