import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css'
import Header from './components/Header';
import Footer from './components/Footer'
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    title: 'Храм Преподобного Серафима Саровского',
    description: 'Официальный сайт храма Серафима Саровского',
    keywords: 'храм, Серафим Саровский, храм Палкино, Палкино, православие',
    authors: [{ name: 'Храмы Прп. Серафима Саровского и Св. Николая Чудотворца на Дору' }],
    openGraph: {
        title: 'Храм Преподобного Серафима Саровского',
        description: 'Официальный сайт храма в селе Палкино',
        type: 'website',
        locale: 'ru_RU',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
            <head className={inter.className}>
                <meta charSet='UTF-8' />
                <link rel="icon" type="image/jpeg" href="hram.jpg" />
                <meta name="author" content="Семченко Александр" />
            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                // disableTransitionOnChange
                >
                    <div className='flex flex-col min-h-screen'>
                        <Header />
                        <main className='flex-grow'>{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
