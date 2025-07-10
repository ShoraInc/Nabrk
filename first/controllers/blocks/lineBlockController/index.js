const { Pages, sequelize, Blocks, LineData } = require("../../../models");


const lineBlockController = {
  // Создать line блок
  create: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        pageId,
        order,
        color,
        height,
        width,
        style,
        marginTop,
        marginBottom,
      } = req.body;

      // Проверяем существует ли страница
      const page = await Pages.findByPk(pageId);
      if (!page) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Page with ID ${pageId} does not exist`,
        });
      }

      // Создаем основной блок
      const block = await Blocks.create(
        {
          pageId,
          type: "line",
          order: order || 0,
        },
        { transaction }
      );

      // Создаем данные line блока
      const lineData = await LineData.create(
        {
          blockId: block.id,
          color: color || "#000000",
          height: height || 1,
          width: width || "100%",
          style: style || "solid",
          marginTop: marginTop || 10,
          marginBottom: marginBottom || 10,
        },
        { transaction }
      );

      await transaction.commit();

      // Возвращаем блок с данными
      const result = await Blocks.findByPk(block.id, {
        include: [
          {
            model: LineData,
            as: "lineData",
          },
        ],
      });

      res.status(201).json(result);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Обновить line блок
  update: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const {
        order,
        color,
        height,
        width,
        style,
        marginTop,
        marginBottom,
      } = req.body;

      const existingBlock = await Blocks.findOne({
        where: { id: req.params.id, type: "line" },
      });

      if (!existingBlock) {
        await transaction.rollback();
        return res.status(404).json({ error: "Line block not found" });
      }

      // Обновляем основной блок
      if (order !== undefined) {
        await Blocks.update(
          { order },
          {
            where: { id: req.params.id, type: "line" },
            transaction,
          }
        );
      }

      // Обновляем данные line блока
      const updateData = {};
      if (color !== undefined) updateData.color = color;
      if (height !== undefined) updateData.height = height;
      if (width !== undefined) updateData.width = width;
      if (style !== undefined) updateData.style = style;
      if (marginTop !== undefined) updateData.marginTop = marginTop;
      if (marginBottom !== undefined) updateData.marginBottom = marginBottom;

      const [updated] = await LineData.update(updateData, {
        where: { blockId: req.params.id },
        transaction,
      });

      if (!updated) {
        await transaction.rollback();
        return res.status(404).json({ error: "Line block data not found" });
      }

      await transaction.commit();

      // Возвращаем обновленный блок
      const result = await Blocks.findByPk(req.params.id, {
        include: [
          {
            model: LineData,
            as: "lineData",
          },
        ],
      });

      res.json(result);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Удалить line блок
  delete: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const existingBlock = await Blocks.findOne({
        where: { id: req.params.id, type: "line" },
      });

      if (!existingBlock) {
        await transaction.rollback();
        return res.status(404).json({ error: "Line block not found" });
      }

      // Удаляем данные line блока
      await LineData.destroy({
        where: { blockId: req.params.id },
        transaction,
      });

      // Удаляем основной блок
      await Blocks.destroy({
        where: { id: req.params.id, type: "line" },
        transaction,
      });

      await transaction.commit();

      res.json({ message: "Line block deleted successfully" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: error.message });
    }
  },

  // Получить line блок по ID
  getById: async (req, res) => {
    try {
      const block = await Blocks.findOne({
        where: {
          id: req.params.id,
          type: "line",
        },
        include: [
          {
            model: LineData,
            as: "lineData",
          },
        ],
      });

      if (!block) {
        return res.status(404).json({ error: "Line block not found" });
      }

      res.json(block);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Получить опции для фронтенда
  getOptions: async (req, res) => {
    try {
      const options = {
        width: LineData.rawAttributes.width.values,
        style: LineData.rawAttributes.style.values,
        heightRange: { min: 1, max: 10 },
        marginRange: { min: 0, max: 100 },
      };
      res.json(options);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = lineBlockController;