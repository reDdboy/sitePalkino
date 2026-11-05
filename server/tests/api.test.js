const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

// Окружение задаём до загрузки приложения
process.env.NODE_ENV = 'test';
process.env.DB_ENABLED = 'false';
process.env.ADMIN_PASSWORD = 'test-password';
process.env.SESSION_SECRET = 'test-secret';
process.env.UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'palkino-uploads-'));

const request = require('supertest');
const app = require('../src/server.js');

// Минимальный валидный PNG 1x1
const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
);

async function adminAgent() {
    const agent = request.agent(app);
    const response = await agent.post('/api/admin/login').send({ password: 'test-password' });
    assert.equal(response.status, 200);
    return agent;
}

const validNews = (overrides = {}) => ({
    title: 'Тестовая новость',
    date: '2026-10-01',
    excerpt: 'Кратко',
    content: 'Полный текст',
    featuredImage: '/uploads/a.jpg',
    images: [{ src: '/uploads/b.jpg', alt: 'Фото' }],
    isFeatured: false,
    ...overrides
});

// ---------- Публичное API ----------

test('GET /api/health', async () => {
    const response = await request(app).get('/api/health');
    assert.equal(response.status, 200);
    assert.equal(response.body.status, 'ok');
    assert.equal(response.body.service, 'palkino-api');
});

test('GET /api/info возвращает данные о храме', async () => {
    const response = await request(app).get('/api/info');
    assert.equal(response.status, 200);
    assert.ok(response.body.name);
    assert.ok(response.body.contacts);
});

test('GET /api/news: список, свежие первыми, limit и featured', async () => {
    const all = await request(app).get('/api/news');
    assert.equal(all.status, 200);
    assert.ok(all.body.length > 0);
    assert.ok(all.body[0].title);

    const dates = all.body.map((item) => item.publishedAt);
    assert.deepEqual(dates, [...dates].sort().reverse());

    const limited = await request(app).get('/api/news?limit=2');
    assert.equal(limited.body.length, 2);

    const featured = await request(app).get('/api/news?featured=true');
    assert.ok(featured.body.length > 0);
    assert.ok(featured.body.every((item) => item.isFeatured));
});

test('GET /api/news: некорректный limit -> 400', async () => {
    for (const bad of ['abc', '0', '-1', '101', '1.5']) {
        const response = await request(app).get(`/api/news?limit=${bad}`);
        assert.equal(response.status, 400, `limit=${bad}`);
    }
});

test('GET /api/news/:id: 200 и 404', async () => {
    const list = await request(app).get('/api/news');
    const found = await request(app).get(`/api/news/${list.body[0].id}`);
    assert.equal(found.status, 200);
    assert.equal(found.body.id, list.body[0].id);

    assert.equal((await request(app).get('/api/news/999999')).status, 404);
    assert.equal((await request(app).get('/api/news/abc')).status, 404);
});

test('публичный API разрешает чтение с других сайтов', async () => {
    const response = await request(app).get('/api/news').set('Origin', 'https://sitepalkino.ru');
    assert.equal(response.headers['access-control-allow-origin'], '*');
});

test('несуществующий маршрут -> JSON 404, кривой JSON -> JSON 400', async () => {
    const missing = await request(app).get('/api/nope');
    assert.equal(missing.status, 404);
    assert.ok(missing.body.error);

    const agent = await adminAgent();
    const broken = await agent
        .post('/api/admin/news')
        .set('Content-Type', 'application/json')
        .send('{"title": ');
    assert.equal(broken.status, 400);
    assert.ok(broken.body.error);
});

// ---------- Авторизация ----------

test('админские методы без входа -> 401', async () => {
    const checks = [
        request(app).get('/api/admin/news'),
        request(app).post('/api/admin/news').send(validNews()),
        request(app).put('/api/admin/news/1').send(validNews()),
        request(app).delete('/api/admin/news/1'),
        request(app).get('/api/admin/schedule'),
        request(app).post('/api/admin/schedule').send({ date: '2099-01-01' }),
        request(app).post('/api/admin/upload')
    ];
    for (const response of await Promise.all(checks)) {
        assert.equal(response.status, 401);
    }
});

test('вход: неверный пароль, успешный вход, сессия, выход', async () => {
    const wrong = await request(app).post('/api/admin/login').send({ password: 'nope' });
    assert.equal(wrong.status, 401);

    const missing = await request(app).post('/api/admin/login').send({});
    assert.equal(missing.status, 401);

    const agent = request.agent(app);
    assert.equal((await agent.get('/api/admin/session')).body.authenticated, false);

    assert.equal((await agent.post('/api/admin/login').send({ password: 'test-password' })).status, 200);
    assert.equal((await agent.get('/api/admin/session')).body.authenticated, true);
    assert.equal((await agent.get('/api/admin/news')).status, 200);

    assert.equal((await agent.post('/api/admin/logout')).status, 200);
    assert.equal((await agent.get('/api/admin/session')).body.authenticated, false);
    assert.equal((await agent.get('/api/admin/news')).status, 401);
});

// ---------- Новости ----------

test('новости: создать, прочитать, изменить, удалить', async () => {
    const agent = await adminAgent();

    const created = await agent.post('/api/admin/news').send(validNews({ title: '  Заголовок  ' }));
    assert.equal(created.status, 201);
    assert.equal(created.body.title, 'Заголовок');
    assert.equal(created.body.images.length, 1);
    assert.ok(created.body.id);

    const publicView = await request(app).get(`/api/news/${created.body.id}`);
    assert.equal(publicView.status, 200);

    const updated = await agent
        .put(`/api/admin/news/${created.body.id}`)
        .send({ title: 'Новый заголовок', isFeatured: true });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.title, 'Новый заголовок');
    assert.equal(updated.body.isFeatured, true);
    assert.equal(updated.body.content, 'Полный текст', 'нетронутые поля сохраняются');
    assert.equal(updated.body.publishedAt, created.body.publishedAt);

    assert.equal((await agent.delete(`/api/admin/news/${created.body.id}`)).status, 200);
    assert.equal((await agent.delete(`/api/admin/news/${created.body.id}`)).status, 404);
    assert.equal((await request(app).get(`/api/news/${created.body.id}`)).status, 404);
});

test('новости: валидация', async () => {
    const agent = await adminAgent();
    const bad = [
        validNews({ title: '   ' }),
        validNews({ title: 'x'.repeat(256) }),
        validNews({ date: '01.10.2026' }),
        validNews({ date: '2026-02-31' }),
        validNews({ featuredImage: 'javascript:alert(1)' }),
        validNews({ featuredImage: '//evil.example/x.jpg' }),
        validNews({ images: 'not-array' }),
        validNews({ images: [{ src: 'data:image/png;base64,AAAA' }] }),
        validNews({ isFeatured: 'yes' }),
        validNews({ publishedAt: 'вчера' })
    ];
    for (const payload of bad) {
        const response = await agent.post('/api/admin/news').send(payload);
        assert.equal(response.status, 400, JSON.stringify(payload).slice(0, 80));
        assert.ok(response.body.error);
    }

    assert.equal((await agent.put('/api/admin/news/999999').send(validNews())).status, 404);
});

// ---------- Расписание ----------

test('расписание: ближайшие службы', async () => {
    const agent = await adminAgent();
    const date = '2099-12-31';

    await agent.delete(`/api/admin/schedule/${date}`);
    const created = await agent.post('/api/admin/schedule').send({
        date,
        saints: 'Тест',
        services: [
            { time: '08:30', description: 'Литургия' },
            { time: '07:00', description: 'Молебен' }
        ]
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.date, '31 декабря 2099');
    assert.equal(created.body.day, 'ЧТ');
    assert.deepEqual(
        created.body.services.map((item) => item.time),
        ['07:00', '08:30'],
        'службы сортируются по времени'
    );

    const upcoming = await request(app).get('/api/schedule/upcoming?limit=100');
    assert.equal(upcoming.status, 200);
    assert.ok(upcoming.body.some((item) => item.id === date));

    const limited = await request(app).get('/api/schedule/upcoming?limit=1');
    assert.equal(limited.body.length, 1);

    await agent.delete(`/api/admin/schedule/${date}`);
});

test('расписание: прошедшие дни не попадают в upcoming, но есть в админке', async () => {
    const agent = await adminAgent();
    const date = '2000-01-01';

    await agent.delete(`/api/admin/schedule/${date}`);
    await agent.post('/api/admin/schedule').send({ date, services: [] });

    const upcoming = await request(app).get('/api/schedule?limit=100');
    assert.ok(!upcoming.body.some((item) => item.id === date));

    const admin = await agent.get('/api/admin/schedule?limit=100');
    assert.ok(admin.body.some((item) => item.id === date));

    await agent.delete(`/api/admin/schedule/${date}`);
});

test('расписание: дубль даты -> 409, изменение, удаление, валидация', async () => {
    const agent = await adminAgent();
    const date = '2098-05-05';

    await agent.delete(`/api/admin/schedule/${date}`);
    const first = await agent.post('/api/admin/schedule').send({
        date,
        saints: 'Первое',
        services: [{ time: '09:00', description: 'Литургия' }]
    });
    assert.equal(first.status, 201);

    const duplicate = await agent.post('/api/admin/schedule').send({ date, services: [] });
    assert.equal(duplicate.status, 409);

    const updated = await agent.put(`/api/admin/schedule/${date}`).send({ saints: 'Второе' });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.saints, 'Второе');
    assert.equal(updated.body.services.length, 1, 'службы сохранились');

    assert.equal((await agent.put('/api/admin/schedule/2097-01-01').send({})).status, 404);
    assert.equal((await agent.put('/api/admin/schedule/not-a-date').send({})).status, 404);

    const badTime = await agent
        .post('/api/admin/schedule')
        .send({ date: '2098-06-06', services: [{ time: '25:99', description: 'Литургия' }] });
    assert.equal(badTime.status, 400);

    const badDate = await agent.post('/api/admin/schedule').send({ date: '2098-13-01', services: [] });
    assert.equal(badDate.status, 400);

    assert.equal((await agent.delete(`/api/admin/schedule/${date}`)).status, 200);
    assert.equal((await agent.delete(`/api/admin/schedule/${date}`)).status, 404);
});

// ---------- Загрузка файлов ----------

test('загрузка: картинка сохраняется и отдаётся по /uploads', async () => {
    const agent = await adminAgent();

    const response = await agent
        .post('/api/admin/upload')
        .attach('files', PNG, { filename: 'фото с пробелом.png', contentType: 'image/png' });
    assert.equal(response.status, 201);
    assert.equal(response.body.length, 1);
    assert.match(response.body[0].src, /^\/uploads\/[0-9a-f]{24}\.png$/);

    const file = await request(app).get(response.body[0].src);
    assert.equal(file.status, 200);
    assert.equal(file.headers['content-type'], 'image/png');
    assert.equal(file.headers['cross-origin-resource-policy'], 'cross-origin');
});

test('загрузка: не картинки и пустой запрос отклоняются', async () => {
    const agent = await adminAgent();

    const html = await agent
        .post('/api/admin/upload')
        .attach('files', Buffer.from('<script>alert(1)</script>'), {
            filename: 'x.html',
            contentType: 'text/html'
        });
    assert.equal(html.status, 400);

    const empty = await agent.post('/api/admin/upload');
    assert.equal(empty.status, 400);
});
