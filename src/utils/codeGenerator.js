const crypto = require("crypto");

/**
 * Generates a cryptographically secure random 6-digit verification code.
 * Always returns a 6-character string, e.g. "048392" (zero-padded).
 */
function generateVerificationCode() {
  const code = crypto.randomInt(0, 1000000);
  return code.toString().padStart(6, "0");
}

/**
 * Returns an ISO timestamp `minutes` from now, used as the code's expiry.
 */
function getExpiryTimestamp(minutes = 15) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

module.exports = { generateVerificationCode, getExpiryTimestamp };
