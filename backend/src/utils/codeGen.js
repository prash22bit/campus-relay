const { customAlphabet } = require('nanoid');

// Safe alphabet — no ambiguous characters (0, O, I, 1)
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const nanoid5 = customAlphabet(alphabet, 5);

/**
 * Generate a student personal invite code: CR-XXXXX
 */
const generateStudentCode = () => `CR-${nanoid5()}`;

/**
 * Generate a campus captain code: CC-XXXXX
 */
const generateCaptainCode = () => `CC-${nanoid5()}`;

module.exports = { generateStudentCode, generateCaptainCode };
