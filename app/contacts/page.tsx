'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, Phone, MapPin, Mail } from 'lucide-react'

const CHURCHES = [
    {
        id: 'serafim',
        name: 'Храм преподобного Серафима Саровского',
        address: 'село Палкино ул. Советская, д. 53',
        phone: '+7 (926) 490-48-19',
        image: '/hram.jpg',
        mapQuery: '58.247228, 42.938343',
    },
    {
        id: 'nikolay',
        name: 'Храм святителя Николая Чудотворца',
        address: 'село Палкино ул. Советская',
        phone: '+7 (926) 490-48-19',
        image: '/hram.jpg',
        mapQuery: '58.247228, 42.938343',
    },
] as const

const SCHEDULE = [
    { label: 'Понедельник — Пятница', value: '08:00 — 19:00' },
    { label: 'Суббота', value: '08:00 — 20:00' },
    { label: 'Воскресенье', value: '07:00 — 18:00' },
    { label: 'Праздники', value: 'по расписанию богослужений' },
]

export default function Contacts() {
    const [activeChurch, setActiveChurch] = useState(CHURCHES[0].id)
    const current = CHURCHES.find((c) => c.id === activeChurch) ?? CHURCHES[0]

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-10 text-center font-serif text-3xl font-bold text-foreground sm:text-4xl">
                Контактная информация
            </h1>

            {/* Часы работы */}
            <section className="mb-12">
                <h2 className="mb-6 flex items-center gap-2 font-serif text-2xl font-semibold text-church-brown">
                    <Clock size={22} className="text-church-gold" />
                    Часы работы
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {SCHEDULE.map((row) => (
                        <div
                            key={row.label}
                            className="rounded-[12px] border border-church-gold/30 bg-church-gold/5 p-4"
                        >
                            <div className="mb-1 text-sm text-church-gray">{row.label}</div>
                            <div className="font-sans text-base font-medium text-foreground">
                                {row.value}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Переключатель храмов */}
            <section className="mb-6">
                <div className="mb-6 flex justify-center">
                    <div className="inline-flex gap-1 rounded-[12px] border border-church-gold/30 bg-church-gold/5 p-1">
                        {CHURCHES.map((c) => (
                            <button
                                key={c.id}
                                onClick={() => setActiveChurch(c.id)}
                                className={`rounded-[10px] px-4 py-2 font-sans text-sm transition-colors ${activeChurch === c.id
                                    ? 'bg-church-gold text-background'
                                    : 'text-foreground/70 hover:text-church-red'
                                    }`}
                            >
                                {c.id === 'serafim' ? 'Серафима Саровского' : 'Николая Чудотворца'}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Фото + контакты + карта */}
            <section className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] border border-church-gold/30">
                        <Image
                            src={current.image}
                            alt={current.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-3 rounded-[12px] border border-church-gold/30 bg-church-gold/5 p-5">
                        <h3 className="font-serif text-xl font-semibold text-foreground">
                            {current.name}
                        </h3>
                        <p className="flex items-start gap-2 text-foreground/80">
                            <MapPin size={18} className="mt-0.5 shrink-0 text-church-gold" />
                            {current.address}
                        </p>
                        <a
                            href={`tel:${current.phone.replace(/[^\d+]/g, '')}`}
                            className="flex items-center gap-2 text-foreground/80 hover:text-church-red transition-colors"
                        >
                            <Phone size={18} className="shrink-0 text-church-gold" />
                            {current.phone}
                        </a>
                    </div>
                </div>

                <div className="overflow-hidden rounded-[12px] border border-church-gold/30">
                    <iframe
                        title={`Карта: ${current.name}`}
                        src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
                            current.mapQuery
                        )}&z=16`}
                        className="h-full min-h-[400px] w-full"
                        loading="lazy"
                        allowFullScreen
                    />
                </div>
            </section>
        </div>
    )
}
