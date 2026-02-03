// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css'
import Header from './components/Header';
import Footer from './components/Footer'

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
    title: 'Храм Преподобного Серафима Саровского',
    description: 'Официальный сайт храма Серафима Саровского',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
            <body className={inter.className}>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
