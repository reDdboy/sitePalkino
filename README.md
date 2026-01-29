# sitePalkino
Сайт храма Серафима Саровского Антроповский район село Палкино

Предпологаемая архитектура:
sitepalkino/
│
├── app/                    # Все страницы сайта
│   ├── layout.tsx         # Главный layout (шапка + подвал)
│   ├── page.tsx           # Главная страница
│   ├── globals.css        # Стили всего сайта
│   │
│   ├── about/             # О храме
│   │   └── page.tsx
│   │
│   ├── schedule/          # Расписание
│   │   └── page.tsx
│   │
│   ├── news/              # Новости
│   │   └── page.tsx
│   │
│   ├── contacts/          # Контакты
│   │   └── page.tsx
│   │
│   └── not-found.tsx      # Страница 404
│
├── components/            # Все компоненты React
│   ├── Header.tsx        # Шапка сайта
│   ├── Footer.tsx        # Подвал сайта
│   ├── Navbar.tsx        # Навигация
│   ├── ScheduleCard.tsx  # Карточка расписания
│   ├── NewsCard.tsx      # Карточка новости
│   └── Button.tsx        # Кнопка
│
├── public/               # Статические файлы
│   └── images/          # Картинки
│       ├── church.jpg
│       └── icon.png
│
├── lib/                 # Вспомогательные функции
│   └── utils.ts         # Общие утилиты
│
├── types/               # Типы TypeScript (опционально)
│   └── index.ts
│
├── tailwind.config.ts   # Настройки Tailwind
├── postcss.config.js    # Настройки PostCSS
├── next.config.js       # Настройки Next.js
├── tsconfig.json        # Настройки TypeScript
└── package.json         # Зависимости
