export interface NewsImage {
    src: string;
    alt: string;
    caption?: string;
}

export interface NewsItem {
    id: number;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    images: NewsImage[];
    featuredImage?: string;
}

export const newsData = [
    {
        id: 1,
        title: "Праздник успения Пресвятой Богородицы",
        date: "29.08.2026",
        excerpt: "В храме Преподобного Серафима Саровского прошло богослужение посвященное празднику успения Пресвятой Богородицы",
        content: "Пусть Пресвятая Дева хранит вас, дарует мир в сердце, любовь, тепло и надежду. Светлого, благословенного праздника!",
        images: [
            { src: "/news/1/main.jpg", alt: "Праздник Пресвятой Богородицы", caption: "Праздничная литургия" },
            { src: "/news/1/2", alt: "", caption: "" },
            { src: "/news/1/3", alt: "", caption: "" },
            { src: "/news/1/4", alt: "", caption: "" },
            { src: "/news/1/5", alt: "", caption: "" },
            { src: "/news/1/6", alt: "", caption: "" },
            { src: "/news/1/7", alt: "", caption: "" },
            { src: "/news/1/8", alt: "", caption: "" },

        ]
    },
    {
        title: "",
        date: "29.08.2026",
        excerpt: "Вот такие дела",
        images: []
    },
    {
        title: "",
        date: "29.08.2026",
        excerpt: "Вот такие дела",
        images: []
    },
    {
        title: "",
        date: "29.08.2026",
        excerpt: "Вот такие дела",
        images: []
    },
    {
        title: "",
        date: "29.08.2026",
        excerpt: "Вот такие дела",
        images: []
    },

]
