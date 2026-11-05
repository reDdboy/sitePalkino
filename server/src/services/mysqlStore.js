const { getPool, testConnection, closePool } = require('../db/mysql');
const { temple } = require('../data/temple');

// DATETIME хранится в UTC: 'YYYY-MM-DD HH:MM:SS' <-> ISO-строка
const toIso = (value) => (value ? `${String(value).replace(' ', 'T')}Z` : null);
const toSqlDateTime = (iso) => new Date(iso).toISOString().slice(0, 19).replace('T', ' ');

function parseJson(value, fallback) {
    if (value === null || value === undefined || value === '') return fallback;
    if (typeof value !== 'string') return value; // драйвер уже распарсил JSON
    try {
        return JSON.parse(value);
    } catch (error) {
        return fallback;
    }
}

const query = (sql, params) => getPool().query(sql, params);

function rowToNews(row) {
    return {
        id: row.id,
        title: row.title,
        date: String(row.date).slice(0, 10),
        publishedAt: toIso(row.published_at),
        excerpt: row.excerpt || '',
        content: row.content || '',
        featuredImage: row.featured_image || null,
        images: parseJson(row.images, []),
        isFeatured: Boolean(row.is_featured)
    };
}

function rowToSchedule(row) {
    return {
        id: String(row.service_date).slice(0, 10),
        saints: row.saints || '',
        note: row.note || '',
        services: parseJson(row.services, [])
    };
}

async function ping() {
    return testConnection();
}

async function listNews({ limit, featuredOnly } = {}) {
    let sql = 'SELECT * FROM news';
    const params = [];
    if (featuredOnly) sql += ' WHERE is_featured = 1';
    sql += ' ORDER BY published_at DESC, id DESC';
    if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
    }
    const [rows] = await query(sql, params);
    return rows.map(rowToNews);
}

async function getNews(id) {
    const [rows] = await query('SELECT * FROM news WHERE id = ?', [id]);
    return rows.length ? rowToNews(rows[0]) : null;
}

async function createNews(data) {
    const [result] = await query(
        `INSERT INTO news (title, excerpt, content, date, published_at, featured_image, images, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.title,
            data.excerpt,
            data.content,
            data.date,
            toSqlDateTime(data.publishedAt),
            data.featuredImage,
            JSON.stringify(data.images),
            data.isFeatured ? 1 : 0
        ]
    );
    return getNews(result.insertId);
}

async function updateNews(id, data) {
    await query(
        `UPDATE news
            SET title = ?, excerpt = ?, content = ?, date = ?, published_at = ?,
                featured_image = ?, images = ?, is_featured = ?
          WHERE id = ?`,
        [
            data.title,
            data.excerpt,
            data.content,
            data.date,
            toSqlDateTime(data.publishedAt),
            data.featuredImage,
            JSON.stringify(data.images),
            data.isFeatured ? 1 : 0,
            id
        ]
    );
    return getNews(id);
}

async function deleteNews(id) {
    const [result] = await query('DELETE FROM news WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

async function listSchedule({ limit, fromDate } = {}) {
    let sql = 'SELECT * FROM schedule_entries';
    const params = [];
    if (fromDate) {
        sql += ' WHERE service_date >= ?';
        params.push(fromDate);
    }
    sql += ' ORDER BY service_date ASC';
    if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
    }
    const [rows] = await query(sql, params);
    return rows.map(rowToSchedule);
}

async function getScheduleEntry(id) {
    const [rows] = await query('SELECT * FROM schedule_entries WHERE service_date = ?', [id]);
    return rows.length ? rowToSchedule(rows[0]) : null;
}

async function saveScheduleEntry(data) {
    await query(
        `INSERT INTO schedule_entries (service_date, saints, services, note)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           saints = VALUES(saints), services = VALUES(services), note = VALUES(note)`,
        [data.id, data.saints, JSON.stringify(data.services), data.note]
    );
    return getScheduleEntry(data.id);
}

async function deleteScheduleEntry(id) {
    const [result] = await query('DELETE FROM schedule_entries WHERE service_date = ?', [id]);
    return result.affectedRows > 0;
}

async function getInfo() {
    const [rows] = await query('SELECT * FROM temple_info ORDER BY id LIMIT 1');
    if (!rows.length) return JSON.parse(JSON.stringify(temple));

    const row = rows[0];
    return {
        name: row.name,
        shortName: row.short_name,
        location: row.location,
        description: row.description,
        contacts: {
            address: row.location,
            phone: row.phone,
            email: row.email,
            website: row.website
        },
        social: parseJson(row.social, temple.social)
    };
}

module.exports = {
    mode: 'mysql',
    ping,
    listNews,
    getNews,
    createNews,
    updateNews,
    deleteNews,
    listSchedule,
    getScheduleEntry,
    saveScheduleEntry,
    deleteScheduleEntry,
    getInfo,
    close: closePool
};
