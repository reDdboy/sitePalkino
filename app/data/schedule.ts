export const SCHEDULE_YEAR = 2026;

export type ScheduleService = {
    time: string;
    description: string;
};

export type ScheduleItem = {
    id: string;
    day: string;
    date: string;
    note?: string;
    saints?: string;
    services: ScheduleService[];
};

const rawScheduleData: ScheduleItem[] = [
    {
        id: "oct-10",
        day: "СБ",
        date: "10 октября",
        saints: "Седмица 19-я по Пятидесятнице.",
        services: [
            { time: "16:00", description: "Всенощное бдение. Исповедь" },
        ],
    },
    {
        id: "oct-11",
        day: "ВС",
        date: "11 октября",
        saints: "Обретение мощей Прп. Вел. кн. Елисаветы.",
        services: [
            { time: "7:30", description: "Молебен" },
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-13",
        day: "ВТ",
        date: "13 октября",
        saints: "Свт. Михаила, первого митр. Киевского.",
        services: [
            { time: "16:00", description: "Всенощное бдение. Исповедь" },
        ],
    },
    {
        id: "oct-14",
        day: "СР",
        date: "14 октября",
        saints: "Покров Пресвятой Владычицы нашей Богородицы и Приснодевы Марии.",
        services: [
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-15",
        day: "ЧТ",
        date: "15 октября",
        saints: "",
        services: [
            {
                time: "10:00",
                description:
                    "Акафист – молебное пение в каменном Храме Святителю Николаю о дальнейшем сохранении – восстановлении Никольского Храма села Палкино",
            },
        ],
    },
    {
        id: "oct-17-1",
        day: "СБ",
        date: "17 октября",
        note: "Село ПЕНЬКИ",
        saints: "Собор Казанских святых.",
        services: [
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-17-2",
        day: "СБ",
        date: "17 октября",
        saints: "Седмица 20-я по Пятидесятнице.",
        services: [
            { time: "16:00", description: "Всенощное бдение. Исповедь" },
        ],
    },
    {
        id: "oct-18",
        day: "ВС",
        date: "18 октября",
        saints: "Свт. Московских Петра, Феогноста, Алексия, Киприана, Фотия, Ионы и др.",
        services: [
            { time: "7:30", description: "Молебен" },
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-22",
        day: "ЧТ",
        date: "22 октября",
        saints: "",
        services: [
            {
                time: "10:00",
                description:
                    "Акафист – молебное пение в каменном Храме Святителю Николаю о дальнейшем сохранении – восстановлении Никольского Храма села Палкино",
            },
        ],
    },
    {
        id: "oct-23",
        day: "ПТ",
        date: "23 октября",
        saints: "Прп. Амвросия Оптинского.",
        services: [
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-24",
        day: "СБ",
        date: "24 октября",
        saints: "Собор всех святых, в Оптиной пустыни просиявших.",
        services: [
            { time: "16:00", description: "Всенощное бдение. Исповедь" },
        ],
    },
    {
        id: "oct-25",
        day: "ВС",
        date: "25 октября",
        saints: "Память святых отцов VII Вселенского собора.",
        services: [
            { time: "7:30", description: "Молебен" },
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-26",
        day: "ПН",
        date: "26 октября",
        note: "Село БОГОВСКОЕ",
        saints: "Иверской иконы Божьей Матери.",
        services: [
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-28",
        day: "СР",
        date: "28 октября",
        note: "Село ТРИФОНОВО",
        saints: "Иконы Божьей Матери «Спорительница хлебов».",
        services: [
            { time: "8:00", description: "Часы Божественной литургии" },
            { time: "8:30", description: "Литургия" },
        ],
    },
    {
        id: "oct-29",
        day: "ЧТ",
        date: "29 октября",
        saints: "",
        services: [
            {
                time: "10:00",
                description:
                    "Акафист – молебное пение в каменном Храме Святителю Николаю о дальнейшем сохранении – восстановлении Никольского Храма села Палкино",
            },
        ],
    },
    {
        id: "oct-31",
        day: "СБ",
        date: "31 октября",
        saints: "Апостола и евангелиста Луки.",
        services: [
            { time: "16:00", description: "Всенощное бдение. Исповедь" },
        ],
    },
];

const monthMap: Record<string, string> = {
    января: "01",
    февраля: "02",
    марта: "03",
    апреля: "04",
    мая: "05",
    июня: "06",
    июля: "07",
    августа: "08",
    сентября: "09",
    октября: "10",
    ноября: "11",
    декабря: "12",
};

export function getScheduleDate(dateString: string): string {
    const [dayString, monthName] = dateString.split(" ");
    const day = Number(dayString);
    const month = monthMap[monthName.toLowerCase()];

    if (!month || !Number.isInteger(day) || day < 1 || day > 31) {
        throw new Error(`Некорректная дата расписания: ${dateString}`);
    }

    return `${SCHEDULE_YEAR}-${month}-${String(day).padStart(2, "0")}`;
}

export const scheduleData = rawScheduleData.map((item) => ({
    ...item,
    isoDate: getScheduleDate(item.date),
}));

export type ScheduleEntry = (typeof scheduleData)[number];
