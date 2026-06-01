import { Router } from 'express';
import {
  applyForJob,
  getApplicationsForJob,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/application.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';

const router = Router();

// Wrap uploadResume so it doesn't crash if no file is sent
const optionalResumeUpload = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      // Multer error (wrong file type, too large, etc.) — pass it on
      return next(err);
    }
    // No file is fine — just continue
    next();
  });
};

// ── Specific routes FIRST (before param routes) ───────────────────────────────
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getApplicationsForJob);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);
router.delete('/:id', protect, authorize('candidate'), withdrawApplication);

// ── Param route LAST ──────────────────────────────────────────────────────────
router.post('/:jobId', protect, authorize('candidate'), optionalResumeUpload, applyForJob);

export default router;
