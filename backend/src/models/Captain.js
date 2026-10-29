const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const captainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    // Unique captain invite code (e.g. CC-XY12Z)
    captainCode: {
      type: String,
      unique: true,
      uppercase: true,
      required: true,
    },
    // How many confirmed registrations came through this captain
    registrationCount: {
      type: Number,
      default: 0,
    },
    // Target registrations for this captain (default 10)
    target: {
      type: Number,
      default: 10,
    },
    active: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Captain', captainSchema);
