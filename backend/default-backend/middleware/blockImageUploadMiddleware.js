const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory for blocks if it doesn't exist
const blocksUploadsDir = path.join(__dirname, '../uploads/blocks');
if (!fs.existsSync(blocksUploadsDir)) {
    fs.mkdirSync(blocksUploadsDir, { recursive: true });
}

// Configure storage for block images
const blockImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, blocksUploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `block-image-${uniqueSuffix}${extension}`);
    }
});

// File filter function for block images
const blockImageFilter = (req, file, cb) => {
    // Allowed image types
    const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml'
    ];
    
    // Check file type
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF and SVG images are allowed.'), false);
    }
};

// Configure multer for block image uploads
const uploadForBlockImage = multer({
    storage: blockImageStorage,
    fileFilter: blockImageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for block images
        files: 1 // Only one file at a time
    }
});

// Single block image upload middleware
const uploadBlockImage = uploadForBlockImage.single('image');

// Error handling middleware for block images
const handleBlockImageUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'Image file too large. Maximum size is 10MB.' 
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                error: 'Too many files. Only one image allowed per block.' 
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
                error: 'Unexpected field name. Use "image" field for block images.' 
            });
        }
    }
    
    if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }
    
    next(err);
};

// Process uploaded block image
const processBlockImage = (req, res, next) => {
    if (req.file) {
        // Generate relative image URL
        req.body.imagePath = req.file.path;
        req.body.imageUrl = `/uploads/blocks/${req.file.filename}`;
        
        console.log(`Block image uploaded: ${req.file.filename}`);
    }
    next();
};

// Helper function to delete block image file
const deleteBlockImageFile = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            console.log(`Block image file deleted: ${imagePath}`);
            return true;
        } catch (error) {
            console.error(`Error deleting block image file: ${error.message}`);
            return false;
        }
    }
    return false;
};

// Helper function to clean up all block images for a page
const cleanupPageBlockImages = async (pageId, Blocks) => {
    try {
        const blocks = await Blocks.findAll({
            where: { 
                pageId: pageId,
                type: 'text-image' // Only text-image blocks have images
            }
        });

        let deletedCount = 0;
        for (const block of blocks) {
            if (block.data?.imagePath) {
                if (deleteBlockImageFile(block.data.imagePath)) {
                    deletedCount++;
                }
            }
        }

        console.log(`Cleaned up ${deletedCount} block images for page ${pageId}`);
        return deletedCount;
    } catch (error) {
        console.error(`Error cleaning up block images for page ${pageId}:`, error);
        return 0;
    }
};

module.exports = {
    uploadBlockImage,
    handleBlockImageUploadError,
    processBlockImage,
    deleteBlockImageFile,
    cleanupPageBlockImages
};
