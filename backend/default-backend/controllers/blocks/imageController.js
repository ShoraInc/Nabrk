const { Blocks } = require('../../models');
const { validateImageBlock } = require('../../validators/imageValidator');
const { deleteBlockImageFile } = require('../../middleware/blockImageUploadMiddleware');

const imageController = {
  // Создание нового image блока
  async create(req, res) {
    try {
      console.log('Creating image block with data:', req.body);
      console.log('Files:', req.files);

      const { 
        pageId, 
        order = 0, 
        displayMode = 'single',
        aspectRatio = 'auto',
        alignment = 'center',
        marginTop = 0, 
        marginBottom = 16,
        autoPlay = false,
        showDots = true,
        showArrows = true,
        slideSpeed = 5000,
        isHidden = false 
      } = req.body;

      // Конвертируем строковые значения в нужные типы
      const numericOrder = parseInt(order) || 0;
      const numericMarginTop = parseInt(marginTop) || 0;
      const numericMarginBottom = parseInt(marginBottom) || 16;
      const numericSlideSpeed = parseInt(slideSpeed) || 5000;
      const boolAutoPlay = autoPlay === 'true' || autoPlay === true;
      const boolShowDots = showDots === 'true' || showDots === true;
      const boolShowArrows = showArrows === 'true' || showArrows === true;
      const boolIsHidden = isHidden === 'true' || isHidden === true;

      // Обрабатываем загруженные изображения
      const images = [];
      if (req.files && req.files.length > 0) {
        req.files.forEach((file, index) => {
          const altKey = `alt_${index}`;
          const captionKey = `caption_${index}`;
          
          images.push({
            url: file.url,
            path: file.path,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            alt: req.body[altKey] || '',
            caption: req.body[captionKey] || ''
          });
        });
      }

      // Подготавливаем данные блока
      const blockData = {
        displayMode,
        aspectRatio,
        alignment,
        marginTop: numericMarginTop,
        marginBottom: numericMarginBottom,
        sliderOptions: {
          autoPlay: boolAutoPlay,
          showDots: boolShowDots,
          showArrows: boolShowArrows,
          slideSpeed: numericSlideSpeed
        },
        images,
        isHidden: boolIsHidden
      };

      console.log('Processed block data:', blockData);

      // Валидируем данные
      validateImageBlock(blockData);

      // Создаем блок в базе данных
      const block = await Blocks.create({
        pageId: parseInt(pageId),
        type: 'image',
        order: numericOrder,
        data: blockData
      });

      console.log('Image block created successfully:', block.id);

      res.status(201).json({
        success: true,
        message: 'Image block created successfully',
        block: {
          id: block.id,
          type: block.type,
          data: block.data,
          order: block.order
        }
      });

    } catch (error) {
      console.error('Error creating image block:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to create image block',
        error: error.message
      });
    }
  },

  // Получение image блока по ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const block = await Blocks.findByPk(id);
      
      if (!block || block.type !== 'image') {
        return res.status(404).json({
          success: false,
          message: 'Image block not found'
        });
      }

      res.json({
        success: true,
        block: {
          id: block.id,
          type: block.type,
          data: block.data,
          order: block.order
        }
      });

    } catch (error) {
      console.error('Error getting image block:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get image block',
        error: error.message
      });
    }
  },

  // Обновление image блока
  async update(req, res) {
    try {
      const { id } = req.params;
      console.log('Updating image block:', id, 'with data:', req.body);
      console.log('Files:', req.files);

      const block = await Blocks.findByPk(id);
      
      if (!block || block.type !== 'image') {
        return res.status(404).json({
          success: false,
          message: 'Image block not found'
        });
      }

      const { 
        displayMode = block.data.displayMode || 'single',
        aspectRatio = block.data.aspectRatio || 'auto',
        alignment = block.data.alignment || 'center',
        marginTop = block.data.marginTop || 0, 
        marginBottom = block.data.marginBottom || 16,
        autoPlay = block.data.sliderOptions?.autoPlay || false,
        showDots = block.data.sliderOptions?.showDots || true,
        showArrows = block.data.sliderOptions?.showArrows || true,
        slideSpeed = block.data.sliderOptions?.slideSpeed || 5000,
        isHidden = block.data.isHidden || false,
        keepExistingImages = 'false' // По умолчанию заменяем изображения
      } = req.body;

      // Конвертируем строковые значения в нужные типы
      const numericMarginTop = parseInt(marginTop) || 0;
      const numericMarginBottom = parseInt(marginBottom) || 16;
      const numericSlideSpeed = parseInt(slideSpeed) || 5000;
      const boolAutoPlay = autoPlay === 'true' || autoPlay === true;
      const boolShowDots = showDots === 'true' || showDots === true;
      const boolShowArrows = showArrows === 'true' || showArrows === true;
      const boolIsHidden = isHidden === 'true' || isHidden === true;
      const boolKeepExisting = keepExistingImages === 'true';

      // Обрабатываем изображения
      let images = [];
      
      if (boolKeepExisting) {
        // Оставляем существующие изображения
        images = block.data.images || [];
      }

      // Добавляем новые изображения
      if (req.files && req.files.length > 0) {
        const newImages = [];
        req.files.forEach((file, index) => {
          const altKey = `alt_${index}`;
          const captionKey = `caption_${index}`;
          
          newImages.push({
            url: file.url,
            path: file.path,
            filename: file.filename,
            originalName: file.originalname,
            size: file.size,
            alt: req.body[altKey] || '',
            caption: req.body[captionKey] || ''
          });
        });

        if (boolKeepExisting) {
          images = [...images, ...newImages];
        } else {
          // Удаляем старые изображения
          if (block.data.images) {
            for (const oldImage of block.data.images) {
              if (oldImage.path) {
                try {
                  await deleteBlockImageFile(oldImage.path);
                } catch (error) {
                  console.error('Error deleting old image:', error);
                }
              }
            }
          }
          images = newImages;
        }
      }

      // Если нет новых файлов и не сохраняем существующие, оставляем как есть
      if (!req.files?.length && !boolKeepExisting && block.data.images) {
        images = block.data.images;
      }

      // Подготавливаем обновленные данные
      const updatedData = {
        displayMode,
        aspectRatio,
        alignment,
        marginTop: numericMarginTop,
        marginBottom: numericMarginBottom,
        sliderOptions: {
          autoPlay: boolAutoPlay,
          showDots: boolShowDots,
          showArrows: boolShowArrows,
          slideSpeed: numericSlideSpeed
        },
        images,
        isHidden: boolIsHidden
      };

      console.log('Updated block data:', updatedData);

      // Валидируем данные
      validateImageBlock(updatedData);

      // Обновляем блок
      await block.update({ data: updatedData });

      console.log('Image block updated successfully');

      res.json({
        success: true,
        message: 'Image block updated successfully',
        block: {
          id: block.id,
          type: block.type,
          data: block.data,
          order: block.order
        }
      });

    } catch (error) {
      console.error('Error updating image block:', error);
      res.status(400).json({
        success: false,
        message: 'Failed to update image block',
        error: error.message
      });
    }
  },

  // Удаление image блока
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const block = await Blocks.findByPk(id);
      
      if (!block || block.type !== 'image') {
        return res.status(404).json({
          success: false,
          message: 'Image block not found'
        });
      }

      // Удаляем все связанные изображения
      if (block.data.images) {
        for (const image of block.data.images) {
          if (image.path) {
            try {
              await deleteBlockImageFile(image.path);
            } catch (error) {
              console.error('Error deleting image file:', error);
            }
          }
        }
      }

      await block.destroy();

      res.json({
        success: true,
        message: 'Image block deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting image block:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image block',
        error: error.message
      });
    }
  }
};

module.exports = imageController;
