// Хранилище в памяти: для разработки и тестов. Данные пропадают при перезапуске.
const { news: seedNews } = require('../data/news');
const { schedule: seedSchedule } = require('../data/schedule');
const { temple } = require('../data/temple');

const clone = (value) => structuredClone(value);

let news = seedNews.map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
    publishedAt: new Date(item.publishedAt).toISOString(),
    excerpt: item.excerpt || '',
    content: item.content || '',
    featuredImage: item.featuredImage || null,
    images: clone(item.images || []),
    isFeatured: Boolean(item.isFeatured)
}));

let schedule = seedSchedule.map((item) => ({
    id: item.id,
    saints: item.saints || '',
    note: item.note || '',
    services: clone(item.services || [])
}));

let nextNewsId = news.reduce((max, item) => Math.max(max, item.id), 0) + 1;

async function ping() {
    return true;
}

async function listNews({ limit, featuredOnly } = {}) {
    let items = news.filter((item) => !featuredOnly || item.isFeatured);
    items = items.sort(
        (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id
    );
    if (limit) items = items.slice(0, limit);
    return clone(items);
}

async function getNews(id) {
    const item = news.find((entry) => entry.id === id);
    return item ? clone(item) : null;
}

async function createNews(data) {
    const item = { id: nextNewsId++, ...clone(data) };
    news.push(item);
    return clone(item);
}

async function updateNews(id, data) {
    const index = news.findIndex((entry) => entry.id === id);
    if (index === -1) return null;
    news[index] = { id, ...clone(data) };
    return clone(news[index]);
}

async function deleteNews(id) {
    const before = news.length;
    news = news.filter((entry) => entry.id !== id);
    return news.length < before;
}

async function listSchedule({ limit, fromDate } = {}) {
    let items = schedule
        .filter((item) => !fromDate || item.id >= fromDate)
        .sort((a, b) => a.id.localeCompare(b.id));
    if (limit) items = items.slice(0, limit);
    return clone(items);
}

async function getScheduleEntry(id) {
    const item = schedule.find((entry) => entry.id === id);
    return item ? clone(item) : null;
}

async function saveScheduleEntry(data) {
    const index = schedule.findIndex((entry) => entry.id === data.id);
    if (index === -1) {
        schedule.push(clone(data));
    } else {
        schedule[index] = clone(data);
    }
    return clone(data);
}

async function deleteScheduleEntry(id) {
    const before = schedule.length;
    schedule = schedule.filter((entry) => entry.id !== id);
    return schedule.length < before;
}

async function getInfo() {
    return clone(temple);
}

async function close() {}

module.exports = {
    mode: 'memory',
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
    close
};
