const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const env = process.env;
const isProd = env.NODE_ENV === 'production';

if (isProd && (!env.ADMIN_PASSWORD || !env.SESSION_SECRET)) {
    throw new Error('В production нужно задать ADMIN_PASSWORD и SESSION_SECRET в .env');
}

const config = {
    isProd,
    isTest: env.NODE_ENV === 'test',
    port: Number(env.PORT || 3001),
    adminPassword: env.ADMIN_PASSWORD || 'admin123',
    sessionSecret: env.SESSION_SECRET || 'dev-only-session-secret',
    corsOrigins: (env.CORS_ORIGIN || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    trustProxy: env.TRUST_PROXY ? Number(env.TRUST_PROXY) || env.TRUST_PROXY : false,
    uploadDir: env.UPLOAD_DIR ? path.resolve(env.UPLOAD_DIR) : path.join(__dirname, '..', 'uploads'),
    maxUploadBytes: Number(env.MAX_UPLOAD_MB || 5) * 1024 * 1024,
    timezone: env.APP_TIMEZONE || 'Europe/Moscow',
    adminDist: path.join(__dirname, '..', 'admin-panel', 'dist'),
    db: {
        enabled: env.DB_ENABLED === 'true',
        host: env.DB_HOST || 'localhost',
        port: Number(env.DB_PORT || 3306),
        user: env.DB_USER || 'root',
        password: env.DB_PASSWORD || '',
        database: env.DB_NAME || 'palkino_site'
    }
};

module.exports = config;
