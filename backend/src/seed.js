require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Captain = require('./models/Captain');
const Registration = require('./models/Registration');

const SEED_CAPTAINS = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.cbit@gmail.com',
    college: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    whatsapp: '+91 98765 43210',
    captainCode: 'CC-CBIT01',
    registrationCount: 28,
    target: 35,
    notes: 'Technical Club Lead, 3rd year CSE',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.vnr@gmail.com',
    college: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    whatsapp: '+91 98450 12345',
    captainCode: 'CC-VNR02',
    registrationCount: 34,
    target: 40,
    notes: 'GDSC Core Member, IT Department',
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.vasavi@gmail.com',
    college: 'Vasavi College of Engineering',
    whatsapp: '+91 97112 34567',
    captainCode: 'CC-VAS03',
    registrationCount: 22,
    target: 30,
    notes: 'Placement Coordinator, ECE',
  },
  {
    name: 'Pooja Iyer',
    email: 'pooja.jntu@gmail.com',
    college: 'JNTU College of Engineering Hyderabad',
    whatsapp: '+91 99887 65432',
    captainCode: 'CC-JNTU04',
    registrationCount: 31,
    target: 40,
    notes: 'Coding Club President, CSE',
  },
  {
    name: 'Karthik Varma',
    email: 'karthik.ou@gmail.com',
    college: 'University College of Engineering, Osmania University',
    whatsapp: '+91 91234 56789',
    captainCode: 'CC-OU05',
    registrationCount: 19,
    target: 25,
    notes: 'Open Source Community Organizer, AI & DS',
  },
  {
    name: 'Divya Nair',
    email: 'divya.griet@gmail.com',
    college: 'Gokaraju Rangaraju Institute of Engineering and Technology',
    whatsapp: '+91 93456 78901',
    captainCode: 'CC-GRIET06',
    registrationCount: 24,
    target: 30,
    notes: 'IEEE Student Branch Chair, 3rd year CSE',
  },
];

const COLLEGES = [
  'Chaitanya Bharathi Institute of Technology (CBIT)',
  'VNR Vignana Jyothi Institute of Engineering and Technology',
  'Vasavi College of Engineering',
  'JNTU College of Engineering Hyderabad',
  'University College of Engineering, Osmania University',
  'Gokaraju Rangaraju Institute of Engineering and Technology',
  'BVRIT Hyderabad College of Engineering for Women',
  'CVR College of Engineering',
];

const BRANCHES = ['CSE', 'IT', 'AI & Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other'];
const GRAD_YEARS = ['2025', '2026', '2027', '2028'];

const FIRST_NAMES = [
  'Rohan', 'Ananya', 'Aditya', 'Rhea', 'Kunal', 'Meera', 'Arjun', 'Tanvi', 'Siddharth', 'Ishita',
  'Nikhil', 'Priyanka', 'Dev', 'Shreya', 'Kabir', 'Anushka', 'Varun', 'Neha', 'Gautam', 'Kavya',
  'Harsh', 'Tara', 'Rishi', 'Sakshi', 'Manish', 'Bhavna', 'Abhishek', 'Swati', 'Pranav', 'Deepa',
  'Yash', 'Ritu', 'Sahil', 'Anjali', 'Karan', 'Pooja', 'Aakash', 'Simran', 'Rahul', 'Nisha'
];

const LAST_NAMES = [
  'Patel', 'Rao', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Choudhury', 'Reddy', 'Menon', 'Joshi',
  'Sharma', 'Kapoor', 'Bose', 'Deshmukh', 'Bhat', 'Mehta', 'Nambiar', 'Das', 'Pandey', 'Saxena'
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_relay';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({ username: 'admin', password: 'campusrelay2024', role: 'admin' });
      console.log('✅ Admin created (username: admin, password: campusrelay2024)');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // 2. Seed Captains
    for (const cap of SEED_CAPTAINS) {
      await Captain.findOneAndUpdate(
        { captainCode: cap.captainCode },
        cap,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${SEED_CAPTAINS.length} Campus Captains`);

    // 3. Seed sample registrations if empty or low
    const existingCount = await Registration.countDocuments();
    if (existingCount < 20) {
      console.log('🌱 Seeding realistic registrations across last 7 days...');
      const sampleRegs = [];
      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;

      // Generate ~150 registrations across 7 days
      let studentCounter = 100;
      for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        // Daily progression: grows from 12/day up to ~35/day
        const countThisDay = 12 + (6 - dayOffset) * 4 + Math.floor(Math.random() * 5);
        for (let i = 0; i < countThisDay; i++) {
          studentCounter++;
          const fname = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
          const lname = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
          const college = COLLEGES[Math.floor(Math.random() * COLLEGES.length)];
          const branch = BRANCHES[Math.floor(Math.random() * (BRANCHES.length - 2))]; // biased towards tech
          const gradYear = GRAD_YEARS[Math.floor(Math.random() * GRAD_YEARS.length)];

          // Pick source
          const rand = Math.random();
          let source = 'direct';
          let captainCode = '';
          let usedReferralCode = '';

          if (rand < 0.50) {
            source = 'campus-captain';
            const randomCap = SEED_CAPTAINS[Math.floor(Math.random() * SEED_CAPTAINS.length)];
            captainCode = randomCap.captainCode;
            usedReferralCode = captainCode;
          } else if (rand < 0.75) {
            source = 'peer-referral';
            usedReferralCode = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
          } else {
            source = 'direct';
          }

          const personalCode = `CR-${studentCounter.toString().padStart(4, '0')}`;
          const createdAt = new Date(now - dayOffset * DAY + (i * 35 * 60 * 1000) % (DAY - 10000));

          sampleRegs.push({
            name: `${fname} ${lname}`,
            email: `${fname.toLowerCase()}.${lname.toLowerCase()}${studentCounter}@gmail.com`,
            college,
            branch,
            gradYear,
            usedReferralCode,
            personalCode,
            source,
            captainCode,
            referralCount: Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0,
            attended: dayOffset > 2 ? Math.random() > 0.4 : false,
            createdAt,
          });
        }
      }

      await Registration.insertMany(sampleRegs);
      console.log(`✅ Seeded ${sampleRegs.length} realistic student registrations!`);
    } else {
      console.log(`ℹ️ Database already has ${existingCount} registrations.`);
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
