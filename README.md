# sitePalkino
Сайт храма Серафима Саровского Антроповский район село Палкино

Предпологаемая архитектура:
sitepalkino/
│
├── app/                          # App Router директория
│   ├── layout.tsx               # Корневой layout
│   ├── page.tsx                 # Главная страница
│   ├── globals.css              # Глобальные стили
│   │
│   ├── (routes)/                # Группы роутов (опционально)
│   │   ├── about/               # О храме
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── schedule/            # Расписание
│   │   │   ├── page.tsx
│   │   │   └── calendar/
│   │   │       └── page.tsx
│   │   │
│   │   ├── news/                # Новости
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── sacraments/          # Таинства
│   │   │   ├── page.tsx
│   │   │   ├── baptism/
│   │   │   └── wedding/
│   │   │
│   │   ├── contacts/            # Контакты
│   │   │   └── page.tsx
│   │   │
│   │   └── api/                 # API routes (если нужно)
│   │       └── prayers/
│   │           └── route.ts
│   │
│   └── not-found.tsx            # 404 страница
│
├── components/                   # React компоненты
│   ├── ui/                      # Базовые UI компоненты
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.test.tsx
│   │   ├── Card/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── index.ts             # Barrel exports
│   │
│   ├── layout/                  # Компоненты layout
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── index.ts
│   │
│   ├── shared/                  # Общие компоненты
│   │   ├── Icon/
│   │   ├── Breadcrumbs/
│   │   └── LoadingSpinner/
│   │
│   ├── sections/                # Секции страниц
│   │   ├── Hero/
│   │   ├── ScheduleSection/
│   │   ├── NewsSection/
│   │   └── ContactsSection/
│   │
│   ├── features/                # Функциональные компоненты
│   │   ├── Calendar/
│   │   ├── DonationForm/
│   │   ├── PrayerRequest/
│   │   └── SubscriptionForm/
│   │
│   └── icons/                   # Иконки
│       ├── ChurchIcon.tsx
│       ├── CrossIcon.tsx
│       └── CandleIcon.tsx
│
├── lib/                         # Утилиты и вспомогательные функции
│   ├── api/                     # API клиенты
│   │   ├── client.ts            # Базовый HTTP клиент
│   │   ├── prayers.ts           # API для молитв
│   │   └── schedule.ts          # API для расписания
│   │
│   ├── utils/                   # Утилиты
│   │   ├── cn.ts                # clsx/tailwind-merge
│   │   ├── date.ts              # Форматирование дат
│   │   ├── format.ts            # Форматирование
│   │   └── validation.ts        # Валидация форм
│   │
│   ├── constants/               # Константы
│   │   ├── routes.ts            # Пути
│   │   ├── schedule.ts          # Типы богослужений
│   │   └── sacraments.ts        # Информация о таинствах
│   │
│   └── hooks/                   # Кастомные хуки
│       ├── useSchedule.ts
│       ├── usePrayerRequests.ts
│       └── useMobileDetect.ts
│
├── types/                       # TypeScript типы
│   ├── index.ts                 # Основные типы
│   ├── schedule.ts              # Типы для расписания
│   ├── prayers.ts               # Типы для молитв
│   └── api.ts                   # Типы для API
│
├── public/                      # Статические файлы
│   ├── images/                  # Изображения
│   │   ├── church/
│   │   │   ├── exterior.jpg
│   │   │   ├── interior-1.jpg
│   │   │   └── icons/
│   │   │
│   │   ├── icons/
│   │   │   ├── favicon.ico
│   │   │   ├── icon-192.png
│   │   │   └── icon-512.png
│   │   │
│   │   ├── priests/             # Фото священников
│   │   └── saints/              # Иконы святых
│   │
│   ├── fonts/                   # Шрифты (если нужны кастомные)
│   ├── documents/               # Документы
│   └── audio/                   # Аудио (проповеди, колокола)
│
├── content/                     # Контент (если нет CMS)
│   ├── news/                    # Новости в markdown
│   ├── sermons/                 # Проповеди
│   └── pages/                   # Статические страницы
│
├── styles/                      # Дополнительные стили (опционально)
│   ├── components/              # Стили для компонентов
│   └── themes/                  # Темы оформления
│
├── config/                      # Конфигурации
│   ├── site.ts                  # Настройки сайта
│   └── metadata.ts              # Метаданные
│
├── scripts/                     # Скрипты
│   ├── build.js                 # Скрипты сборки
│   └── deploy.js                # Скрипты деплоя
│
├── .env.local                   # Локальные переменные окружения
├── .env.production              # Продакшен переменные
├── .gitignore                   # Git ignore
├── next.config.js               # Конфигурация Next.js
├── tailwind.config.ts           # Конфигурация Tailwind
├── postcss.config.js            # Конфигурация PostCSS
├── tsconfig.json                # Конфигурация TypeScript
├── package.json                 # Зависимости
└── README.md                    # Документация
