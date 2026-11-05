// Единый запуск локальной разработки: API + сайт.
// Запускается командой `npm run dev` из корня проекта.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const root = process.cwd();
const children = new Set();
let shuttingDown = false;

function start(label, args, cwd) {
    const child = spawn(npm, args, {
        cwd,
        stdio: 'inherit',
        env: process.env,
    });

    children.add(child);
    child.on('exit', (code, signal) => {
        children.delete(child);
        if (!shuttingDown) {
            console.error(`\n[dev] ${label} остановился (code=${code}, signal=${signal}).`);
            shutdown(code ?? 1);
        }
    });

    return child;
}

function shutdown(code = 0) {
    if (shuttingDown) return;
    shuttingDown = true;

    for (const child of children) {
        child.kill('SIGTERM');
    }

    setTimeout(() => process.exit(code), 300);
}

async function waitForApi(url, timeoutMs = 20_000) {
    const started = Date.now();

    while (Date.now() - started < timeoutMs) {
        try {
            const response = await fetch(url);
            if (response.ok || response.status === 503) return true;
        } catch {
            // API ещё запускается
        }
        await new Promise((resolve) => setTimeout(resolve, 400));
    }

    return false;
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log('[dev] Запускаю API на http://localhost:3001 ...');
start('API', ['--prefix', 'server', 'run', 'dev'], root);

if (!existsSync('server/admin-panel/dist/index.html')) {
    console.warn(
        '[dev] Админка ещё не собрана. Выполните `npm run setup:admin`, иначе /admin вернёт 503.'
    );
}

const apiReady = await waitForApi('http://127.0.0.1:3001/api/health');
if (!apiReady) {
    console.warn('[dev] API не ответил за 20 секунд. Сайт всё равно запускаю, но данные могут быть пустыми.');
}

console.log('[dev] Запускаю сайт на http://localhost:3000 ...');
start('сайт', ['run', 'dev:web'], root);

console.log('');
console.log('  Сайт:       http://localhost:3000');
console.log('  API:        http://localhost:3001/api/health');
console.log('  Админка:    http://localhost:3001/admin');
console.log('');
console.log('  Остановить: Ctrl+C');
console.log('');
