export interface NewsImage {
    src: string;
    alt: string;
}

export interface NewsItem {
    id: number;
    title: string;
    date: string; // ГГГГ-ММ-ДД
    publishedAt: string; // ISO
    excerpt: string;
    content: string;
    featuredImage: string | null;
    images: NewsImage[];
    isFeatured: boolean;
}

export interface NewsInput {
    title: string;
    date: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    images: NewsImage[];
    isFeatured: boolean;
    publishedAt?: string;
}

export interface ServiceItem {
    time: string; // ЧЧ:ММ
    description: string;
}

export interface ScheduleEntry {
    id: string; // дата ГГГГ-ММ-ДД
    isoDate: string;
    day: string; // ПН, ВТ...
    date: string; // «8 октября 2026»
    saints: string;
    note: string;
    services: ServiceItem[];
}

export interface ScheduleInput {
    date: string;
    saints: string;
    note: string;
    services: ServiceItem[];
}
