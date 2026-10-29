const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Registration = require('../models/Registration');
const Captain = require('../models/Captain');
const { protect } = require('../middleware/auth');
const { generateCaptainCode } = require('../utils/codeGen');

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required.' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({
      success: true,
      token,
      admin: { username: admin.username, role: admin.role },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Protected routes below ───────────────────────────────────────────────────

// GET /api/admin/dashboard — aggregate stats
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [
      totalRegs,
      bySource,
      byBranch,
      byGradYear,
      captains,
      recentRegs,
      collegesCount,
    ] = await Promise.all([
      Registration.countDocuments(),
      Registration.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$branch', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Registration.aggregate([
        { $group: { _id: '$gradYear', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Captain.find({ active: true }).sort({ registrationCount: -1 }),
      Registration.find().sort({ createdAt: -1 }).limit(10).select('name college branch source createdAt'),
      Registration.distinct('college').then((c) => c.length),
    ]);

    // Daily registrations for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyData = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const referralCount = bySource.find((s) => s._id === 'peer-referral')?.count || 0;
    const captainCount = bySource.find((s) => s._id === 'campus-captain')?.count || 0;

    return res.json({
      success: true,
      data: {
        totalRegistrations: totalRegs,
        goal: 500,
        progressPct: Math.min(100, Math.round((totalRegs / 500) * 100)),
        referralCount,
        captainAttributed: captainCount,
        collegesCount,
        activeCaptains: captains.length,
        bySource,
        byBranch,
        byGradYear,
        topCaptains: captains.slice(0, 10),
        recentRegistrations: recentRegs,
        dailyRegistrations: dailyData,
        budgetCostPerReg: totalRegs > 0 ? (2000 / totalRegs).toFixed(2) : 'N/A',
        targetChannelMix: [
          { channel: 'Campus Captains', target: 250, pct: 50 },
          { channel: 'Clubs & Placement Cells', target: 100, pct: 20 },
          { channel: 'Peer Referral Loop', target: 100, pct: 20 },
          { channel: 'Owned Social & Direct', target: 50, pct: 10 },
        ],
      },
    });
  } catch (err) {
    console.error('[Dashboard Error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/admin/registrations — paginated list with filters
router.get('/registrations', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const source = req.query.source;
    const branch = req.query.branch;
    const search = req.query.search;

    const filter = {};
    if (source) filter.source = source;
    if (branch) filter.branch = branch;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, registrations] = await Promise.all([
      Registration.countDocuments(filter),
      Registration.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-ipHash'),
    ]);

    return res.json({
      success: true,
      data: { registrations, total, page, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/admin/export — CSV export
router.get('/export', protect, async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 }).select('-ipHash -__v');
    const cols = ['name', 'email', 'college', 'branch', 'gradYear', 'source', 'personalCode', 'usedReferralCode', 'captainCode', 'referralCount', 'attended', 'createdAt'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [cols.join(','), ...registrations.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="campus-relay-registrations.csv"');
    return res.send('\uFEFF' + csv); // BOM for Excel compatibility
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Export failed.' });
  }
});

// ─── Captain management ───────────────────────────────────────────────────────

// GET /api/admin/captains
router.get('/captains', protect, async (req, res) => {
  try {
    const captains = await Captain.find().sort({ registrationCount: -1 });
    return res.json({ success: true, data: captains });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/captains — add a new captain
router.post('/captains', protect, async (req, res) => {
  const { name, email, college, whatsapp, target, notes } = req.body;
  if (!name || !email || !college) {
    return res.status(400).json({ success: false, message: 'Name, email, and college required.' });
  }

  try {
    let captainCode;
    let attempts = 0;
    do {
      captainCode = generateCaptainCode();
      attempts++;
    } while ((await Captain.findOne({ captainCode })) && attempts < 10);

    const captain = await Captain.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      college: college.trim(),
      whatsapp: whatsapp?.trim() || '',
      captainCode,
      target: parseInt(target) || 10,
      notes: notes?.trim() || '',
    });

    return res.status(201).json({ success: true, data: captain });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Captain email already exists.' });
    }
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE /api/admin/captains/:id
router.delete('/captains/:id', protect, async (req, res) => {
  try {
    await Captain.findByIdAndUpdate(req.params.id, { active: false });
    return res.json({ success: true, message: 'Captain deactivated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// POST /api/admin/seed — create initial admin (run once)
router.post('/seed', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Admin already seeded.' });
    }
    await Admin.create({ username: 'admin', password: 'campusrelay2024', role: 'admin' });
    return res.json({ success: true, message: 'Admin created. username: admin, password: campusrelay2024' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
