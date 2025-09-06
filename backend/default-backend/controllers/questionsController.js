const { Op } = require("sequelize");
const { Question, Answers, Types, Texts, TextTranslations } = require("../models");

module.exports = {
  async getAll(req, res) {
    try {
      const { search, answered, typeId } = req.query;
      const where = {};
      if (search) {
        where[Op.or] = [
          { Name: { [Op.iLike]: `%${search}%` } },
          { LastName: { [Op.iLike]: `%${search}%` } },
          { Question: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const includeAnswer = {
        model: Answers,
        as: "Answer",
        include: [
          {
            model: Types,
            as: "Type",
            include: [
              { model: Texts, as: "text", include: [{ model: TextTranslations, as: "translations" }] },
            ],
          },
        ],
      };

      // If answered=true, only with published answers
      if (String(answered) === 'true') {
        includeAnswer.required = true;
        includeAnswer.where = { published: true };
        // Filter by typeId if provided
        if (typeId) {
          includeAnswer.include = [
            {
              model: Types,
              as: 'Type',
              where: { id: Number(typeId) },
              include: [{ model: Texts, as: 'text', include: [{ model: TextTranslations, as: 'translations' }] }]
            }
          ];
        }
      } else if (typeId) {
        // If not answered-only but typeId provided, still include and filter
        includeAnswer.required = true;
        includeAnswer.include = [
          {
            model: Types,
            as: 'Type',
            where: { id: Number(typeId) },
            include: [{ model: Texts, as: 'text', include: [{ model: TextTranslations, as: 'translations' }] }]
          }
        ];
      }

      const questions = await Question.findAll({
        where,
        include: [includeAnswer],
        order: [["id", "DESC"]],
      });

      const formatted = questions.map((q) => {
        const obj = q.toJSON();
        if (obj.Answer && obj.Answer.Type && obj.Answer.Type.text) {
          const titles = { en: "", ru: "", kz: "" };
          (obj.Answer.Type.text.translations || []).forEach((tr) => {
            titles[tr.languageCode] = tr.textValue;
          });
          obj.Answer.Type = { id: obj.Answer.Type.id, titleId: obj.Answer.Type.titleId, titles };
        }
        return obj;
      });

      res.json({ questions: formatted });
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  },

  async create(req, res) {
    try {
      const { Name, LastName, Question: QuestionText } = req.body;
      if (!Name || !LastName || !QuestionText) {
        return res.status(400).json({ error: "Required fields missing" });
      }
      const q = await Question.create({ Name, LastName, Question: QuestionText });
      res.status(201).json({ newQuestion: q });
    } catch (e) {
      res.status(500).json({ error: "Failed to create question" });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const q = await Question.findByPk(id);
      if (!q) return res.status(404).json({ error: "Not found" });
      await q.destroy();
      res.json({ message: "Question deleted" });
    } catch (e) {
      res.status(500).json({ error: "Failed to delete question" });
    }
  },
};


