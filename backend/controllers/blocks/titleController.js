const { BLOCK_OPTIONS } = require("../../constants/blockConstants");
const { Blocks, Pages, sequelize } = require("../../models");

const titleController = {
  // Создать title блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        pageId,
        order = 0,
        text,
        language = "kz",
        // Title-специфичные поля
        fontSize = "16px",
        fontWeight = "400",
        color = "#000000",
        textAlign = "left",
        marginTop = 0,
        marginBottom = 0,
      } = req.body;

      // Проверяем существует ли страница
      const page = await Pages.findByPk(pageId, { transaction });
      if (!page) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Page with ID ${pageId} does not exist`,
        });
      }

      // Валидация обязательного текста
      if (!text || !text.trim()) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Text is required for title block",
        });
      }

      // Валидация языка
      if (!BLOCK_OPTIONS.languages.includes(language)) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Unsupported language code: '${language}'. Supported languages: ${BLOCK_OPTIONS.languages.join(", ")}`,
        });
      }

      // Подготавливаем данные для title блока с переводами в JSON
      const titleData = {
        // Переводы хранятся прямо в data
        translations: {
          [language]: text.trim()
        },
        // Стили
        fontSize,
        fontWeight,
        color,
        textAlign,
        marginTop,
        marginBottom,
      };

      // Создаем блок
      const block = await Blocks.create(
        {
          pageId,
          type: "title",
          order,
          data: titleData,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json(block.toJSON());
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Получить title блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "title") {
        return res.status(404).json({ error: "Title block not found" });
      }

      res.json(block.toJSON());
    } catch (error) {
      console.error("Ошибка при получении title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить title блок (стили)
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        order,
        fontSize,
        fontWeight,
        color,
        textAlign,
        marginTop,
        marginBottom,
      } = req.body;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "title") {
        await transaction.rollback();
        return res.status(404).json({ error: "Title block not found" });
      }

      // Подготавливаем обновления
      const updates = {};
      if (order !== undefined) updates.order = order;

      const currentData = block.data || {};
      const dataUpdates = { ...currentData };

      // Обновляем только стили, переводы остаются без изменений
      if (fontSize !== undefined) dataUpdates.fontSize = fontSize;
      if (fontWeight !== undefined) dataUpdates.fontWeight = fontWeight;
      if (color !== undefined) dataUpdates.color = color;
      if (textAlign !== undefined) dataUpdates.textAlign = textAlign;
      if (marginTop !== undefined) dataUpdates.marginTop = marginTop;
      if (marginBottom !== undefined) dataUpdates.marginBottom = marginBottom;

      if (JSON.stringify(dataUpdates) !== JSON.stringify(currentData)) {
        updates.data = dataUpdates;
      }

      if (Object.keys(updates).length > 0) {
        await block.update(updates, { transaction });
      }

      await transaction.commit();

      res.json(block.toJSON());
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при обновлении title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить title блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "title") {
        await transaction.rollback();
        return res.status(404).json({ error: "Title block not found" });
      }

      // Просто удаляем блок (больше не нужно удалять связанные тексты)
      await block.destroy({ transaction });

      await transaction.commit();
      res.json({ message: "Title block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Создать или обновить перевод
  upsertTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { text } = req.body;
      const { lang } = req.params;

      // Валидация языка
      if (!BLOCK_OPTIONS.languages.includes(lang)) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Unsupported language code: '${lang}'. Supported languages: ${BLOCK_OPTIONS.languages.join(", ")}`,
        });
      }

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Text is required and must be a non-empty string",
        });
      }

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "title") {
        await transaction.rollback();
        return res.status(404).json({ error: "Title block not found" });
      }

      const currentData = block.data || {};
      const translations = currentData.translations || {};
      
      // Проверяем, существует ли уже перевод
      const isCreated = !translations[lang];
      
      // Обновляем перевод в JSON
      const updatedData = {
        ...currentData,
        translations: {
          ...translations,
          [lang]: text.trim()
        }
      };

      await block.update({ data: updatedData }, { transaction });

      await transaction.commit();

      res.status(isCreated ? 201 : 200).json({
        textId: block.id, // используем ID блока
        languageCode: lang,
        textValue: text.trim(),
        _meta: {
          action: isCreated ? "created" : "updated",
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error(
        "Ошибка при создании/обновлении перевода title блока:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Получить все переводы для блока
  getTranslations: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "title") {
        return res.status(404).json({ error: "Title block not found" });
      }

      const translations = block.data?.translations || {};
      
      res.json({
        blockId: block.id,
        translations: translations
      });
    } catch (error) {
      console.error("Ошибка при получении переводов title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить перевод
  deleteTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { lang } = req.params;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "title") {
        await transaction.rollback();
        return res.status(404).json({ error: "Title block not found" });
      }

      const currentData = block.data || {};
      const translations = currentData.translations || {};

      if (!translations[lang]) {
        await transaction.rollback();
        return res.status(404).json({ error: "Translation not found" });
      }

      // Удаляем перевод
      const { [lang]: deleted, ...remainingTranslations } = translations;
      
      const updatedData = {
        ...currentData,
        translations: remainingTranslations
      };

      await block.update({ data: updatedData }, { transaction });

      await transaction.commit();

      res.json({ message: "Translation deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении перевода title блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = titleController;