const { Types, Texts, TextTranslations, sequelize } = require("../models");

module.exports = {
  async get(req, res) {
    try {
      const types = await Types.findAll({
        include: [{ model: Texts, as: 'text', include: [{ model: TextTranslations, as: 'translations' }] }]
      });
      const result = types.map(t => {
        const titles = { en: '', ru: '', kz: '' };
        (t.text?.translations || []).forEach(tr => { titles[tr.languageCode] = tr.textValue; });
        return { id: t.id, titles };
      });
      res.json({ types: result });
    } catch (e) {
      res.status(500).json({ error: 'Failed to get types' });
    }
  },

  async create(req, res) {
    const tx = await sequelize.transaction();
    try {
      const { translations } = req.body;
      const text = await Texts.create({}, { transaction: tx });
      for (const [lang, value] of Object.entries(translations || {})) {
        if (value && value.trim()) {
          await TextTranslations.create({ textId: text.id, languageCode: lang, textValue: value.trim() }, { transaction: tx });
        }
      }
      const type = await Types.create({ titleId: text.id }, { transaction: tx });
      await tx.commit();
      res.status(201).json({ type: { id: type.id, titleId: type.titleId } });
    } catch (e) {
      await tx.rollback();
      res.status(500).json({ error: 'Failed to create type' });
    }
  },

  async update(req, res) {
    const tx = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { translations } = req.body;
      const type = await Types.findByPk(id);
      if (!type) {
        await tx.rollback();
        return res.status(404).json({ error: 'Not found' });
      }
      await TextTranslations.destroy({ where: { textId: type.titleId } }, { transaction: tx });
      for (const [lang, value] of Object.entries(translations || {})) {
        if (value && value.trim()) {
          await TextTranslations.create({ textId: type.titleId, languageCode: lang, textValue: value.trim() }, { transaction: tx });
        }
      }
      await tx.commit();
      res.json({ message: 'Type updated' });
    } catch (e) {
      await tx.rollback();
      res.status(500).json({ error: 'Failed to update type' });
    }
  },

  async remove(req, res) {
    const tx = await sequelize.transaction();
    try {
      const { id } = req.params;
      const type = await Types.findByPk(id);
      if (!type) {
        await tx.rollback();
        return res.status(404).json({ error: 'Not found' });
      }
      await TextTranslations.destroy({ where: { textId: type.titleId } }, { transaction: tx });
      await Texts.destroy({ where: { id: type.titleId } }, { transaction: tx });
      await type.destroy({ transaction: tx });
      await tx.commit();
      res.json({ message: 'Type deleted' });
    } catch (e) {
      await tx.rollback();
      res.status(500).json({ error: 'Failed to delete type' });
    }
  }
};


