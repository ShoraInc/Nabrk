const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем папки если они не существуют
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Базовая функция для создания storage с кастомным путем
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      ensureDirectoryExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      // Создаем уникальное имя файла
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9\u0400-\u04FF]/g, '_') // Поддержка кириллицы
        .substring(0, 50);
      
      cb(null, `${name}_${uniqueSuffix}${ext}`);
    }
  });
};

// Фильтр типов файлов
const createFileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
  };
};

// Конфигурация для блока контактной информации
const contactInfoConfig = {
  path: 'uploads/blocks/contact-info',
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedTypes: [
    // Документы
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Изображения
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    
    // Видео
    'video/mp4',
    'video/webm',
    'video/avi',
    'video/mov',
    
    // Аудио
    'audio/mpeg',
    'audio/wav',
    'audio/mp3',
    'audio/ogg',
    
    // Архивы
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    
    // Текстовые файлы
    'text/plain',
    'text/csv',
    'application/json'
  ]
};

// Создаем multer для контактной информации
const contactInfoUpload = multer({
  storage: createStorage(contactInfoConfig.path),
  limits: {
    fileSize: contactInfoConfig.maxSize,
    files: 1 // Один файл за раз
  },
  fileFilter: createFileFilter(contactInfoConfig.allowedTypes)
});

// Экспортируем готовую конфигурацию
const uploads = {
  contactInfo: contactInfoUpload
};

// Функция для получения относительного пути для сохранения в БД
const getRelativePath = (filename) => {
  return `/uploads/blocks/contact-info/${filename}`;
};

// Функция для удаления файла
const deleteFile = async (relativePath) => {
  try {
    if (!relativePath) return;
    
    const fs = require('fs').promises;
    const fullPath = relativePath.startsWith('/') 
      ? path.join(process.cwd(), relativePath.slice(1))
      : path.join(process.cwd(), relativePath);
    
    await fs.unlink(fullPath);
    console.log(`File deleted: ${relativePath}`);
  } catch (error) {
    console.warn(`Failed to delete file ${relativePath}:`, error.message);
  }
};

module.exports = {
  uploads,
  getRelativePath,
  deleteFile
};