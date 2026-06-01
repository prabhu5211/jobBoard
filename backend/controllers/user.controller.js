import User from '../models/User.model.js';
import { cloudinary, uploadToCloudinary } from '../middleware/upload.middleware.js';

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -resetPasswordToken -resetPasswordExpire'
    );
    if (!user || !user.isActive) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'bio', 'location', 'skills', 'experience', 'company'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / update avatar
// @route   PUT /api/users/avatar
// @access  Private
export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar from Cloudinary
    if (user.avatar?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      } catch (e) {
        console.warn('Could not delete old avatar:', e.message);
      }
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'job-board-images',
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    user.avatar = { public_id: result.public_id, url: result.secure_url };
    await user.save();

    res.status(200).json({ success: true, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / update resume
// @route   PUT /api/users/resume
// @access  Private (candidate)
export const updateResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file provided' });
    }

    const user = await User.findById(req.user._id);

    // Delete old resume from Cloudinary
    if (user.resume?.public_id) {
      try {
        await cloudinary.uploader.destroy(user.resume.public_id, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Could not delete old resume:', e.message);
      }
    }

    // Upload to Cloudinary — preserve original filename and extension
    const originalName = req.file.originalname.replace(/\s+/g, '_');
    const ext = originalName.split('.').pop().toLowerCase();
    const baseName = originalName.replace(new RegExp(`\\.${ext}$`, 'i'), '');
    const userId = req.user._id.toString();

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'job-board-resumes',
      resource_type: 'raw',
      type: 'upload',                              // public access
      public_id: `${baseName}_${userId}.${ext}`,   // e.g. MyResume_abc123.pdf
      overwrite: true,
      access_mode: 'public',                       // explicitly public
    });

    console.log('Resume uploaded to Cloudinary:', result.secure_url);

    user.resume = { public_id: result.public_id, url: result.secure_url };
    await user.save();

    res.status(200).json({ success: true, resume: user.resume });
  } catch (error) {
    console.error('Resume update error:', error);
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/users/resume
// @access  Private (candidate)
export const deleteResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.resume?.public_id) {
      try {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        await cloudinary.uploader.destroy(user.resume.public_id, { resource_type: 'raw' });
      } catch (e) {
        console.warn('Could not delete resume from Cloudinary:', e.message);
      }
    }

    user.resume = { public_id: '', url: '' };
    await user.save();

    res.status(200).json({ success: true, message: 'Resume removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a signed download URL for a resume
// @route   POST /api/users/resume-url
// @access  Private
export const getResumeDownloadUrl = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'publicId is required' });
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const signedUrl = cloudinary.utils.private_download_url(publicId, '', {
      resource_type: 'raw',
      type: 'upload',
      expires_at: Math.floor(Date.now() / 1000) + 60,
      attachment: true,
    });

    res.status(200).json({ success: true, url: signedUrl });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(Number(limit));
    res.status(200).json({ success: true, total, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate a user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (admin)
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isActive = false;
    await user.save();
    res.status(200).json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
