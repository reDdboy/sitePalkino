const config = require('../config');
const { describeDate, todayISO } = require('../utils/dates');
const {
    HttpError,
    normalizeNews,
    normalizeSchedule,
    isRealDate
} = require('./validators');

// DB_ENABLED=true -> только MySQL (при ошибках БД API отвечает 503, данные не теряются «тихо»).
// Иначе -> память (для разработки и тестов).
const store = config.db.enabled ? require('./mysqlStore') : require('./memoryStore');

function parseNewsId(id) {
    const value = Number(id);
    return Number.isInteger(value) && value > 0 ? value : null;
}

function toScheduleDto(entry) {
    const { day, label } = describeDate(entry.id);
    return {
        id: entry.id,
        isoDate: entry.id,
        day,
        date: label,
        saints: entry.saints,
        note: entry.note,
        services: entry.services
    };
}

// ---------- Новости ----------

function getNews({ limit, featuredOnly } = {}) {
    return store.listNews({ limit, featuredOnly });
}

async function getNewsById(id) {
    const numericId = parseNewsId(id);
    return numericId ? store.getNews(numericId) : null;
}

function createNews(body) {
    return store.createNews(normalizeNews(body));
}

async function updateNews(id, body) {
    const existing = await getNewsById(id);
    if (!existing) return null;

    const { id: _ignored, ...current } = existing;
    const incoming = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
    return store.updateNews(existing.id, normalizeNews({ ...current, ...incoming }));
}

async function deleteNews(id) {
    const numericId = parseNewsId(id);
    return numericId ? store.deleteNews(numericId) : false;
}

// ---------- Расписание ----------

async function getSchedule({ limit, upcomingOnly = true } = {}) {
    const entries = await store.listSchedule({
        limit,
        fromDate: upcomingOnly ? todayISO(config.timezone) : undefined
    });
    return entries.map(toScheduleDto);
}

async function createScheduleEntry(body) {
    const data = normalizeSchedule(body);
    if (await store.getScheduleEntry(data.id)) {
        throw new HttpError(409, 'Расписание на эту дату уже существует. Отредактируйте его.');
    }
    return toScheduleDto(await store.saveScheduleEntry(data));
}

async function updateScheduleEntry(date, body) {
    if (!isRealDate(date)) return null;
    const existing = await store.getScheduleEntry(date);
    if (!existing) return null;

    const incoming = body && typeof body === 'object' && !Array.isArray(body) ? body : {};
    const data = normalizeSchedule({ ...existing, ...incoming, date });
    return toScheduleDto(await store.saveScheduleEntry(data));
}

async function deleteScheduleEntry(date) {
    return isRealDate(date) ? store.deleteScheduleEntry(date) : false;
}

// ---------- Прочее ----------

function getTempleInfo() {
    return store.getInfo();
}

async function storageStatus() {
    return { mode: store.mode, ok: await store.ping() };
}

function closeStorage() {
    return store.close();
}

module.exports = {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getSchedule,
    createScheduleEntry,
    updateScheduleEntry,
    deleteScheduleEntry,
    getTempleInfo,
    storageStatus,
    closeStorage
};
