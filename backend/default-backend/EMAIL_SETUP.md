# Настройка Email сервиса для отправки сообщений директору

## Переменные окружения

Создайте файл `.env` в корне проекта `backend/default-backend/` со следующими настройками:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nabrk_library
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=4000

# SMTP Configuration for Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Director's Email (where messages will be sent)
DIRECTOR_EMAIL=director@nabrk.kz
```

## Настройка Gmail SMTP

1. Включите двухфакторную аутентификацию в Google аккаунте
2. Создайте пароль приложения:
   - Перейдите в настройки Google аккаунта
   - Безопасность → Пароли приложений
   - Создайте новый пароль для "Почта"
   - Используйте этот пароль в `SMTP_PASS`

## Альтернативные SMTP провайдеры

### Yandex
```env
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=587
SMTP_USER=your-email@yandex.ru
SMTP_PASS=your-password
```

### Mail.ru
```env
SMTP_HOST=smtp.mail.ru
SMTP_PORT=587
SMTP_USER=your-email@mail.ru
SMTP_PASS=your-password
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## API Endpoints

### POST /api/send-director-email
Отправка сообщения директору

**Тело запроса:**
```json
{
  "name": "Имя отправителя",
  "email": "email@example.com",
  "message": "Текст сообщения",
  "language": "ru"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Сообщение успешно отправлено директору",
  "messageId": "message-id"
}
```

### GET /api/test-smtp
Тестирование SMTP подключения

**Ответ:**
```json
{
  "success": true,
  "message": "SMTP подключение успешно"
}
```

## Тестирование

1. Запустите сервер: `npm run dev`
2. Проверьте SMTP подключение: `GET http://localhost:4000/api/test-smtp`
3. Отправьте тестовое сообщение через форму на сайте

## Поддерживаемые языки

- `kz` - Казахский
- `ru` - Русский  
- `en` - Английский

Email будет отправлен на языке, указанном в поле `language`.
