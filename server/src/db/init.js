// Создаёт базу и таблицы, при первом запуске заполняет примерами.
// Запуск: npm run db:init            (с примерами)
//         npm run db:init -- --no-seed (только таблицы)
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config');
const { news } = require('../data/news');
const { schedule } = require('../data/schedule');
const { temple } = require('../data/temple');

const toSqlDateTime = (iso) => new Date(iso).toISOString().slice(0, 19).replace('T', ' ');

async function main() {
    const { host, port, user, password, database } = config.db;

    if (!/^[\w$]+$/.test(database)) {
        throw new Error('DB_NAME может содержать только буквы, цифры, _ и $');
    }

    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
        charset: 'utf8mb4',
        multipleStatements: true
    });

    try {
        await connection.query(
            `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
        );
        await connection.query(`USE \`${database}\``);
        await connection.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
        console.log(`Таблицы в базе "${database}" готовы`);

        if (process.argv.includes('--no-seed')) return;

        const [[{ total: newsCount }]] = await connection.query('SELECT COUNT(*) AS total FROM news');
        if (newsCount === 0) {
            for (const item of news) {
                await connection.query(
                    `INSERT INTO news (title, excerpt, content, date, published_at, featured_image, images, is_featured)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        item.title,
                        item.excerpt,
                        item.content,
                        item.date,
                        toSqlDateTime(item.publishedAt),
                        item.featuredImage,
                        JSON.stringify(item.images || []),
                        item.isFeatured ? 1 : 0
                    ]
                );
            }
            console.log(`Добавлено новостей: ${news.length}`);
        }

        for (const entry of schedule) {
            await connection.query(
                `INSERT IGNORE INTO schedule_entries (service_date, saints, services, note) VALUES (?, ?, ?, ?)`,
                [entry.id, entry.saints, JSON.stringify(entry.services), entry.note || '']
            );
        }

        await connection.query(
            `INSERT IGNORE INTO temple_info (id, name, short_name, location, description, phone, email, website, social)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                temple.name,
                temple.shortName,
                temple.location,
                temple.description,
                temple.contacts.phone,
                temple.contacts.email,
                temple.contacts.website,
                JSON.stringify(temple.social)
            ]
        );
        console.log('Примеры расписания и данных о храме добавлены (существующие записи не тронуты)');
    } finally {
        await connection.end();
    }
}

main().catch((error) => {
    console.error('Не удалось инициализировать базу:', error.message);
    process.exit(1);
});
