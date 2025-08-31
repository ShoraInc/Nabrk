const { BLOCK_OPTIONS } = require("../../constants/blockConstants");
const { Blocks, Pages, sequelize } = require("../../models");

const buttonController = {
  // Создать button блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        pageId,
        order = 0,
        text,
        language = "kz",
        // Button специфичные поля
        url = "",
        width = "100%", // ширина по процентам
        backgroundColor = "#D4AF37", // золотистый цвет как на фото
        textColor = "#000000",
        marginTop = 0,
        marginBottom = 16,
        isHidden,
      } = req.body;

      // Конвертируем строки в числа (FormData передает все как строки)
      const orderNum = order !== undefined ? parseInt(order) : 0;
      const marginTopNum = marginTop !== undefined ? parseInt(marginTop) : 0;
      const marginBottomNum = marginBottom !== undefined ? parseInt(marginBottom) : 16;

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
          error: "Text is required for button block",
        });
      }

      // Валидация языка
      if (!BLOCK_OPTIONS.languages.includes(language)) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Unsupported language code: '${language}'. Supported languages: ${BLOCK_OPTIONS.languages.join(", ")}`,
        });
      }

      // Подготавливаем данные для button блока
      const buttonData = {
        // Переводы хранятся прямо в data
        translations: {
          [language]: text.trim()
        },
        // Настройки кнопки
        url,
        width,
        backgroundColor,
        textColor,
        marginTop: marginTopNum,
        marginBottom: marginBottomNum,
      };

      // Создаем блок
      const block = await Blocks.create(
        {
          pageId,
          type: "button",
          order: orderNum,
          isHidden: isHidden ?? false,
          data: buttonData,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json(block.toJSON());
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании button блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Получить button блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "button") {
        return res.status(404).json({ error: "Button block not found" });
      }

      res.json(block.toJSON());
    } catch (error) {
      console.error("Ошибка при получении button блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить button блок
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        order,
        url,
        width,
        backgroundColor,
        textColor,
        marginTop,
        marginBottom,
      } = req.body;

      // Конвертируем строки в числа (FormData передает все как строки)
      const orderNum = order !== undefined ? parseInt(order) : undefined;
      const marginTopNum = marginTop !== undefined ? parseInt(marginTop) : undefined;
      const marginBottomNum = marginBottom !== undefined ? parseInt(marginBottom) : undefined;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "button") {
        await transaction.rollback();
        return res.status(404).json({ error: "Button block not found" });
      }

      // Подготавливаем обновления
      const updates = {};
      if (orderNum !== undefined) updates.order = orderNum;

      const currentData = block.data || {};
      const dataUpdates = { ...currentData };

      // Обновляем настройки кнопки
      if (url !== undefined) dataUpdates.url = url;
      if (width !== undefined) dataUpdates.width = width;
      if (backgroundColor !== undefined) dataUpdates.backgroundColor = backgroundColor;
      if (textColor !== undefined) dataUpdates.textColor = textColor;
      if (marginTopNum !== undefined) dataUpdates.marginTop = marginTopNum;
      if (marginBottomNum !== undefined) dataUpdates.marginBottom = marginBottomNum;

      if (JSON.stringify(dataUpdates) !== JSON.stringify(currentData)) {
        updates.data = dataUpdates;
      }

      if (Object.keys(updates).length > 0 || typeof req.body.isHidden !== 'undefined') {
        await block.update(
          {
            ...updates,
            ...(typeof req.body.isHidden !== 'undefined' ? { isHidden: req.body.isHidden } : {})
          },
          { transaction }
        );
      }

      await transaction.commit();

      res.json(block.toJSON());
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при обновлении button блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить button блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "button") {
        await transaction.rollback();
        return res.status(404).json({ error: "Button block not found" });
      }

      // Удаляем сам блок
      await block.destroy({ transaction });

      await transaction.commit();
      res.json({ message: "Button block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении button блока:", error);
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

      if (!block || block.type !== "button") {
        await transaction.rollback();
        return res.status(404).json({ error: "Button block not found" });
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
        "Ошибка при создании/обновлении перевода button блока:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Получить все переводы для блока
  getTranslations: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "button") {
        return res.status(404).json({ error: "Button block not found" });
      }

      const translations = block.data?.translations || {};
      
      res.json({
        blockId: block.id,
        translations: translations
      });
    } catch (error) {
      console.error("Ошибка при получении переводов button блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить перевод
  deleteTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { lang } = req.params;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "button") {
        await transaction.rollback();
        return res.status(404).json({ error: "Button block not found" });
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
      console.error("Ошибка при удалении перевода button блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = buttonController;
