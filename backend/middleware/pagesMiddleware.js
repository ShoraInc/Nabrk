const { Pages } = require('../models');

// Middleware для проверки уникальности slug
const checkSlugUnique = async (req, res, next) => {
  try {
    const { slug } = req.body;
    const pageId = req.params.id; // Для случая обновления
    
    if (!slug) {
      return res.status(400).json({
        error: 'Поле slug обязательно для заполнения'
      });
    }
    
    // Проверяем, существует ли страница с таким slug
    const existingPage = await Pages.findOne({
      where: { slug }
    });
    
    // Если страница найдена и это не текущая страница (при обновлении)
    if (existingPage && existingPage.id != pageId) {
      return res.status(400).json({
        error: 'Страница с таким slug уже существует',
        field: 'slug',
        existingPage: {
          id: existingPage.id,
          title: existingPage.title,
          slug: existingPage.slug
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Ошибка в checkSlugUnique middleware:', error);
    
    // ИСПРАВЛЕНО: Возвращаем более детальную информацию об ошибке
    res.status(500).json({
      error: 'Ошибка при проверке уникальности slug',
      details: error.message,
      // В development режиме показываем stack trace
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Middleware для валидации данных страницы
const validatePageData = (req, res, next) => {
  const { title, slug, status } = req.body;
  const errors = [];
  
  if (!title || title.trim() === '') {
    errors.push('Поле title обязательно для заполнения');
  }
  
  if (!slug || slug.trim() === '') {
    errors.push('Поле slug обязательно для заполнения');
  } else {
    // ИСПРАВЛЕНО: Более гибкая валидация slug
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(slug)) {
      errors.push('Slug должен содержать только строчные буквы, цифры и дефисы. Не может начинаться или заканчиваться дефисом, не может содержать подряд идущие дефисы');
    }
  }
  
  if (status && !['draft', 'published'].includes(status)) {
    errors.push('Статус может быть только "draft" или "published"');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Ошибки валидации',
      errors: errors
    });
  }
  
  next();
};

// ДОБАВЛЕНО: Middleware для нормализации slug
const normalizeSlug = (req, res, next) => {
  if (req.body.slug) {
    // Приводим к нижнему регистру и убираем лишние пробелы
    req.body.slug = req.body.slug.toLowerCase().trim();
    
    // Заменяем пробелы на дефисы
    req.body.slug = req.body.slug.replace(/\s+/g, '-');
    
    // Убираем множественные дефисы
    req.body.slug = req.body.slug.replace(/-+/g, '-');
    
    // Убираем дефисы в начале и конце
    req.body.slug = req.body.slug.replace(/^-+|-+$/g, '');
  }
  
  next();
};

module.exports = {
  checkSlugUnique,
  validatePageData,
  normalizeSlug
};