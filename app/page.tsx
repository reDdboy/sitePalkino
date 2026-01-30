import { Church, Calendar, BookOpen, Heart, Cross, Bell, Phone } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Герой секция */}
            <div className="text-center max-w-4xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-church-gold/10 rounded-2xl mb-8">
                    <Church className="h-20 w-20 text-church-brown" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-church-brown mb-6">
                    Добро пожаловать в храм преподобного Серафима Саровского
                </h1>

                <p className="text-xl text-gray-700 mb-10">
                    Духовный центр православной жизни в селе Палкино.
                    Мы открыты для всех, кто ищет Бога, молитвы и духовной поддержки.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/schedule"
                        className="inline-flex items-center justify-center gap-3 bg-church-brown text-white px-8 py-4 rounded-lg hover:bg-church-gold hover:text-gray-900 transition-all duration-300 font-semibold text-lg"
                    >
                        <Calendar className="h-5 w-5" />
                        Расписание богослужений
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center gap-3 bg-white text-church-brown border-2 border-church-brown px-8 py-4 rounded-lg hover:bg-amber-50 transition-all duration-300 font-semibold text-lg"
                    >
                        <BookOpen className="h-5 w-5" />
                        О нашем храме
                    </Link>
                </div>
            </div>

            {/* Карточки с информацией */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="h-16 w-16 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                        <Cross className="h-8 w-8 text-amber-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-church-brown mb-4">Богослужения</h3>
                    <p className="text-gray-600 mb-6">
                        Регулярные богослужения, литургии, молебны и другие церковные таинства.
                    </p>
                    <Link href="/schedule" className="text-church-brown font-semibold hover:underline inline-flex items-center gap-2">
                        Узнать расписание
                        <span>→</span>
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="h-16 w-16 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                        <Heart className="h-8 w-8 text-red-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-church-brown mb-4">Духовная жизнь</h3>
                    <p className="text-gray-600 mb-6">
                        Проповеди, духовные беседы, воскресная школа и общинная жизнь.
                    </p>
                    <Link href="/about" className="text-church-brown font-semibold hover:underline inline-flex items-center gap-2">
                        Узнать больше
                        <span>→</span>
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <Bell className="h-8 w-8 text-blue-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-church-brown mb-4">Новости прихода</h3>
                    <p className="text-gray-600 mb-6">
                        Следите за событиями, праздниками и жизнью нашей церковной общины.
                    </p>
                    <Link href="/news" className="text-church-brown font-semibold hover:underline inline-flex items-center gap-2">
                        Читать новости
                        <span>→</span>
                    </Link>
                </div>
            </div>

            {/* Блок с цитатой */}
            <div className="bg-gradient-to-r from-church-brown to-church-gold rounded-2xl p-10 text-center text-white mb-16">
                <div className="max-w-3xl mx-auto">
                    <blockquote className="text-2xl italic mb-6">
                        "Стяжи дух мирен, и вокруг тебя спасутся тысячи"
                    </blockquote>
                    <p className="text-amber-100">— Преподобный Серафим Саровский</p>
                </div>
            </div>

            {/* Призыв к действию */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-church-brown mb-6">
                    Присоединяйтесь к нашей общине
                </h2>
                <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
                    Мы всегда рады новым прихожанам. Приходите на богослужения,
                    участвуйте в таинствах, становитесь частью нашей церковной семьи.
                </p>
                <Link
                    href="/contacts"
                    className="inline-flex items-center justify-center gap-3 bg-church-red text-white px-8 py-4 rounded-lg hover:bg-red-800 transition-all duration-300 font-semibold text-lg"
                >
                    <Phone className="h-5 w-5" />
                    Связаться с храмом
                </Link>
            </div>
        </div>
    )
}
