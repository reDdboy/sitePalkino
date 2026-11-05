# Сайт храма: API и админ-панель

Один Node.js-сервер отдаёт API (новости, расписание, данные о храме), загруженные картинки (`/uploads`) и собранную админку (`/admin`).

## Быстрый старт

```bash
npm install
cp .env.example .env        # задайте ADMIN_PASSWORD и SESSION_SECRET
npm run build               # ставит зависимости админки и собирает её
npm start                   # http://localhost:3001/admin
```

Без MySQL (`DB_ENABLED=false`) данные хранятся в памяти и пропадают при перезапуске. Для работы всерьёз подключите MySQL:

```bash
# в .env: DB_ENABLED=true, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
npm run db:init             # создаст базу и таблицы, добавит примеры (повторный запуск безопасен)
npm start
```

Загруженные картинки лежат в папке `uploads/` (или в `UPLOAD_DIR`). Её нужно сохранять при переезде и делать бэкап вместе с базой.

## Разработка

```bash
npm run dev          # API с автоперезапуском, порт 3001
npm run admin:dev    # админка с горячей перезагрузкой: http://localhost:5173/admin/
npm test             # тесты API (память, без MySQL)
```

В dev-режиме Vite проксирует `/api` и `/uploads` на `localhost:3001`, поэтому вход работает без настройки CORS.

## API

Публичные (открыты для чтения с любых сайтов):

| Метод | Адрес | Описание |
|---|---|---|
| GET | `/api/health` | состояние сервера и базы (503, если база недоступна) |
| GET | `/api/info` | данные о храме |
| GET | `/api/news?limit=&featured=true` | новости, свежие первыми |
| GET | `/api/news/:id` | одна новость |
| GET | `/api/schedule?limit=&upcoming=false` | расписание (по умолчанию только предстоящее) |
| GET | `/api/schedule/upcoming?limit=` | ближайшие службы |

Админские (нужен вход по cookie-сессии):

| Метод | Адрес | Описание |
|---|---|---|
| POST | `/api/admin/login` `{password}` | вход (не более 10 попыток за 15 минут) |
| POST | `/api/admin/logout` | выход |
| GET | `/api/admin/session` | `{authenticated}` |
| GET / POST | `/api/admin/news` | список / создать |
| PUT / DELETE | `/api/admin/news/:id` | изменить (можно слать только изменённые поля) / удалить |
| GET / POST | `/api/admin/schedule` | все дни, включая прошедшие / создать день |
| PUT / DELETE | `/api/admin/schedule/:date` | изменить / удалить (`:date` = `ГГГГ-ММ-ДД`) |
| POST | `/api/admin/upload` | `multipart/form-data`, поле `files` (до 10 картинок JPG/PNG/WebP/GIF) → `[{src}]` |

Формат новости: `{id, title, date, publishedAt, excerpt, content, featuredImage, images:[{src, alt}], isFeatured}`.
Формат дня расписания: `{id, isoDate, day, date, saints, note, services:[{time, description}]}`; поля `day` («ЧТ») и `date` («8 октября 2026») сервер считает сам по дате.
Картинки на основном сайте подставляйте как `https://ВАШ-API/uploads/<файл>`.

## Выкладка на сервер

- Задайте `NODE_ENV=production`, `ADMIN_PASSWORD`, `SESSION_SECRET`, данные MySQL.
- За nginx/Cloudflare с HTTPS добавьте `TRUST_PROXY=1`, чтобы cookie входа получила флаг Secure.
- Если админку открывают с другого домена, перечислите его в `CORS_ORIGIN` и соберите панель с `VITE_API_BASE=https://адрес-api`. Проще держать админку на `/admin` того же сервера.
- Сессии хранятся в памяти процесса: после перезапуска сервера нужно войти заново. Запускать нужно один процесс (без кластера).
- В `nginx` поставьте `client_max_body_size 50m;`, иначе загрузка нескольких фото упрётся в лимит nginx.
