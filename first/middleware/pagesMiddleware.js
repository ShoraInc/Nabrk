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
        field: 'slug'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при проверке уникальности slug' 
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
  } else if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push('Slug может содержать только строчные буквы, цифры и дефисы');
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

module.exports = {
  checkSlugUnique,
  validatePageData
};