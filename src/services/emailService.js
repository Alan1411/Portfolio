const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { ZOHO_SMTP_USER, ZOHO_SMTP_PASS } = process.env;

  if (!ZOHO_SMTP_USER || !ZOHO_SMTP_PASS) {
    throw new Error("Missing ZOHO_SMTP_USER or ZOHO_SMTP_PASS environment variables");
  }

  transporter = nodemailer.createTransport({
    host: "smtp.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: ZOHO_SMTP_USER,
      pass: ZOHO_SMTP_PASS,
    },
  });

  return transporter;
}

/**
 * Sends a 6-digit email verification code to the given address.
 * Never log `code` or any credentials.
 */
async function sendVerificationCode(email, code) {
  const transport = getTransporter();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Verify your email</h2>
      <p>Hi there,</p>
      <p>Use the code below to verify your email address:</p>
      <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; background: #f1f5f9; padding: 16px; border-radius: 8px;">
        ${code}
      </p>
      <p>This code is valid for <strong>15 minutes</strong>.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  const text = `Dein Verifizierungscode:\n\n${code}\n\nDer Code ist 15 Minuten gültig.`;

  try {
    const info = await transport.sendMail({
      from: `"Alan1411 Portfolio" <${process.env.ZOHO_SMTP_USER}>`,
      to: email,
      subject: "Your verification code",
      text,
      html,
    });
    console.log("[EMAIL] sent:", info.messageId);
  } catch (err) {
    console.error("[EMAIL] send failed:", err.message, err.code, err.response);
    throw err;
  }
}

module.exports = { sendVerificationCode };
