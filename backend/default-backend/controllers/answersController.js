const { Op } = require("sequelize");
const { Answers, Question, Types, Texts, TextTranslations } = require("../models");

module.exports = {
  async getAll(req, res) {
    try {
      const { search, published } = req.query;
      const where = {};
      if (typeof published !== 'undefined') {
        where.published = String(published) === 'true';
      }
      if (search) {
        where[Op.or] = [
          { answer: { [Op.iLike]: `%${search}%` } },
        ];
      }
      const answers = await Answers.findAll({
        where,
        include: [
          { model: Question, as: 'Question' },
          {
            model: Types,
            as: 'Type',
            include: [{ model: Texts, as: 'text', include: [{ model: TextTranslations, as: 'translations' }] }]
          }
        ],
        order: [["id", "DESC"]]
      });

      const formatted = answers.map(a => {
        const obj = a.toJSON();
        if (obj.Type && obj.Type.text) {
          const titles = { en: '', ru: '', kz: '' };
          (obj.Type.text.translations || []).forEach(tr => { titles[tr.languageCode] = tr.textValue; });
          obj.Type = { id: obj.Type.id, titleId: obj.Type.titleId, titles };
        }
        return obj;
      });

      res.json({ answers: formatted });
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch answers' });
    }
  },

  async create(req, res) {
    try {
      const { questionId, answer, adminId, typeId } = req.body;
      if (!questionId || !answer || !typeId) {
        return res.status(400).json({ error: 'Required fields missing' });
      }
      const created = await Answers.create({ questionId, answer, adminId: adminId || null, typeId, published: false });
      res.status(201).json({ answer: created });
    } catch (e) {
      res.status(500).json({ error: 'Failed to create answer' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { answer, typeId } = req.body;
      const a = await Answers.findByPk(id);
      if (!a) return res.status(404).json({ error: 'Not found' });
      await a.update({ answer, typeId });
      res.json({ answer: a });
    } catch (e) {
      res.status(500).json({ error: 'Failed to update answer' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const a = await Answers.findByPk(id);
      if (!a) return res.status(404).json({ error: 'Not found' });
      await a.destroy();
      res.json({ message: 'Answer deleted' });
    } catch (e) {
      res.status(500).json({ error: 'Failed to delete answer' });
    }
  },

  async publish(req, res) {
    try {
      const { id } = req.params;
      const a = await Answers.findByPk(id);
      if (!a) return res.status(404).json({ error: 'Not found' });
      await a.update({ published: true });
      res.json({ answer: a });
    } catch (e) {
      res.status(500).json({ error: 'Failed to publish answer' });
    }
  },

  async unpublish(req, res) {
    try {
      const { id } = req.params;
      const a = await Answers.findByPk(id);
      if (!a) return res.status(404).json({ error: 'Not found' });
      await a.update({ published: false });
      res.json({ answer: a });
    } catch (e) {
      res.status(500).json({ error: 'Failed to unpublish answer' });
    }
  }
};


