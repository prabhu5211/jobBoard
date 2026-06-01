import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import User from '../models/User.model.js';

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (candidate)
export const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, message: 'Job not found or no longer active' });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Fetch full user to get their saved resume
    const candidate = await User.findById(req.user._id);
    const resumeUrl = candidate?.resume?.url;
    const resumePublicId = candidate?.resume?.public_id;

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: {
        public_id: resumePublicId || '',
        url: resumeUrl || '',
      },
      coverLetter: req.body.coverLetter || '',
    });

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a job (recruiter view)
// @route   GET /api/applications/job/:jobId
// @access  Private (recruiter, admin)
export const getApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar skills experience location resume')
      .sort('-createdAt');

    // Merge applicant resume into application resume if application resume is empty
    const enriched = applications.map((app) => {
      const a = app.toObject();
      if (!a.resume?.url && a.applicant?.resume?.url) {
        a.resume = a.applicant.resume;
      }
      return a;
    });

    res.status(200).json({ success: true, count: enriched.length, applications: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in candidate
// @route   GET /api/applications/my-applications
// @access  Private (candidate)
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary isActive')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (recruiter)
// @route   PUT /api/applications/:id/status
// @access  Private (recruiter, admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (
      application.job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

// Add status validation before mutation
    const VALID_STATUSES = ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    application.statusHistory.push({ status: application.status, note });
    application.status = status;
    application.isRead = true;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw an application (candidate)
// @route   DELETE /api/applications/:id
// @access  Private (candidate)
export const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['offered', 'rejected'].includes(application.status)) {
      return res.status(400).json({ success: false, message: 'Cannot withdraw a finalized application' });
    }

    application.status = 'withdrawn';
    await application.save();

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });

    res.status(200).json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    next(error);
  }
};
