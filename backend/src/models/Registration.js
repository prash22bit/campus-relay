const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
      maxlength: [100, 'College name cannot exceed 100 characters'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['CSE', 'IT', 'AI & Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'],
    },
    gradYear: {
      type: String,
      required: [true, 'Graduation year is required'],
      enum: ['2025', '2026', '2027', '2028', 'Other'],
    },
    // The invite code that was used to refer this person (optional)
    usedReferralCode: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    // This person's own personal invite code
    personalCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    // Attribution: how did they come in?
    source: {
      type: String,
      enum: ['direct', 'campus-captain', 'club-community', 'peer-referral', 'social-outreach'],
      default: 'direct',
    },
    // Captain-specific: who is the campus captain that owns this code?
    captainCode: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    // How many people this person has referred (count)
    referralCount: {
      type: Number,
      default: 0,
    },
    // Verified / attending
    attended: {
      type: Boolean,
      default: false,
    },
    // IP for basic dedup guard (not stored precisely for privacy)
    ipHash: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Indexes
registrationSchema.index({ usedReferralCode: 1 });
registrationSchema.index({ source: 1 });
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', registrationSchema);
