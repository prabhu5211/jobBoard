import { validationResult } from 'express-validator';
import Job from '../models/Job.model.js';

// @desc    Get all jobs (with filters, search, pagination)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      jobType,
      locationType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    const query = { isActive: true };

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (locationType) query.locationType = locationType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (minSalary) query['salary.min'] = { $gte: Number(minSalary) };
    if (maxSalary) query['salary.max'] = { $lte: Number(maxSalary) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email company')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company avatar');

    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only count view if not the job owner and not already viewed in this session
    // We use a simple IP + jobId check to avoid counting refreshes
    const viewerIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const isOwner = req.headers.authorization &&
      job.postedBy?._id?.toString() === req.user?._id?.toString();

    if (!isOwner) {
      await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
      job.views += 1; // reflect in response
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (recruiter, admin)
export const createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const job = await Job.create({
      ...req.body,
      postedBy: req.user._id,
      company: req.body.company || {
        name: req.user.company?.name,
        logo: req.user.company?.logo?.url,
        website: req.user.company?.website,
      },
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (owner recruiter or admin)
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete (deactivate) a job
// @route   DELETE /api/jobs/:id
// @access  Private (owner recruiter or admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    job.isActive = false;
    await job.save();

    res.status(200).json({ success: true, message: 'Job removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in recruiter
// @route   GET /api/jobs/my-jobs
// @access  Private (recruiter)
export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort('-createdAt');
    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};
