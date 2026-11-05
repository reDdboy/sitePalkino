class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const badRequest = (message) => new HttpError(400, message);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

function isRealDate(value) {
    if (typeof value !== 'string' || !DATE_RE.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function requiredString(value, label, max) {
    if (typeof value !== 'string' || !value.trim()) {
        throw badRequest(`Поле «${label}» обязательно`);
    }
    const trimmed = value.trim();
    if (trimmed.length > max) {
        throw badRequest(`Поле «${label}» длиннее ${max} символов`);
    }
    return trimmed;
}

function optionalString(value, label, max) {
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string') {
        throw badRequest(`Поле «${label}» должно быть строкой`);
    }
    if (value.length > max) {
        throw badRequest(`Поле «${label}» длиннее ${max} символов`);
    }
    return value.trim();
}

/** Разрешаем только путь с корня сайта (/uploads/..) или http(s)-ссылку. */
function imageSrc(value, label) {
    if (typeof value !== 'string') {
        throw badRequest(`Поле «${label}» должно быть строкой`);
    }
    const src = value.trim();
    const ok = (/^\/(?!\/)\S*$/.test(src) || /^https?:\/\/\S+$/i.test(src)) && src.length <= 500;
    if (!ok) {
        throw badRequest(`Некорректный адрес картинки в поле «${label}»`);
    }
    return src;
}

function asObject(input) {
    return input && typeof input === 'object' && !Array.isArray(input) ? input : {};
}

function normalizeNews(input) {
    const body = asObject(input);

    if (!isRealDate(body.date)) {
        throw badRequest('Поле «Дата» должно быть в формате ГГГГ-ММ-ДД');
    }

    let featuredImage = null;
    if (body.featuredImage !== undefined && body.featuredImage !== null && body.featuredImage !== '') {
        featuredImage = imageSrc(body.featuredImage, 'Главная картинка');
    }

    const rawImages = body.images === undefined || body.images === null ? [] : body.images;
    if (!Array.isArray(rawImages) || rawImages.length > 50) {
        throw badRequest('Галерея должна быть списком до 50 картинок');
    }
    const images = rawImages.map((item, index) => {
        const entry = asObject(item);
        return {
            src: imageSrc(entry.src, `Картинка ${index + 1}`),
            alt: optionalString(entry.alt, `Подпись картинки ${index + 1}`, 255)
        };
    });

    if (body.isFeatured !== undefined && typeof body.isFeatured !== 'boolean') {
        throw badRequest('Поле «Важная новость» должно быть true или false');
    }

    const publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date();
    if (Number.isNaN(publishedAt.getTime())) {
        throw badRequest('Некорректная дата публикации');
    }

    return {
        title: requiredString(body.title, 'Заголовок', 255),
        date: body.date,
        publishedAt: publishedAt.toISOString(),
        excerpt: optionalString(body.excerpt, 'Краткое описание', 2000),
        content: optionalString(body.content, 'Текст', 100000),
        featuredImage,
        images,
        isFeatured: Boolean(body.isFeatured)
    };
}

function normalizeSchedule(input) {
    const body = asObject(input);

    if (!isRealDate(body.date)) {
        throw badRequest('Поле «Дата» должно быть в формате ГГГГ-ММ-ДД');
    }

    const rawServices = body.services === undefined || body.services === null ? [] : body.services;
    if (!Array.isArray(rawServices) || rawServices.length > 30) {
        throw badRequest('Службы должны быть списком до 30 записей');
    }

    const services = rawServices
        .map((item) => {
            const entry = asObject(item);
            if (typeof entry.time !== 'string' || !TIME_RE.test(entry.time)) {
                throw badRequest('Время службы должно быть в формате ЧЧ:ММ');
            }
            return {
                time: entry.time,
                description: requiredString(entry.description, 'Название службы', 255)
            };
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    return {
        id: body.date,
        saints: optionalString(body.saints, 'Святые и праздники', 255),
        note: optionalString(body.note, 'Примечание', 2000),
        services
    };
}

/** limit: не задан -> undefined; иначе целое 1..100 */
function parseLimit(value) {
    if (value === undefined || value === '') return undefined;
    const limit = Number(value);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw badRequest('limit должен быть целым числом от 1 до 100');
    }
    return limit;
}

module.exports = {
    HttpError,
    badRequest,
    isRealDate,
    normalizeNews,
    normalizeSchedule,
    parseLimit
};
