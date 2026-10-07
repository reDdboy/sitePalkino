"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-10 h-10 bg-church-gold/10 rounded-[12px] border border-church-gold/20"></div>
        )
    }

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-[12px] bg-church-light border-2 border-church-gold/40 flex items-center justify-center hover:bg-church-gold/10 transition-all duration-300"
            aria-label="Переключить тему"
        >
            <div className="relative w-5 h-5 text-church-brown">
                <Sun className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === "light" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`} />
                <Moon className={`absolute inset-0 w-full h-full transition-all duration-300 ${theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`} />
            </div>
        </button>
    )
}

export default ThemeToggle
