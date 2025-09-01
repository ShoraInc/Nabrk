const { Blocks, Pages, sequelize } = require("../../models");

const textController = {
  // Создать text блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        pageId,
        order = 0,
        text,
        language = "kz",
        // Text специфичные поля
        fontSize = "16px",
        fontWeight = "400",
        textColor = "#000000",
        textAlign = "left",
        marginTop = 0,
        marginBottom = 16,
        isHidden = false,
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
          error: "Page not found",
        });
      }

      // Проверяем что текст не пустой
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Text is required and cannot be empty",
        });
      }

      // Получаем максимальный order для страницы
      const maxOrderBlock = await Blocks.findOne({
        where: { pageId },
        order: [["order", "DESC"]],
        transaction,
      });

      const blockOrder = maxOrderBlock ? maxOrderBlock.order + 1 : orderNum;

      // Подготавливаем данные для text блока
      const textData = {
        // Переводы хранятся прямо в data
        translations: {
          [language]: text.trim()
        },
        // Стили текста
        fontSize,
        fontWeight,
        textColor,
        textAlign,
        marginTop: marginTopNum,
        marginBottom: marginBottomNum,
      };

      // Создаем блок
      const block = await Blocks.create(
        {
          pageId,
          type: "text",
          order: blockOrder,
          isHidden,
          data: textData,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: "Text block created successfully",
        block: {
          id: block.id,
          pageId: block.pageId,
          type: block.type,
          order: block.order,
          isHidden: block.isHidden,
          data: block.data,
          createdAt: block.createdAt,
          updatedAt: block.updatedAt,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error creating text block:", error);
      res.status(500).json({
        error: "Failed to create text block: " + error.message,
      });
    }
  },

  // Получить text блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "text") {
        return res.status(404).json({ error: "Text block not found" });
      }

      res.json({
        success: true,
        block: {
          id: block.id,
          pageId: block.pageId,
          type: block.type,
          order: block.order,
          isHidden: block.isHidden,
          data: block.data,
          createdAt: block.createdAt,
          updatedAt: block.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error fetching text block:", error);
      res.status(500).json({
        error: "Failed to fetch text block: " + error.message,
      });
    }
  },

  // Обновить text блок
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        order,
        fontSize,
        fontWeight,
        textColor,
        textAlign,
        marginTop,
        marginBottom,
      } = req.body;

      // Конвертируем строки в числа (FormData передает все как строки)
      const orderNum = order !== undefined ? parseInt(order) : undefined;
      const marginTopNum = marginTop !== undefined ? parseInt(marginTop) : undefined;
      const marginBottomNum = marginBottom !== undefined ? parseInt(marginBottom) : undefined;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "text") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text block not found" });
      }

      // Подготавливаем обновления
      const updates = {};
      if (orderNum !== undefined) updates.order = orderNum;

      const currentData = block.data || {};
      const dataUpdates = { ...currentData };

      // Обновляем стили текста
      if (fontSize !== undefined) dataUpdates.fontSize = fontSize;
      if (fontWeight !== undefined) dataUpdates.fontWeight = fontWeight;
      if (textColor !== undefined) dataUpdates.textColor = textColor;
      if (textAlign !== undefined) dataUpdates.textAlign = textAlign;
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

      res.json({
        success: true,
        message: "Text block updated successfully",
        block: {
          id: block.id,
          pageId: block.pageId,
          type: block.type,
          order: block.order,
          isHidden: block.isHidden,
          data: block.data,
          createdAt: block.createdAt,
          updatedAt: block.updatedAt,
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error updating text block:", error);
      res.status(500).json({
        error: "Failed to update text block: " + error.message,
      });
    }
  },

  // Удалить text блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "text") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text block not found" });
      }

      await block.destroy({ transaction });
      await transaction.commit();

      res.json({
        success: true,
        message: "Text block deleted successfully",
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting text block:", error);
      res.status(500).json({
        error: "Failed to delete text block: " + error.message,
      });
    }
  },

  // Добавить/обновить перевод
  upsertTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { id, lang } = req.params;
      const { text } = req.body;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Text is required and cannot be empty",
        });
      }

      const block = await Blocks.findByPk(id, { transaction });

      if (!block || block.type !== "text") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text block not found" });
      }

      // Проверяем поддерживаемые языки
      const supportedLanguages = ['kz', 'ru', 'en'];
      if (!supportedLanguages.includes(lang)) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Unsupported language: ${lang}. Supported: ${supportedLanguages.join(', ')}`
        });
      }

      const updatedData = {
        ...block.data,
        translations: {
          ...block.data.translations,
          [lang]: text.trim()
        }
      };

      await block.update({ data: updatedData }, { transaction });
      await transaction.commit();

      res.json({
        success: true,
        message: `Translation for '${lang}' ${block.data.translations?.[lang] ? 'updated' : 'created'} successfully`,
        data: {
          id: block.id,
          language: lang,
          text: text.trim(),
          action: block.data.translations?.[lang] ? "updated" : "created",
        },
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error upserting text translation:", error);
      res.status(500).json({
        error: "Failed to save translation: " + error.message,
      });
    }
  },

  // Получить все переводы блока
  getTranslations: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "text") {
        return res.status(404).json({ error: "Text block not found" });
      }

      const translations = block.data?.translations || {};

      res.json({
        success: true,
        translations,
        availableLanguages: Object.keys(translations),
      });
    } catch (error) {
      console.error("Error fetching text translations:", error);
      res.status(500).json({
        error: "Failed to fetch translations: " + error.message,
      });
    }
  },

  // Удалить перевод
  deleteTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { id, lang } = req.params;

      const block = await Blocks.findByPk(id, { transaction });

      if (!block || block.type !== "text") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text block not found" });
      }

      const translations = block.data?.translations || {};

      if (!translations[lang]) {
        await transaction.rollback();
        return res.status(404).json({
          error: `Translation for language '${lang}' not found`,
        });
      }

      // Проверяем что это не последний перевод
      const remainingTranslations = Object.keys(translations).filter(l => l !== lang);
      if (remainingTranslations.length === 0) {
        await transaction.rollback();
        return res.status(400).json({
          error: "Cannot delete the last translation. At least one translation must remain.",
        });
      }

      const updatedTranslations = { ...translations };
      delete updatedTranslations[lang];

      const updatedData = {
        ...block.data,
        translations: updatedTranslations
      };

      await block.update({ data: updatedData }, { transaction });
      await transaction.commit();

      res.json({
        success: true,
        message: `Translation for '${lang}' deleted successfully`,
        remainingLanguages: Object.keys(updatedTranslations),
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting text translation:", error);
      res.status(500).json({
        error: "Failed to delete translation: " + error.message,
      });
    }
  },
};

module.exports = textController;
