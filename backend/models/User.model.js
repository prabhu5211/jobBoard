import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
    },
    avatar: {
      public_id: { type: String },
      url: { type: String, default: '' },
    },
    // Candidate-specific fields
    resume: {
      public_id: { type: String },
      url: { type: String },
    },
    skills: [{ type: String, trim: true }],
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    location: { type: String, trim: true },
    experience: { type: Number, default: 0 }, // years
    // Recruiter-specific fields
    company: {
      name: { type: String, trim: true },
      website: { type: String, trim: true },
      logo: {
        public_id: { type: String },
        url: { type: String },
      },
      description: { type: String },
    },
    // Account status
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
