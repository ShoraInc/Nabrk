const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create subdirectories based on content type
        let uploadPath = uploadsDir;
        
        if (req.originalUrl.includes('/news/')) {
            uploadPath = path.join(uploadsDir, 'news');
        } else if (req.originalUrl.includes('/events/')) {
            uploadPath = path.join(uploadsDir, 'events');
        }
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    // Allowed image types
    const allowedTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'image/gif'
    ];
    
    // Check file type
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF images are allowed.'), false);
    }
};

// Configure multer for content creation
const uploadForContent = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file at a time
    }
});

// Single image upload middleware for content creation
const uploadContentImage = uploadForContent.single('image');

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'File too large. Maximum size is 5MB.' 
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                error: 'Too many files. Only one file allowed.' 
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
                error: 'Unexpected field name. Use "image" field.' 
            });
        }
    }
    
    if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }
    
    next(err);
};

// Process uploaded image and generate URL
const processUploadedImage = (req, res, next) => {
    if (req.file) {
        // Generate image URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const imagePath = req.file.path.replace(path.join(__dirname, '../'), '');
        req.body.imageUrl = `${baseUrl}/${imagePath.replace(/\\/g, '/')}`;
    }
    next();
};

module.exports = {
    uploadContentImage,
    handleUploadError,
    processUploadedImage
};