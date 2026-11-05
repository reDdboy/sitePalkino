const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const rateLimit = require('express-rate-limit');
const multer = require('multer');

const config = require('./config');
const content = require('./services/contentService');
const { HttpError, badRequest, parseLimit } = require('./services/validators');

const app = express();

app.disable('x-powered-by');
if (config.trustProxy) {
    app.set('trust proxy', config.trustProxy);
}

app.use(
    helmet({
        // Картинки из /uploads должны показываться и на основном сайте (другой домен)
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                // Иначе при работе по http браузер пытается грузить файлы админки по https
                'upgrade-insecure-requests': null,
                'img-src': ["'self'", 'data:', 'blob:']
            }
        }
    })
);

// Публичные методы: читать может любой сайт, cookie не нужны
app.use(['/api/health', '/api/info', '/api/news', '/api/schedule'], cors());

// Админские методы: только с указанных сайтов (CORS_ORIGIN) и с cookie
app.use(
    '/api/admin',
    cors({
        origin: config.corsOrigins.length ? config.corsOrigins : false,
        credentials: true
    })
);

app.use(express.json({ limit: '1mb' }));

app.use(
    '/api/admin',
    session({
        name: 'palkino.sid',
        secret: config.sessionSecret,
        // Сессии живут в памяти процесса: после перезапуска сервера нужно войти заново
        store: new MemoryStore({ checkPeriod: 60 * 60 * 1000 }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: 'auto', // Secure ставится сам при HTTPS (за прокси нужен TRUST_PROXY=1)
            maxAge: 1000 * 60 * 60 * 12
        }
    })
);

const wrap = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function requireAdmin(req, res, next) {
    if (req.session && req.session.adminAuthenticated) {
        return next();
    }
    return res.status(401).json({ error: 'Требуется вход' });
}

const sha256 = (value) => crypto.createHash('sha256').update(String(value)).digest();
const passwordMatches = (candidate) =>
    crypto.timingSafeEqual(sha256(candidate), sha256(config.adminPassword));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.isTest,
    handler: (req, res) =>
        res.status(429).json({ error: 'Слишком много попыток входа. Попробуйте через 15 минут.' })
});

// ---------- Загрузка картинок ----------

const IMAGE_EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
};

fs.mkdirSync(config.uploadDir, { recursive: true });

const upload = multer({
    storage: multer.diskStorage({
        destination: config.uploadDir,
        // Имя файла придумываем сами, расширение берём из типа: чужое имя не используем
        filename: (req, file, cb) =>
            cb(null, crypto.randomBytes(12).toString('hex') + IMAGE_EXTENSIONS[file.mimetype])
    }),
    limits: { fileSize: config.maxUploadBytes, files: 10 },
    fileFilter: (req, file, cb) => {
        if (IMAGE_EXTENSIONS[file.mimetype]) return cb(null, true);
        return cb(badRequest('Допустимы только картинки JPG, PNG, WebP и GIF'));
    }
});

app.use('/uploads', express.static(config.uploadDir, { index: false, maxAge: '7d' }));

// ---------- Публичное API ----------

app.get(
    '/api/health',
    wrap(async (req, res) => {
        const storage = await content.storageStatus();
        res.status(storage.ok ? 200 : 503).json({
            status: storage.ok ? 'ok' : 'degraded',
            service: 'palkino-api',
            database: storage.mode,
            databaseOk: storage.ok,
            timestamp: new Date().toISOString()
        });
    })
);

app.get(
    '/api/info',
    wrap(async (req, res) => {
        res.json(await content.getTempleInfo());
    })
);

app.get(
    '/api/news',
    wrap(async (req, res) => {
        res.json(
            await content.getNews({
                limit: parseLimit(req.query.limit),
                featuredOnly: req.query.featured === 'true'
            })
        );
    })
);

app.get(
    '/api/news/:id',
    wrap(async (req, res) => {
        const item = await content.getNewsById(req.params.id);
        if (!item) throw new HttpError(404, 'Новость не найдена');
        res.json(item);
    })
);

app.get(
    '/api/schedule',
    wrap(async (req, res) => {
        res.json(
            await content.getSchedule({
                limit: parseLimit(req.query.limit),
                upcomingOnly: req.query.upcoming !== 'false'
            })
        );
    })
);

app.get(
    '/api/schedule/upcoming',
    wrap(async (req, res) => {
        res.json(await content.getSchedule({ limit: parseLimit(req.query.limit), upcomingOnly: true }));
    })
);

// ---------- Админское API ----------

app.post('/api/admin/login', loginLimiter, (req, res, next) => {
    const password = req.body && req.body.password;

    if (typeof password !== 'string' || !passwordMatches(password)) {
        return res.status(401).json({ error: 'Неверный пароль' });
    }

    // Новая сессия после входа защищает от подмены идентификатора сессии
    return req.session.regenerate((error) => {
        if (error) return next(error);
        req.session.adminAuthenticated = true;
        return res.json({ ok: true });
    });
});

app.post('/api/admin/logout', (req, res, next) => {
    req.session.destroy((error) => {
        if (error) return next(error);
        res.clearCookie('palkino.sid');
        return res.json({ ok: true });
    });
});

app.get('/api/admin/session', (req, res) => {
    res.json({ authenticated: Boolean(req.session && req.session.adminAuthenticated) });
});

app.get(
    '/api/admin/news',
    requireAdmin,
    wrap(async (req, res) => {
        res.json(await content.getNews({ limit: parseLimit(req.query.limit) }));
    })
);

app.post(
    '/api/admin/news',
    requireAdmin,
    wrap(async (req, res) => {
        res.status(201).json(await content.createNews(req.body));
    })
);

app.put(
    '/api/admin/news/:id',
    requireAdmin,
    wrap(async (req, res) => {
        const item = await content.updateNews(req.params.id, req.body);
        if (!item) throw new HttpError(404, 'Новость не найдена');
        res.json(item);
    })
);

app.delete(
    '/api/admin/news/:id',
    requireAdmin,
    wrap(async (req, res) => {
        const deleted = await content.deleteNews(req.params.id);
        if (!deleted) throw new HttpError(404, 'Новость не найдена');
        res.json({ deleted: true });
    })
);

app.get(
    '/api/admin/schedule',
    requireAdmin,
    wrap(async (req, res) => {
        res.json(await content.getSchedule({ limit: parseLimit(req.query.limit), upcomingOnly: false }));
    })
);

app.post(
    '/api/admin/schedule',
    requireAdmin,
    wrap(async (req, res) => {
        res.status(201).json(await content.createScheduleEntry(req.body));
    })
);

app.put(
    '/api/admin/schedule/:date',
    requireAdmin,
    wrap(async (req, res) => {
        const item = await content.updateScheduleEntry(req.params.date, req.body);
        if (!item) throw new HttpError(404, 'Запись расписания не найдена');
        res.json(item);
    })
);

app.delete(
    '/api/admin/schedule/:date',
    requireAdmin,
    wrap(async (req, res) => {
        const deleted = await content.deleteScheduleEntry(req.params.date);
        if (!deleted) throw new HttpError(404, 'Запись расписания не найдена');
        res.json({ deleted: true });
    })
);

app.post('/api/admin/upload', requireAdmin, upload.array('files', 10), (req, res) => {
    if (!req.files || !req.files.length) {
        throw badRequest('Выберите хотя бы один файл');
    }
    res.status(201).json(req.files.map((file) => ({ src: `/uploads/${file.filename}`, size: file.size })));
});

// ---------- Админ-панель (собранный React) ----------

const adminIndex = path.join(config.adminDist, 'index.html');
const serveAdminAssets = express.static(config.adminDist, { index: false });

app.use('/admin', (req, res, next) => {
    if (!fs.existsSync(adminIndex)) {
        return res
            .status(503)
            .type('text/plain; charset=utf-8')
            .send('Админ-панель не собрана. Выполните: npm run build');
    }
    return serveAdminAssets(req, res, next);
});

app.get(/^\/admin(\/.*)?$/, (req, res) => {
    res.sendFile(adminIndex);
});

// ---------- 404 и ошибки ----------

app.use((req, res) => {
    res.status(404).json({ error: 'Не найдено' });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Некорректный JSON в теле запроса' });
    }
    if (error.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Слишком большой запрос' });
    }
    if (error instanceof multer.MulterError) {
        const message =
            error.code === 'LIMIT_FILE_SIZE'
                ? `Файл больше ${Math.round(config.maxUploadBytes / 1024 / 1024)} МБ`
                : 'Не удалось принять файлы (не более 10 штук за раз)';
        return res.status(400).json({ error: message });
    }
    if (error instanceof HttpError) {
        return res.status(error.status).json({ error: error.message });
    }

    console.error(error);
    // Ошибки MySQL и сети: клиенту подробности не показываем
    const dbDown = config.db.enabled && /ECONNREFUSED|ETIMEDOUT|ENOTFOUND|PROTOCOL_|ER_/.test(
        `${error.code || ''}`
    );
    return res
        .status(dbDown ? 503 : 500)
        .json({ error: dbDown ? 'База данных недоступна' : 'Внутренняя ошибка сервера' });
});

if (require.main === module) {
    const server = app.listen(config.port, () => {
        console.log(`API запущен: http://localhost:${config.port}  (хранилище: ${config.db.enabled ? 'MySQL' : 'память'})`);
        console.log(`Админка: http://localhost:${config.port}/admin`);
    });

    const shutdown = () => {
        server.close(() => content.closeStorage().finally(() => process.exit(0)));
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

module.exports = app;
