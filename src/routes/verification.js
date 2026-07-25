const { verifyEmail, resendVerificationCode } = require("../controllers/authController");

/**
 * Handles POST /verify-email.
 * Framework-agnostic: takes a plain { email, code } body, returns a plain
 * { status, body } result. The Next.js route handler (app/api/verify-email)
 * wraps this in a NextResponse.
 */
async function handleVerifyEmail(body) {
  const { email, code } = body || {};

  try {
    const user = await verifyEmail({ email, code });
    return { status: 200, body: { success: true, user } };
  } catch (err) {
    return { status: 400, body: { error: err.message } };
  }
}

/**
 * Handles POST /verify-email/resend.
 */
async function handleResendCode(body) {
  const { email } = body || {};

  try {
    await resendVerificationCode({ email });
    return { status: 200, body: { success: true } };
  } catch (err) {
    return { status: 400, body: { error: err.message } };
  }
}

module.exports = { handleVerifyEmail, handleResendCode };
