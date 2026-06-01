import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// ── Use memory storage — we stream to Cloudinary manually ─────────────────────
const storage = multer.memoryStorage();

// File filter
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer instances
export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: fileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
}).single('resume');

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp']),
}).single('avatar');

// ── Helper: stream a buffer to Cloudinary ─────────────────────────────────────
export const uploadToCloudinary = (buffer, options = {}) => {
  // Always reconfigure to pick up env vars at call time
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Helper to make a Cloudinary raw URL force-download with correct filename
export const makeDownloadUrl = (url) => {
  if (!url || !url.startsWith('http')) return url;
  const filename = url.split('/').pop();
  return url.replace('/upload/', `/upload/fl_attachment:${filename}/`);
};

export { cloudinary };
