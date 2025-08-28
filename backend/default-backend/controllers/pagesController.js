const { Pages, Blocks, ContactInfoItems, sequelize } = require("../models");

const pagesController = {
  // АДМИН: Получить все страницы (включая черновики)
  getAllPagesAdmin: async (req, res) => {
    try {
      const pages = await Pages.findAll({
        include: [
          {
            model: Blocks,
            as: "blocks",
            include: [
              {
                model: ContactInfoItems,
                as: "contactInfoItems",
                required: false,
              },
            ],
          },
        ],
        order: [
          ["updatedAt", "DESC"],
          [{ model: Blocks, as: "blocks" }, "order", "ASC"],
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

  // ПУБЛИЧНЫЙ: Получить только опубликованные страницы
  getPublishedPages: async (req, res) => {
    try {
      const pages = await Pages.findAll({
        where: { status: "published" },
        include: [
          {
            model: Blocks,
            as: "blocks",
            include: [
              {
                model: ContactInfoItems,
                as: "contactInfoItems",
                required: false,
              },
            ],
          },
        ],
        order: [
          ["updatedAt", "DESC"],
          [{ model: Blocks, as: "blocks" }, "order", "ASC"],
        ],
      });
      res.json(pages);
    } catch (error) {
      console.error("Ошибка при получении опубликованных страниц:", error);
      res.status(500).json({
        error: "Не удалось получить опубликованные страницы",
      });
    }
  },

  // ПУБЛИЧНЫЙ: Получить страницу по slug

  // АДМИН: Получить страницу по ID (любой статус)
  getPageByIdAdmin: async (req, res) => {
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

  // ПУБЛИЧНЫЙ: Получить страницу по slug (только published)
  getPublishedPageBySlug: async (req, res) => {
    try {
      const page = await Pages.findOne({
        where: {
          slug: req.params.slug,
          status: "published",
        },
        include: [
          {
            model: Blocks,
            as: "blocks",
            where: {
              isHidden: false // Исключаем скрытые блоки
            },
            include: [
              {
                model: ContactInfoItems,
                as: "contactInfoItems",
                required: false, // Необязательно, если блоки могут быть без элементов
                where: {
                  isActive: true, // Показываем только активные элементы
                },
                required: false, // Важно: чтобы блоки без элементов тоже показывались
              },
            ],
          },
        ],
        order: [
          // Сортировка блоков по их порядку
          [{ model: Blocks, as: "blocks" }, "order", "ASC"],
          // КРИТИЧЕСКИ ВАЖНО: Сортировка элементов контактной информации по их порядку
          [
            { model: Blocks, as: "blocks" },
            { model: ContactInfoItems, as: "contactInfoItems" },
            "order",
            "ASC",
          ],
        ],
      });

      if (!page) {
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      // Добавляем отладочную информацию
      console.log("Found page:", page.title);
      console.log("Blocks count:", page.blocks?.length);
      page.blocks?.forEach((block, index) => {
        console.log(
          `Block ${index}: type=${block.type}, contactInfoItems=${
            block.contactInfoItems?.length || 0
          }`
        );

        // Выводим порядок элементов для отладки
        if (block.contactInfoItems && block.contactInfoItems.length > 0) {
          console.log(
            `  Contact items order:`,
            block.contactInfoItems
              .map((item) => `id:${item.id}, order:${item.order}`)
              .join(", ")
          );
        }
      });

      res.json(page);
    } catch (error) {
      console.error("Ошибка при получении страницы по slug:", error);
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

  // Публиковать страницу
  publishPage: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const page = await Pages.findByPk(req.params.id, { transaction });

      if (!page) {
        await transaction.rollback();
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      // Проверяем, что страница не уже опубликована
      if (page.status === "published") {
        await transaction.rollback();
        return res.status(400).json({
          error: "Страница уже опубликована",
        });
      }

      // Проверяем, есть ли у страницы блоки
      const blocksCount = await Blocks.count({
        where: { pageId: page.id },
        transaction,
      });

      if (blocksCount === 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Нельзя опубликовать страницу без блоков",
        });
      }

      // Дополнительная проверка: у всех title блоков должны быть переводы
      const titleBlocks = await Blocks.findAll({
        where: {
          pageId: page.id,
          type: "title",
        },
        transaction,
      });

      for (const block of titleBlocks) {
        const translations = block.data?.translations || {};
        if (Object.keys(translations).length === 0) {
          await transaction.rollback();
          return res.status(400).json({
            error: "Все title блоки должны иметь хотя бы один перевод",
          });
        }
      }

      // Обновляем статус на published
      await page.update({ status: "published" }, { transaction });

      await transaction.commit();

      // Возвращаем обновленную страницу с блоками
      const updatedPage = await Pages.findByPk(req.params.id, {
        include: [
          {
            model: Blocks,
            as: "blocks",
            order: [["order", "ASC"]],
          },
        ],
      });

      res.json({
        message: "Страница успешно опубликована",
        page: updatedPage,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при публикации страницы:", error);
      res.status(500).json({
        error: "Не удалось опубликовать страницу",
      });
    }
  },

  // Снять с публикации (вернуть в черновики)
  unpublishPage: async (req, res) => {
    try {
      const page = await Pages.findByPk(req.params.id);

      if (!page) {
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      if (page.status === "draft") {
        return res.status(400).json({
          error: "Страница уже находится в черновиках",
        });
      }

      await page.update({ status: "draft" });

      // Возвращаем обновленную страницу с блоками
      const updatedPage = await Pages.findByPk(req.params.id, {
        include: [
          {
            model: Blocks,
            as: "blocks",
            order: [["order", "ASC"]],
          },
        ],
      });

      res.json({
        message: "Страница снята с публикации",
        page: updatedPage,
      });
    } catch (error) {
      console.error("Ошибка при снятии страницы с публикации:", error);
      res.status(500).json({
        error: "Не удалось снять страницу с публикации",
      });
    }
  },

  // Удалить страницу
  deletePage: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const page = await Pages.findByPk(req.params.id, { transaction });

      if (!page) {
        await transaction.rollback();
        return res.status(404).json({
          error: "Страница не найдена",
        });
      }

      // Проверяем, можно ли удалить опубликованную страницу
      if (page.status === "published") {
        const { force } = req.query;
        if (force !== "true") {
          await transaction.rollback();
          return res.status(400).json({
            error:
              "Нельзя удалить опубликованную страницу. Добавьте параметр ?force=true для принудительного удаления",
          });
        }
      }

      // ВАЖНО: Сначала удаляем элементы contact-info блоков (включая файлы)
      const contactInfoBlocks = await Blocks.findAll({
        where: { pageId: page.id, type: "contact-info" },
        transaction,
      });

      for (const block of contactInfoBlocks) {
        // Удаляем все элементы контактной информации
        // individualHooks: true активирует хук beforeDestroy для каждого элемента
        await ContactInfoItems.destroy({
          where: { blockId: block.id },
          individualHooks: true,
          transaction,
        });
      }

      // Затем удаляем все блоки страницы
      await Blocks.destroy({
        where: { pageId: page.id },
        transaction,
      });

      // И наконец удаляем саму страницу
      await page.destroy({ transaction });

      await transaction.commit();

      res.json({
        message: "Страница успешно удалена",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении страницы:", error);
      res.status(500).json({
        error: "Не удалось удалить страницу",
      });
    }
  },

  // Получить статистику по страницам
  getPagesStats: async (req, res) => {
    try {
      const stats = await Pages.findAll({
        attributes: [
          "status",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        group: ["status"],
        raw: true,
      });

      const totalBlocks = await Blocks.count();

      res.json({
        pageStats: stats,
        totalBlocks,
      });
    } catch (error) {
      console.error("Ошибка при получении статистики:", error);
      res.status(500).json({
        error: "Не удалось получить статистику",
      });
    }
  },
};

module.exports = pagesController;
