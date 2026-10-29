const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a registration confirmation email.
 * Only works if SMTP credentials are configured.
 */
const sendConfirmationEmail = async ({ to, name, personalCode, inviteUrl }) => {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com') {
    console.log(`[Email skip] No SMTP configured. Would have sent to: ${to}`);
    return;
  }

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f6f7fb; padding: 24px; border-radius: 16px;">
      <div style="background: #0b1020; border-radius: 12px; padding: 32px; color: #fff; margin-bottom: 20px;">
        <div style="font-size: 13px; letter-spacing: .16em; font-weight: 800; color: #c7ff5e; text-transform: uppercase; margin-bottom: 8px;">Campus Relay</div>
        <h1 style="font-size: 26px; margin: 0 0 12px; letter-spacing: -.04em;">You're registered! 🎉</h1>
        <p style="color: #b9c2d6; line-height: 1.65; margin: 0;">Hi ${name}, your seat is saved for <strong style="color:#fff">Build Your First AI Project in 60 Minutes</strong> — a free, hands-on workshop.</p>
      </div>

      <div style="background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #e0e5ef;">
        <h3 style="margin: 0 0 12px; font-size: 16px; color: #101426;">Your personal invite code</h3>
        <div style="background: #f2fae3; border: 2px dashed #abc978; border-radius: 10px; padding: 16px; text-align: center; font-size: 22px; font-weight: 900; letter-spacing: .1em; color: #34431f;">${personalCode}</div>
        <p style="font-size: 12px; color: #667087; margin: 12px 0 16px; line-height: 1.6;">Share this link with classmates who would benefit. Each successful invite you make strengthens the community.</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #0b1020; color: #c7ff5e; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 800; font-size: 13px;">Copy invite link ↗</a>
      </div>

      <p style="font-size: 10px; color: #8b93a6; line-height: 1.5; margin: 0;">This is a prototype confirmation. Workshop date, venue and project deliverables will be confirmed by the organizer. Do not forward this to unintended recipients.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Campus Relay" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
    to,
    subject: `You're registered! Your invite code: ${personalCode}`,
    html,
  });
};

module.exports = { sendConfirmationEmail };
