import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    skills: [{ type: String, trim: true }],
    company: {
      name: { type: String, required: true, trim: true },
      logo: { type: String },
      website: { type: String },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    locationType: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      required: [true, 'Job type is required'],
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      required: [true, 'Experience level is required'],
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
      period: { type: String, enum: ['hourly', 'monthly', 'yearly'], default: 'yearly' },
      isVisible: { type: Boolean, default: true },
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      trim: true,
    },
    deadline: { type: Date },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', 'company.name': 'text', skills: 'text' });
jobSchema.index({ category: 1, jobType: 1, locationType: 1, experienceLevel: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);
export default Job;
