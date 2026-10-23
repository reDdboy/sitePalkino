
"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

const themes = [
    { value: "light", label: "Светлая" },
    { value: "system", label: "Системная" },
    { value: "dark", label: "Тёмная" },
] as const

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="w-full max-w-[340px]">
            <div
                role="group"
                aria-label="Цветовая тема сайта"
                className="flex w-full items-center gap-1 rounded-full
                    border border-church-gold/20
                    bg-church-gold/10 p-1"
            >
                {themes.map((item) => {
                    const active = mounted && theme === item.value

                    return (
                        <button
                            key={item.value}
                            type="button"
                            disabled={!mounted}
                            onClick={() => setTheme(item.value)}
                            aria-pressed={active}
                            className={`
                                flex-1 rounded-full px-2 py-2
                                text-sm sm:text-base font-medium
                                whitespace-nowrap
                                transition-colors duration-200
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-church-gold
                                ${active
                                    ? "bg-church-brown text-church-light shadow-sm"
                                    : "text-foreground/70 hover:bg-church-gold/10 hover:text-foreground"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
