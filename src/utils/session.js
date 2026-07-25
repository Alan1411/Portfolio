const { SignJWT, jwtVerify } = require("jose");

const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET environment variable");
  return new TextEncoder().encode(secret);
}

/**
 * Signs a session JWT for the given user. Works in both Node.js and
 * Edge runtimes (jose uses Web Crypto, not Node's `crypto` module).
 */
async function createSessionToken(user) {
  return new SignJWT({ email: user.email, role: user.role, full_name: user.full_name || null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

/**
 * Verifies a session JWT. Returns the payload or null if invalid/expired.
 */
async function verifySessionToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

module.exports = { createSessionToken, verifySessionToken, SESSION_COOKIE, SESSION_MAX_AGE };
