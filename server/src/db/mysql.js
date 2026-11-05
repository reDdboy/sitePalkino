const mysql = require('mysql2/promise');
const config = require('../config');

const dbConfig = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    // Даты приходят строками 'YYYY-MM-DD' / 'YYYY-MM-DD HH:MM:SS', без сдвигов часовых поясов.
    // DATETIME хранится в UTC (см. mysqlStore).
    dateStrings: true,
    timezone: 'Z'
};

let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool(dbConfig);
    }
    return pool;
}

async function testConnection() {
    try {
        await getPool().query('SELECT 1');
        return true;
    } catch (error) {
        return false;
    }
}

async function closePool() {
    if (pool) {
        await pool.end();
        pool = undefined;
    }
}

module.exports = { getPool, testConnection, closePool, dbConfig };
