import { FormEvent, useState } from 'react';
import { api, errorMessage } from '../api';

interface Props {
    onSuccess: () => void;
}

export default function Login({ onSuccess }: Props) {
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    async function submit(event: FormEvent) {
        event.preventDefault();
        setBusy(true);
        setError('');
        try {
            await api.login(password);
            onSuccess();
        } catch (e) {
            setError(errorMessage(e));
            setBusy(false);
        }
    }

    return (
        <div className="center">
            <form className="card login" onSubmit={submit}>
                <h1>Вход в панель</h1>
                <p className="muted">Храм Преподобного Серафима Саровского, с. Палкино</p>

                <label className="field">
                    <span>Пароль</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        autoFocus
                        required
                    />
                </label>

                {error && <div className="alert error">{error}</div>}

                <button type="submit" className="btn primary" disabled={busy || !password}>
                    {busy ? 'Входим…' : 'Войти'}
                </button>
            </form>
        </div>
    );
}
