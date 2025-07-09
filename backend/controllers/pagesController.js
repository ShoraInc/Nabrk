const { Pages, Blocks } = require("../models");

const pagesController = {
  // Получить все страницы
  getAllPages: async (req, res) => {
    try {
      const pages = await Pages.findAll({
        include: [
          {
            model: Blocks,
            as: "blocks",
            order: [["order", "ASC"]],
          },
        ],
      });
      res.json(pages);
    } catch (error) {
      console.error("Ошибка при получении страниц:", error);
      res.status(500).json({
        error: "Не удалось получить страницы",
      });
    }
  },

  // Получить страницу по ID
  getPageById: async (req, res) => {
    try {
      const page = await Pages.findByPk(req.params.id, {
        include: [
          {
            model: Blocks,
            as: "blocks",
            order: [["order", "ASC"]],
          },
        ],
      });

      if (!page) {
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      res.json(page);
    } catch (error) {
      console.error("Ошибка при получении страницы:", error);
      res.status(500).json({
        error: "Не удалось получить страницу",
      });
    }
  },

  // Создать страницу
  createPage: async (req, res) => {
    try {
      const { title, slug, status } = req.body;
      const page = await Pages.create({
        title,
        slug,
        status: status || "draft",
      });

      res.status(201).json(page);
    } catch (error) {
      console.error("Ошибка при создании страницы:", error);

      // Обработка ошибок валидации Sequelize
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Ошибка валидации данных",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      // Обработка ошибки уникальности
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0].path;
        return res.status(400).json({
          error: `Значение поля '${field}' уже используется`,
          field: field,
        });
      }

      res.status(500).json({
        error: "Не удалось создать страницу",
      });
    }
  },

  // Обновить страницу
  updatePage: async (req, res) => {
    try {
      const { title, slug, status } = req.body;
      const [updated] = await Pages.update(
        { title, slug, status },
        { where: { id: req.params.id } }
      );

      if (!updated) {
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      const page = await Pages.findByPk(req.params.id, {
        include: [
          {
            model: Blocks,
            as: "blocks",
            order: [["order", "ASC"]],
          },
        ],
      });

      res.json(page);
    } catch (error) {
      console.error("Ошибка при обновлении страницы:", error);

      // Обработка ошибок валидации Sequelize
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Ошибка валидации данных",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      // Обработка ошибки уникальности
      if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0].path;
        return res.status(400).json({
          error: `Значение поля '${field}' уже используется`,
          field: field,
        });
      }

      res.status(500).json({
        error: "Не удалось обновить страницу",
      });
    }
  },

  // Удалить страницу
  deletePage: async (req, res) => {
    try {
      const page = await Pages.findByPk(req.params.id);

      if (!page) {
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      await page.destroy();

      res.json({
        message: "Страница успешно удалена",
      });
    } catch (error) {
      console.error("Ошибка при удалении страницы:", error);

      // Проверка на ошибки связанности (если есть связанные записи)
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          error: "Нельзя удалить страницу, пока у неё есть связанные блоки",
        });
      }

      res.status(500).json({
        error: "Не удалось удалить страницу",
      });
    }
  },
};

module.exports = pagesController;
