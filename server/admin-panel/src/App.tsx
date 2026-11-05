import { useCallback, useEffect, useState } from 'react';
import { api } from './api';
import Login from './components/Login';
import NewsPanel from './components/NewsPanel';
import SchedulePanel from './components/SchedulePanel';
import { navigate, usePath } from './router';

type AuthState = 'loading' | 'in' | 'out';

export default function App() {
    const [auth, setAuth] = useState<AuthState>('loading');

    // Вкладка берётся из адреса (#/news, #/schedule), поэтому после F5 открывается та же
    const path = usePath();
    const tab = path.startsWith('/schedule') ? 'schedule' : 'news';

    useEffect(() => {
        api.session()
            .then((result) => setAuth(result.authenticated ? 'in' : 'out'))
            .catch(() => setAuth('out'));
    }, []);

    // Сессия истекла или сервер перезапущен -> экран входа. Адрес не трогаем,
    // поэтому после входа вы окажетесь на том же месте.
    const handleUnauthorized = useCallback(() => setAuth('out'), []);

    async function logout() {
        try {
            await api.logout();
        } finally {
            setAuth('out');
        }
    }

    if (auth === 'loading') {
        return <div className="center muted">Загрузка…</div>;
    }

    if (auth === 'out') {
        return <Login onSuccess={() => setAuth('in')} />;
    }

    return (
        <div className="shell">
            <header className="topbar">
                <h1>Панель управления храмом</h1>
                <nav className="tabs">
                    <button
                        type="button"
                        className={tab === 'news' ? 'tab active' : 'tab'}
                        onClick={() => navigate('/news')}
                    >
                        Новости
                    </button>
                    <button
                        type="button"
                        className={tab === 'schedule' ? 'tab active' : 'tab'}
                        onClick={() => navigate('/schedule')}
                    >
                        Расписание
                    </button>
                </nav>
                <button type="button" className="btn ghost" onClick={logout}>
                    Выйти
                </button>
            </header>

            <main className="content">
                {tab === 'news' ? (
                    <NewsPanel onUnauthorized={handleUnauthorized} />
                ) : (
                    <SchedulePanel onUnauthorized={handleUnauthorized} />
                )}
            </main>
        </div>
    );
}
