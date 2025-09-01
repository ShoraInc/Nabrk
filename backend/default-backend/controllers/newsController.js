const News = require("../models/News");
const Texts = require("../models/Texts");
const TextTranslations = require("../models/TextTranslations");
const { Op } = require("sequelize");

// Get all news with translations
const getAllNews = async (req, res) => {
  try {
    const { lang = "kz", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const news = await News.findAndCountAll({
      where: { isPublished: true },
      order: [["publishedDate", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const newsWithTranslations = await Promise.all(
      news.rows.map(async (item) => {
        const [title, shortDescription] = await Promise.all([
          TextTranslations.findOne({
            where: { textId: item.titleTextId, languageCode: lang },
          }),
          item.shortDescriptionTextId
            ? TextTranslations.findOne({
                where: {
                  textId: item.shortDescriptionTextId,
                  languageCode: lang,
                },
              })
            : null,
        ]);

        return {
          id: item.id,
          title: title?.textValue || "No translation",
          shortDescription: shortDescription?.textValue || null,
          imageUrl: item.imageUrl,
          externalUrl: item.externalUrl,
          views: item.views,
          publishedDate: item.publishedDate,
        };
      })
    );

    res.json({
      news: newsWithTranslations,
      totalPages: Math.ceil(news.count / limit),
      currentPage: parseInt(page),
      totalItems: news.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single news by ID
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang = "kz" } = req.query;

    const news = await News.findOne({
      where: { id, isPublished: true },
    });

    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Increment views
    await news.increment("views");

    const [title, shortDescription, content] = await Promise.all([
      TextTranslations.findOne({
        where: { textId: news.titleTextId, languageCode: lang },
      }),
      news.shortDescriptionTextId
        ? TextTranslations.findOne({
            where: { textId: news.shortDescriptionTextId, languageCode: lang },
          })
        : null,
      TextTranslations.findOne({
        where: { textId: news.contentTextId, languageCode: lang },
      }),
    ]);

    res.json({
      id: news.id,
      title: title?.textValue || "No translation",
      shortDescription: shortDescription?.textValue || null,
      content: content?.textValue || "No translation",
      imageUrl: news.imageUrl,
      externalUrl: news.externalUrl,
      views: news.views + 1,
      publishedDate: news.publishedDate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create news draft
const createNewsDraft = async (req, res) => {
  try {
    const { title, content, shortDescription, externalUrl, language = "kz" } = req.body;
    const imageUrl = req.body.imageUrl; // Set by processUploadedImage middleware

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Create Texts entries
    const titleText = await Texts.create({});
    const contentText = await Texts.create({});
    let shortDescriptionText = null;

    if (shortDescription) {
      shortDescriptionText = await Texts.create({});
    }

    // Create TextTranslations
    await TextTranslations.create({
      textId: titleText.id,
      languageCode: language,
      textValue: title,
    });

    await TextTranslations.create({
      textId: contentText.id,
      languageCode: language,
      textValue: content,
    });

    if (shortDescription && shortDescriptionText) {
      await TextTranslations.create({
        textId: shortDescriptionText.id,
        languageCode: language,
        textValue: shortDescription,
      });
    }

    // Create News entry
    const news = await News.create({
      titleTextId: titleText.id,
      contentTextId: contentText.id,
      shortDescriptionTextId: shortDescriptionText?.id || null,
      imageUrl: imageUrl || null,
      externalUrl: externalUrl || null,
      isPublished: false,
    });

    res.status(201).json({
      id: news.id,
      message: "News draft created successfully",
      primaryLanguage: language,
      imageUrl: imageUrl || null,
    });
  } catch (error) {
    // If error occurs, delete uploaded file if it exists
    if (req.file && req.file.path) {
      const fs = require("fs");
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting uploaded file:", deleteError);
      }
    }
    res.status(500).json({ error: error.message });
  }
};

// NEW: Update news (including image and basic info)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { externalUrl } = req.body;
    const imageUrl = req.body.imageUrl; // Set by processUploadedImage middleware

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Store old image URL for deletion
    const oldImageUrl = news.imageUrl;

    // Update news with new data
    const updateData = {};
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }
    if (externalUrl !== undefined) {
      updateData.externalUrl = externalUrl || null;
    }

    if (Object.keys(updateData).length > 0) {
      await News.update(updateData, { where: { id } });
    }

    // Delete old image file if a new image was uploaded
    if (imageUrl && oldImageUrl && oldImageUrl !== imageUrl) {
      try {
        const fs = require("fs");
        const path = require("path");

        // Extract filename from URL
        const urlParts = oldImageUrl.split("/");
        const filename = urlParts[urlParts.length - 1];

        // Construct file path
        const filePath = path.join(__dirname, "../uploads/news", filename);

        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted old image file: ${filename}`);
        }
      } catch (fileError) {
        console.error("Error deleting old image file:", fileError);
        // Continue even if file deletion fails
      }
    }

    res.json({
      message: "News updated successfully",
      imageUrl: imageUrl || oldImageUrl,
    });
  } catch (error) {
    // If error occurs, delete uploaded file if it exists
    if (req.file && req.file.path) {
      const fs = require("fs");
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting uploaded file:", deleteError);
      }
    }
    res.status(500).json({ error: error.message });
  }
};

// Get all translations for news
const getNewsTranslations = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    const titleTranslations = await TextTranslations.findAll({
      where: { textId: news.titleTextId },
    });

    const contentTranslations = await TextTranslations.findAll({
      where: { textId: news.contentTextId },
    });

    let shortDescriptionTranslations = [];
    if (news.shortDescriptionTextId) {
      shortDescriptionTranslations = await TextTranslations.findAll({
        where: { textId: news.shortDescriptionTextId },
      });
    }

    const translations = {};

    titleTranslations.forEach((t) => {
      if (!translations[t.languageCode]) translations[t.languageCode] = {};
      translations[t.languageCode].title = t.textValue;
    });

    contentTranslations.forEach((t) => {
      if (!translations[t.languageCode]) translations[t.languageCode] = {};
      translations[t.languageCode].content = t.textValue;
    });

    shortDescriptionTranslations.forEach((t) => {
      if (!translations[t.languageCode]) translations[t.languageCode] = {};
      translations[t.languageCode].shortDescription = t.textValue;
    });

    res.json({
      newsId: news.id,
      translations,
      imageUrl: news.imageUrl,
      externalUrl: news.externalUrl,
      isPublished: news.isPublished,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add translation for specific language
const addNewsTranslation = async (req, res) => {
  try {
    const { id, lang } = req.params;
    const { title, content, shortDescription } = req.body;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Check if translation already exists
    const existingTitle = await TextTranslations.findOne({
      where: { textId: news.titleTextId, languageCode: lang },
    });

    if (existingTitle) {
      return res
        .status(400)
        .json({
          error:
            "Translation for this language already exists. Use PUT to update.",
        });
    }

    // Add translations
    await TextTranslations.create({
      textId: news.titleTextId,
      languageCode: lang,
      textValue: title,
    });

    await TextTranslations.create({
      textId: news.contentTextId,
      languageCode: lang,
      textValue: content,
    });

    // Handle shortDescription - create Text record if needed
    if (shortDescription) {
      if (!news.shortDescriptionTextId) {
        // Create new Text record for shortDescription
        const shortDescriptionText = await Texts.create({});

        // Update news record with new textId
        await News.update(
          { shortDescriptionTextId: shortDescriptionText.id },
          { where: { id: news.id } }
        );

        // Create translation for the new text
        await TextTranslations.create({
          textId: shortDescriptionText.id,
          languageCode: lang,
          textValue: shortDescription,
        });
      } else {
        // Text record exists, just add translation
        await TextTranslations.create({
          textId: news.shortDescriptionTextId,
          languageCode: lang,
          textValue: shortDescription,
        });
      }
    }

    res.json({ message: `Translation added for ${lang}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update translation for specific language
const updateNewsTranslation = async (req, res) => {
  try {
    const { id, lang } = req.params;
    const { title, content, shortDescription } = req.body;

    console.log("Updating translation:", {
      id,
      lang,
      title,
      content,
      shortDescription,
    });

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Handle title - always update/create, even if empty
    const existingTitleTranslation = await TextTranslations.findOne({
      where: { textId: news.titleTextId, languageCode: lang },
    });

    if (existingTitleTranslation) {
      await TextTranslations.update(
        { textValue: title || "" },
        { where: { textId: news.titleTextId, languageCode: lang } }
      );
    } else {
      await TextTranslations.create({
        textId: news.titleTextId,
        languageCode: lang,
        textValue: title || "",
      });
    }

    // Handle content - always update/create, even if empty
    const existingContentTranslation = await TextTranslations.findOne({
      where: { textId: news.contentTextId, languageCode: lang },
    });

    if (existingContentTranslation) {
      await TextTranslations.update(
        { textValue: content || "" },
        { where: { textId: news.contentTextId, languageCode: lang } }
      );
    } else {
      await TextTranslations.create({
        textId: news.contentTextId,
        languageCode: lang,
        textValue: content || "",
      });
    }

    // Handle shortDescription - create Text record if needed
    if (shortDescription !== undefined) {
      // Check for undefined, not truthy
      if (!news.shortDescriptionTextId) {
        // Create new Text record for shortDescription
        const shortDescriptionText = await Texts.create({});

        // Update news record with new textId
        await News.update(
          { shortDescriptionTextId: shortDescriptionText.id },
          { where: { id: news.id } }
        );

        // Get all existing languages for this news
        const existingLanguages = await TextTranslations.findAll({
          where: { textId: news.titleTextId },
          attributes: ["languageCode"],
          group: ["languageCode"],
        });

        // Create shortDescription translations for all existing languages
        for (const langRecord of existingLanguages) {
          await TextTranslations.create({
            textId: shortDescriptionText.id,
            languageCode: langRecord.languageCode,
            textValue:
              langRecord.languageCode === lang ? shortDescription || "" : "",
          });
        }
      } else {
        // Text record exists, check if translation exists for this language
        const existingShortDescTranslation = await TextTranslations.findOne({
          where: { textId: news.shortDescriptionTextId, languageCode: lang },
        });

        if (existingShortDescTranslation) {
          // Update existing translation
          await TextTranslations.update(
            { textValue: shortDescription || "" },
            {
              where: {
                textId: news.shortDescriptionTextId,
                languageCode: lang,
              },
            }
          );
        } else {
          // Create new translation for this language
          await TextTranslations.create({
            textId: news.shortDescriptionTextId,
            languageCode: lang,
            textValue: shortDescription || "",
          });
        }
      }
    }

    console.log(`Translation updated successfully for ${lang}`);
    res.json({ message: `Translation updated for ${lang}` });
  } catch (error) {
    console.error("Error updating translation:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete translation for specific language
const deleteNewsTranslation = async (req, res) => {
  try {
    const { id, lang } = req.params;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Delete translations
    await TextTranslations.destroy({
      where: { textId: news.titleTextId, languageCode: lang },
    });

    await TextTranslations.destroy({
      where: { textId: news.contentTextId, languageCode: lang },
    });

    if (news.shortDescriptionTextId) {
      await TextTranslations.destroy({
        where: { textId: news.shortDescriptionTextId, languageCode: lang },
      });
    }

    res.json({ message: `Translation deleted for ${lang}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Publish news
const publishNews = async (req, res) => {
  try {
    const { id } = req.params;

    await News.update(
      { isPublished: true, publishedDate: new Date() },
      { where: { id } }
    );

    res.json({ message: "News published successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unpublish news
const unpublishNews = async (req, res) => {
  try {
    const { id } = req.params;

    await News.update({ isPublished: false }, { where: { id } });

    res.json({ message: "News unpublished successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all drafts
const getNewsDrafts = async (req, res) => {
  try {
    const { lang = "kz", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const news = await News.findAndCountAll({
      where: { isPublished: false },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const newsWithTranslations = await Promise.all(
      news.rows.map(async (item) => {
        const title = await TextTranslations.findOne({
          where: { textId: item.titleTextId, languageCode: lang },
        });

        return {
          id: item.id,
          title: title?.textValue || "No translation",
          imageUrl: item.imageUrl,
          createdAt: item.createdAt,
        };
      })
    );

    res.json({
      drafts: newsWithTranslations,
      totalPages: Math.ceil(news.count / limit),
      currentPage: parseInt(page),
      totalItems: news.count,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: "News not found" });
    }

    // Store textIds for later deletion
    const textIdsToDelete = [news.titleTextId, news.contentTextId];
    if (news.shortDescriptionTextId) {
      textIdsToDelete.push(news.shortDescriptionTextId);
    }

    // Delete image file if exists
    if (news.imageUrl) {
      try {
        const fs = require("fs");
        const path = require("path");

        // Extract filename from URL
        const urlParts = news.imageUrl.split("/");
        const filename = urlParts[urlParts.length - 1];

        // Construct file path
        const filePath = path.join(__dirname, "../uploads/news", filename);

        // Check if file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Deleted image file: ${filename}`);
        }
      } catch (fileError) {
        console.error("Error deleting image file:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    // 1. First delete News record (this removes foreign key constraints)
    await News.destroy({ where: { id } });

    // 2. Then delete related TextTranslations
    await TextTranslations.destroy({
      where: {
        textId: {
          [Op.in]: textIdsToDelete,
        },
      },
    });

    // 3. Finally delete Texts records
    await Texts.destroy({
      where: {
        id: {
          [Op.in]: textIdsToDelete,
        },
      },
    });

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNewsDraft,
  updateNews, // NEW FUNCTION
  getNewsTranslations,
  addNewsTranslation,
  updateNewsTranslation,
  deleteNewsTranslation,
  publishNews,
  unpublishNews,
  getNewsDrafts,
  deleteNews,
};