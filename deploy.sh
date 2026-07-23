source .env

echo "📦 Очистка старой папки out..."
rm -rf out

echo "📦 Сборка проекта..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Ошибка сборки! Деплой отменен."
    exit 1
fi

echo "📤 Загрузка на сервер..."

rsync -avz --delete -e "ssh -i ~/.ssh/id_rsa" out/ "$FTP_USER@31.31.197.18:$FTP_PATH/"

echo "✅ Деплой завершен!"
