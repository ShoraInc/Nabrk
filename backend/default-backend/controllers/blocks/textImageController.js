const { BLOCK_OPTIONS } = require("../../constants/blockConstants");
const { Blocks, Pages, sequelize } = require("../../models");
const path = require("path");
const fs = require("fs");

const textImageController = {
  // Создать text-image блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        pageId,
        order = 0,
        text,
        language = "kz",
        // Text-Image специфичные поля
        imagePosition = "left", // left или right
        marginTop = 0,
        marginBottom = 16,
        isHidden,
      } = req.body;

      // Конвертируем строки в числа (FormData передает все как строки)
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
          error: "Text is required for text-image block",
        });
      }

      // Валидация языка
      if (!BLOCK_OPTIONS.languages.includes(language)) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Unsupported language code: '${language}'. Supported languages: ${BLOCK_OPTIONS.languages.join(", ")}`,
        });
      }

      // Проверяем загружен ли файл
      const imagePath = req.file ? req.file.path : null;
      const imageUrl = req.file ? `/uploads/blocks/${req.file.filename}` : null;

      // Подготавливаем данные для text-image блока
      const textImageData = {
        // Переводы хранятся прямо в data
        translations: {
          [language]: text.trim()
        },
        // Изображение
        imagePath: imagePath,
        imageUrl: imageUrl,
        // Настройки
        imagePosition,
        marginTop: marginTopNum,
        marginBottom: marginBottomNum,
      };

      // Создаем блок
      const block = await Blocks.create(
        {
          pageId,
          type: "text-image",
          order,
          isHidden: isHidden ?? false,
          data: textImageData,
        },
        { transaction }
      );

      await transaction.commit();

      res.status(201).json(block.toJSON());
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при создании text-image блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Получить text-image блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "text-image") {
        return res.status(404).json({ error: "Text-image block not found" });
      }

      res.json(block.toJSON());
    } catch (error) {
      console.error("Ошибка при получении text-image блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить text-image блок (стили и изображение)
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        order,
        imagePosition,
        marginTop,
        marginBottom,
      } = req.body;

      // Конвертируем строки в числа (FormData передает все как строки)
      const orderNum = order !== undefined ? parseInt(order) : undefined;
      const marginTopNum = marginTop !== undefined ? parseInt(marginTop) : undefined;
      const marginBottomNum = marginBottom !== undefined ? parseInt(marginBottom) : undefined;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "text-image") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text-image block not found" });
      }

      // Подготавливаем обновления
      const updates = {};
      if (orderNum !== undefined) updates.order = orderNum;

      const currentData = block.data || {};
      const dataUpdates = { ...currentData };

      // Если загружено новое изображение
      if (req.file) {
        // Удаляем старое изображение
        if (currentData.imagePath && fs.existsSync(currentData.imagePath)) {
          fs.unlinkSync(currentData.imagePath);
        }
        
        // Обновляем пути к новому изображению
        dataUpdates.imagePath = req.file.path;
        dataUpdates.imageUrl = `/uploads/blocks/${req.file.filename}`;
      }

      // Обновляем только стили, переводы остаются без изменений
      if (imagePosition !== undefined) dataUpdates.imagePosition = imagePosition;
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
      console.error("Ошибка при обновлении text-image блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить text-image блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "text-image") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text-image block not found" });
      }

      // Удаляем файл изображения если он есть
      if (block.data?.imagePath && fs.existsSync(block.data.imagePath)) {
        try {
          fs.unlinkSync(block.data.imagePath);
          console.log(`Image file deleted: ${block.data.imagePath}`);
        } catch (fileError) {
          console.error("Error deleting image file:", fileError);
          // Не прерываем операцию, просто логируем ошибку
        }
      }

      // Удаляем сам блок
      await block.destroy({ transaction });

      await transaction.commit();
      res.json({ message: "Text-image block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("Ошибка при удалении text-image блока:", error);
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

      if (!block || block.type !== "text-image") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text-image block not found" });
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
        "Ошибка при создании/обновлении перевода text-image блока:",
        error
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Получить все переводы для блока
  getTranslations: async (req, res) => {
    try {
      const block = await Blocks.findByPk(req.params.id);

      if (!block || block.type !== "text-image") {
        return res.status(404).json({ error: "Text-image block not found" });
      }

      const translations = block.data?.translations || {};
      
      res.json({
        blockId: block.id,
        translations: translations
      });
    } catch (error) {
      console.error("Ошибка при получении переводов text-image блока:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить перевод
  deleteTranslation: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { lang } = req.params;

      const block = await Blocks.findByPk(req.params.id, { transaction });

      if (!block || block.type !== "text-image") {
        await transaction.rollback();
        return res.status(404).json({ error: "Text-image block not found" });
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
      console.error("Ошибка при удалении перевода text-image блока:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = textImageController;
