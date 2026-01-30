import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './global.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
    subsets: ['cyrillic', 'latin'],
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'Храм преподобного Серафима Саровского',
    description: 'Официальный сайт храма в селе Палкино Антроповского района',
    keywords: ['храм', 'Серафим Саровский', 'Палкино', 'Антроповский район', 'православие'],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru" className={`${inter.variable}`}>
            <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
