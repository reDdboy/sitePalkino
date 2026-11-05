const MONTHS = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];
const WEEKDAYS = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

/** '2026-10-08' -> { day: 'ЧТ', label: '8 октября 2026' } */
function describeDate(iso) {
    const [year, month, day] = iso.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return {
        day: WEEKDAYS[date.getUTCDay()],
        label: `${day} ${MONTHS[month - 1]} ${year}`
    };
}

/** Сегодняшняя дата YYYY-MM-DD в нужном часовом поясе. */
function todayISO(timeZone) {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

module.exports = { describeDate, todayISO };
