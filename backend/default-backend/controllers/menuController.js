const { Menu, Pages, sequelize } = require("../models");

const menuController = {
  // Получить всю структуру меню
  getMenu: async (req, res) => {
    try {
      const menuItems = await Menu.findAll({
        include: [
          {
            model: Menu,
            as: "children",
            order: [["order", "ASC"]],
          },
        ],
        where: {
          parentId: null, // Только родительские элементы
        },
        order: [["order", "ASC"]],
      });

      res.json(menuItems);
    } catch (error) {
      console.error("Ошибка при получении меню:", error);
      res.status(500).json({
        error: "Не удалось получить меню",
      });
    }
  },

  // Создать пункт меню
  createMenuItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { parentId, type, label, url, pageSlug, order } = req.body;

      // Валидация
      if (!type || !label) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Тип и название обязательны",
        });
      }

      if (type === "link" && !url) {
        await transaction.rollback();
        return res.status(400).json({
          error: "URL обязателен для типа 'link'",
        });
      }

      if (type === "page" && !pageSlug) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Slug страницы обязателен для типа 'page'",
        });
      }

      // Если это дочерний элемент, проверяем существование родителя
      if (parentId) {
        const parent = await Menu.findByPk(parentId, { transaction });
        if (!parent) {
          await transaction.rollback();
          return res.status(404).json({
            error: "Родительский пункт не найден",
          });
        }
      }

      // Если это ссылка на страницу, проверяем существование страницы
      if (type === "page" && pageSlug) {
        const page = await Pages.findOne({
          where: { slug: pageSlug, status: "published" },
          transaction,
        });
        if (!page) {
          await transaction.rollback();
          return res.status(404).json({
            error: "Страница не найдена или не опубликована",
          });
        }
      }

      // Определяем порядок
      let finalOrder = order;
      if (finalOrder === undefined || finalOrder === null) {
        const maxOrder = await Menu.max("order", {
          where: { parentId },
          transaction,
        });
        finalOrder = (maxOrder || 0) + 1;
      }

      const menuItem = await Menu.create(
        {
          parentId,
          type,
          label,
          url: type === "link" ? url : null,
          pageSlug: type === "page" ? pageSlug : null,
          order: finalOrder,
        },
        { transaction }
      );

      await transaction.commit();

      // Возвращаем созданный элемент с дочерними элементами
      const createdItem = await Menu.findByPk(menuItem.id, {
        include: [
          {
            model: Menu,
            as: "children",
            order: [["order", "ASC"]],
          },
        ],
      });

      res.status(201).json(createdItem);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании пункта меню:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Ошибка валидации данных",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      res.status(500).json({
        error: "Не удалось создать пункт меню",
      });
    }
  },

  // Обновить пункт меню
  updateMenuItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;
      const { type, label, url, pageSlug, order } = req.body;

      const menuItem = await Menu.findByPk(id, { transaction });
      if (!menuItem) {
        await transaction.rollback();
        return res.status(404).json({
          error: "Пункт меню не найден",
        });
      }

      // Валидация
      if (type && !label) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Название обязательно",
        });
      }

      if (type === "link" && !url) {
        await transaction.rollback();
        return res.status(400).json({
          error: "URL обязателен для типа 'link'",
        });
      }

      if (type === "page" && !pageSlug) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Slug страницы обязателен для типа 'page'",
        });
      }

      // Если это ссылка на страницу, проверяем существование страницы
      if (type === "page" && pageSlug) {
        const page = await Pages.findOne({
          where: { slug: pageSlug, status: "published" },
          transaction,
        });
        if (!page) {
          await transaction.rollback();
          return res.status(404).json({
            error: "Страница не найдена или не опубликована",
          });
        }
      }

      // Обновляем данные
      const updateData = {};
      if (type !== undefined) updateData.type = type;
      if (label !== undefined) updateData.label = label;
      if (order !== undefined) updateData.order = order;
      
      if (type === "link") {
        updateData.url = url;
        updateData.pageSlug = null;
      } else if (type === "page") {
        updateData.pageSlug = pageSlug;
        updateData.url = null;
      } else if (type === "title") {
        updateData.url = null;
        updateData.pageSlug = null;
      }

      await menuItem.update(updateData, { transaction });
      await transaction.commit();

      // Возвращаем обновленный элемент
      const updatedItem = await Menu.findByPk(id, {
        include: [
          {
            model: Menu,
            as: "children",
            order: [["order", "ASC"]],
          },
        ],
      });

      res.json(updatedItem);
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при обновлении пункта меню:", error);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          error: "Ошибка валидации данных",
          details: error.errors.map((err) => ({
            field: err.path,
            message: err.message,
          })),
        });
      }

      res.status(500).json({
        error: "Не удалось обновить пункт меню",
      });
    }
  },

  // Удалить пункт меню
  deleteMenuItem: async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
      const { id } = req.params;

      const menuItem = await Menu.findByPk(id, {
        include: [
          {
            model: Menu,
            as: "children",
          },
        ],
        transaction,
      });

      if (!menuItem) {
        await transaction.rollback();
        return res.status(404).json({
          error: "Пункт меню не найден",
        });
      }

      // Проверяем, есть ли дочерние элементы
      if (menuItem.children && menuItem.children.length > 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Нельзя удалить пункт с дочерними элементами. Сначала удалите все подпункты.",
        });
      }

      await menuItem.destroy({ transaction });
      await transaction.commit();

      res.json({
        message: "Пункт меню успешно удален",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении пункта меню:", error);
      res.status(500).json({
        error: "Не удалось удалить пункт меню",
      });
    }
  },

  // Поиск страниц
  searchPages: async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.json([]);
      }

      const pages = await Pages.findAll({
        where: {
          status: "published",
          [sequelize.Op.or]: [
            {
              title: {
                [sequelize.Op.iLike]: `%${query}%`,
              },
            },
            {
              slug: {
                [sequelize.Op.iLike]: `%${query}%`,
              },
            },
          ],
        },
        attributes: ["id", "title", "slug"],
        limit: 10,
        order: [["title", "ASC"]],
      });

      res.json(pages);
    } catch (error) {
      console.error("Ошибка при поиске страниц:", error);
      res.status(500).json({
        error: "Не удалось выполнить поиск страниц",
      });
    }
  },

  // Получить страницу по slug (для валидации)
  getPageBySlug: async (req, res) => {
    try {
      const { slug } = req.params;

      const page = await Pages.findOne({
        where: {
          slug,
          status: "published",
        },
        attributes: ["id", "title", "slug"],
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
};

module.exports = menuController;
