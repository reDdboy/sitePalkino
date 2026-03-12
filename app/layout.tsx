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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" suppressHydrationWarning>
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
