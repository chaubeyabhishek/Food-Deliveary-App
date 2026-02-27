const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use Cloudinary only when credentials are available
const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

let upload;

if (hasCloudinary) {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('../config/cloudinary');
    const storage = new CloudinaryStorage({
        cloudinary,
        params: {
            folder: 'food-app',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        },
    });
    upload = multer({ storage });
    console.log('[upload] Using Cloudinary storage');
} else {
    // Fallback: save images locally to /uploads
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadDir),
        filename: (req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, unique + path.extname(file.originalname));
        },
    });
    upload = multer({
        storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image/')) cb(null, true);
            else cb(new Error('Only image files are allowed'));
        },
    });
    console.log('[upload] Cloudinary not configured — using local disk storage at /uploads');
}

module.exports = upload;
