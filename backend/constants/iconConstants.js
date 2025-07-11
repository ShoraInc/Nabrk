// Доступные иконки из Lucide React
const AVAILABLE_ICONS = {
  // Контакты
  'phone': { name: 'Phone', label: 'Телефон', category: 'contact' },
  'smartphone': { name: 'Smartphone', label: 'Мобильный телефон', category: 'contact' },
  'mail': { name: 'Mail', label: 'Email', category: 'contact' },
  'mail-open': { name: 'MailOpen', label: 'Открытое письмо', category: 'contact' },
  'printer': { name: 'Printer', label: 'Факс/Принтер', category: 'contact' },
  'map-pin': { name: 'MapPin', label: 'Адрес', category: 'contact' },
  'globe': { name: 'Globe', label: 'Сайт', category: 'contact' },
  
  // Файлы и документы
  'file-text': { name: 'FileText', label: 'Документ', category: 'files' },
  'file-pdf': { name: 'FileText', label: 'PDF файл', category: 'files' },
  'file-doc': { name: 'FileText', label: 'Word документ', category: 'files' },
  'file-excel': { name: 'FileSpreadsheet', label: 'Excel таблица', category: 'files' },
  'file-image': { name: 'FileImage', label: 'Изображение', category: 'files' },
  'file-video': { name: 'FileVideo', label: 'Видео файл', category: 'files' },
  'file-audio': { name: 'FileAudio', label: 'Аудио файл', category: 'files' },
  'folder': { name: 'Folder', label: 'Папка', category: 'files' },
  'archive': { name: 'Archive', label: 'Архив', category: 'files' },
  
  // Ссылки и навигация
  'external-link': { name: 'ExternalLink', label: 'Внешняя ссылка', category: 'links' },
  'link': { name: 'Link', label: 'Ссылка', category: 'links' },
  'download': { name: 'Download', label: 'Скачать', category: 'links' },
  'upload': { name: 'Upload', label: 'Загрузить', category: 'links' },
  'arrow-right': { name: 'ArrowRight', label: 'Стрелка вправо', category: 'links' },
  'chevron-right': { name: 'ChevronRight', label: 'Шеврон вправо', category: 'links' },
  
  // Медиа и развлечения
  'play': { name: 'Play', label: 'Воспроизвести', category: 'media' },
  'play-circle': { name: 'PlayCircle', label: 'Воспроизвести (круг)', category: 'media' },
  'video': { name: 'Video', label: 'Видео', category: 'media' },
  'camera': { name: 'Camera', label: 'Камера', category: 'media' },
  'image': { name: 'Image', label: 'Изображение', category: 'media' },
  'music': { name: 'Music', label: 'Музыка', category: 'media' },
  
  // Социальные сети (используем общие иконки)
  'message-circle': { name: 'MessageCircle', label: 'Сообщение', category: 'social' },
  'send': { name: 'Send', label: 'Отправить', category: 'social' },
  'share': { name: 'Share', label: 'Поделиться', category: 'social' },
  'users': { name: 'Users', label: 'Пользователи', category: 'social' },
  'user': { name: 'User', label: 'Пользователь', category: 'social' },
  
  // Информация и уведомления
  'info': { name: 'Info', label: 'Информация', category: 'info' },
  'alert-circle': { name: 'AlertCircle', label: 'Внимание', category: 'info' },
  'check-circle': { name: 'CheckCircle', label: 'Выполнено', category: 'info' },
  'x-circle': { name: 'XCircle', label: 'Ошибка', category: 'info' },
  'help-circle': { name: 'HelpCircle', label: 'Помощь', category: 'info' },
  'bell': { name: 'Bell', label: 'Уведомление', category: 'info' },
  
  // Бизнес и офис
  'briefcase': { name: 'Briefcase', label: 'Портфель', category: 'business' },
  'building': { name: 'Building', label: 'Здание', category: 'business' },
  'calendar': { name: 'Calendar', label: 'Календарь', category: 'business' },
  'clock': { name: 'Clock', label: 'Время', category: 'business' },
  'dollar-sign': { name: 'DollarSign', label: 'Деньги', category: 'business' },
  'credit-card': { name: 'CreditCard', label: 'Банковская карта', category: 'business' },
  
  // Транспорт
  'car': { name: 'Car', label: 'Автомобиль', category: 'transport' },
  'truck': { name: 'Truck', label: 'Грузовик', category: 'transport' },
  'plane': { name: 'Plane', label: 'Самолет', category: 'transport' },
  'train': { name: 'Train', label: 'Поезд', category: 'transport' },
  
  // Общие
  'star': { name: 'Star', label: 'Звезда', category: 'general' },
  'heart': { name: 'Heart', label: 'Сердце', category: 'general' },
  'home': { name: 'Home', label: 'Дом', category: 'general' },
  'search': { name: 'Search', label: 'Поиск', category: 'general' },
  'settings': { name: 'Settings', label: 'Настройки', category: 'general' },
  'tool': { name: 'Wrench', label: 'Инструмент', category: 'general' },
  'shield': { name: 'Shield', label: 'Защита', category: 'general' },
  'award': { name: 'Award', label: 'Награда', category: 'general' },
  'target': { name: 'Target', label: 'Цель', category: 'general' },
  'zap': { name: 'Zap', label: 'Молния', category: 'general' }
};

// Категории для группировки в UI
const ICON_CATEGORIES = {
  contact: 'Контакты',
  files: 'Файлы и документы',
  links: 'Ссылки',
  media: 'Медиа',
  social: 'Социальные сети',
  info: 'Информация',
  business: 'Бизнес',
  transport: 'Транспорт',
  general: 'Общие'
};

// Рекомендуемые иконки для разных типов
const RECOMMENDED_ICONS = {
  phone: ['phone', 'smartphone'],
  email: ['mail', 'mail-open'],
  file: ['file-text', 'file-pdf', 'download'],
  link: ['external-link', 'link', 'arrow-right'],
  video: ['play', 'play-circle', 'video'],
  address: ['map-pin', 'building', 'home'],
  fax: ['printer', 'send']
};

module.exports = {
  AVAILABLE_ICONS,
  ICON_CATEGORIES,
  RECOMMENDED_ICONS
};