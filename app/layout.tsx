import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
    title: 'Храм преподобного Серафима Саровского',
    description: 'Сайт храма Серафима Саровского в селе Палкино Антроповского района',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru">
            <body>
                <div className="min-h-screen bg-amber-50">
                    <header className="bg-white shadow-sm border-b border-amber-200">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <h1 className="text-2xl font-bold text-amber-900">
                                Храм преподобного Серафима Саровского
                            </h1>
                            <p className="text-gray-600">
                                с. Палкино, Антроповский район
                            </p>
                        </div>
                    </header>
                    <main className="max-w-7xl mx-auto px-4 py-8">
                        {children}
                    </main>
                    <footer className="bg-amber-900 text-white py-6 mt-8">
                        <div className="max-w-7xl mx-auto px-4 text-center">
                            <p>© {new Date().getFullYear()} Храм прп. Серафима Саровского</p>
                            <p className="text-amber-200 text-sm mt-2">Русская Православная Церковь</p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
