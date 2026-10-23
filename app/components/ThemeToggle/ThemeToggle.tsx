"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

const themes = [
    { value: "light", label: "Светлая" },
    { value: "dark", label: "Темная" },
    { value: "system", label: "Системная" }
]

function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div
                className="h-10 w-[290px] max-w-full rounded-full border border-church-gold/20 bg-church-gold/10"
                aria-hidden="true"
            />
        )
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <div
            role="group"
            aria-label="Цветовая тема сайта"
            className="inline-flex max-w-full items-center
                rounded-full border border-church-gold/20
                bg-church-gold/10 p-1"
        >
            {themes.map((item) => {
                const active = theme === item.value

                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => setTheme(item.value)}
                        aria-pressed={active}
                        className={`
                            flex-1 whitespace-nowrap rounded-full
                            px-2 py-2 text-sm font-medium
                            sm:px-4 sm:text-base
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
    )
}

export default ThemeToggle
