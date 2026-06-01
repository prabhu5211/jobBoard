import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  updateAvatar,
  updateResume,
  deleteResume,
  getResumeDownloadUrl,
  getAllUsers,
  deactivateUser,
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadAvatar, uploadResume } from '../middleware/upload.middleware.js';

const router = Router();

// ── Specific routes FIRST (before /:id param route) ──────────────────────────
router.get('/', protect, authorize('admin'), getAllUsers);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar, updateAvatar);
router.put('/resume', protect, authorize('candidate'), uploadResume, updateResume);
router.delete('/resume', protect, authorize('candidate'), deleteResume);
router.post('/resume-url', protect, getResumeDownloadUrl);

// ── Param route LAST ──────────────────────────────────────────────────────────
router.get('/:id', getUserProfile);
router.delete('/:id', protect, authorize('admin'), deactivateUser);

export default router;
