const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Registration = require('../models/Registration');
const Captain = require('../models/Captain');
const { generateStudentCode } = require('../utils/codeGen');
const { sendConfirmationEmail } = require('../utils/mailer');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('college').trim().notEmpty().withMessage('College is required').isLength({ max: 100 }),
  body('branch').isIn(['CSE', 'IT', 'AI & Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']).withMessage('Invalid branch'),
  body('gradYear').isIn(['2025', '2026', '2027', '2028', 'Other']).withMessage('Invalid graduation year'),
  body('referralCode').optional().trim().toUpperCase(),
];

// POST /api/register
router.post('/', registerValidation, async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, college, branch, gradYear, referralCode } = req.body;

  try {
    // Deduplication by email
    const existing = await Registration.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
        personalCode: existing.personalCode,
      });
    }

    // Determine source and resolve referral
    let source = 'direct';
    let usedReferralCode = '';
    let captainCode = '';

    if (referralCode) {
      const upperCode = referralCode.trim().toUpperCase();

      // Check if it's a campus captain code (CC-)
      if (upperCode.startsWith('CC-')) {
        const captain = await Captain.findOne({ captainCode: upperCode, active: true });
        if (captain) {
          source = 'campus-captain';
          captainCode = upperCode;
          // Increment captain's registration count
          await Captain.findByIdAndUpdate(captain._id, { $inc: { registrationCount: 1 } });
        }
      } else if (upperCode.startsWith('CR-')) {
        // Peer referral code
        const referrer = await Registration.findOne({ personalCode: upperCode });
        if (referrer) {
          source = 'peer-referral';
          usedReferralCode = upperCode;
          // Increment referrer's count
          await Registration.findByIdAndUpdate(referrer._id, { $inc: { referralCount: 1 } });
        }
      }
    }

    // Generate a unique personal code
    let personalCode;
    let attempts = 0;
    do {
      personalCode = generateStudentCode();
      attempts++;
    } while ((await Registration.findOne({ personalCode })) && attempts < 10);

    // Create registration
    const reg = await Registration.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      college: college.trim(),
      branch,
      gradYear,
      usedReferralCode,
      personalCode,
      source,
      captainCode,
    });

    // Send confirmation email (non-blocking)
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const inviteUrl = `${baseUrl}/?ref=${personalCode}`;
    sendConfirmationEmail({ to: reg.email, name: reg.name, personalCode, inviteUrl }).catch(
      (err) => console.error('[Email error]', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        personalCode: reg.personalCode,
        name: reg.name,
        source: reg.source,
        inviteUrl,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    console.error('[Register Error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/register/validate-code/:code — check if a referral code is valid
router.get('/validate-code/:code', async (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  try {
    if (code.startsWith('CC-')) {
      const captain = await Captain.findOne({ captainCode: code, active: true });
      return res.json({ valid: !!captain, type: 'captain' });
    } else if (code.startsWith('CR-')) {
      const reg = await Registration.findOne({ personalCode: code });
      return res.json({ valid: !!reg, type: 'student' });
    }
    return res.json({ valid: false, type: 'unknown' });
  } catch (err) {
    return res.status(500).json({ valid: false, message: 'Error validating code.' });
  }
});

module.exports = router;
