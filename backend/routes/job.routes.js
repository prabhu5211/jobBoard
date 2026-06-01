import { Router } from 'express';
import { body } from 'express-validator';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/job.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Optional auth — attaches user to req if token present, doesn't block if missing
const optionalAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization?.startsWith('Bearer')) {
      const { default: jwt } = await import('jsonwebtoken');
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { default: User } = await import('../models/User.model.js');
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch {
    // invalid/missing token is fine for public routes
  }
  next();
};

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  body('experienceLevel')
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

router.get('/', getJobs);
router.get('/my-jobs', protect, authorize('recruiter', 'admin'), getMyJobs);
router.get('/:id', optionalAuth, getJobById);
router.post('/', protect, authorize('recruiter', 'admin'), jobValidation, createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

export default router;
