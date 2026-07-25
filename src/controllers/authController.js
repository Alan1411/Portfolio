const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
const { generateVerificationCode, getExpiryTimestamp } = require("../utils/codeGenerator");
const { sendVerificationCode } = require("../services/emailService");

const MAX_VERIFICATION_ATTEMPTS = 5;
const SALT_ROUNDS = 12;

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
}

/**
 * Registers a new user: hashes the password, stores the user with
 * emailVerified = false, generates a 6-digit code, and emails it.
 * Throws on duplicate email or validation failure.
 */
async function registerUser({ email, password, fullName }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const verificationCode = generateVerificationCode();
  const verificationExpires = getExpiryTimestamp(15);

  const { count } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });
  const role = !count ? "admin" : "user";

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: email.toLowerCase(),
      full_name: fullName || null,
      password_hash: passwordHash,
      role,
      email_verified: false,
      verification_code: verificationCode,
      verification_expires: verificationExpires,
      verification_attempts: 0,
    })
    .select("id, email, full_name, role")
    .single();

  if (error) throw new Error(error.message);

  try {
    await sendVerificationCode(user.email, verificationCode);
  } catch (emailErr) {
    // Roll back the insert so the user can retry registration cleanly
    // instead of being stuck on "account already exists" with no code.
    await supabase.from("users").delete().eq("id", user.id);
    throw new Error("Failed to send verification email. Please try again.");
  }

  return user;
}

/**
 * Verifies a user's email against a submitted 6-digit code.
 * Enforces expiry, single-use, and a max attempt count.
 */
async function verifyEmail({ email, code }) {
  if (!email || !code) {
    throw new Error("Email and code are required");
  }

  const supabase = getSupabase();

  const { data: user } = await supabase
    .from("users")
    .select("id, email_verified, verification_code, verification_expires, verification_attempts")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) {
    throw new Error("Invalid email or code");
  }

  if (user.email_verified) {
    throw new Error("Email is already verified");
  }

  if (!user.verification_code || !user.verification_expires) {
    throw new Error("No verification code found. Please request a new one");
  }

  if (user.verification_attempts >= MAX_VERIFICATION_ATTEMPTS) {
    throw new Error("Too many failed attempts. Please request a new code");
  }

  if (new Date(user.verification_expires).getTime() < Date.now()) {
    throw new Error("Verification code has expired. Please request a new one");
  }

  if (user.verification_code !== String(code).trim()) {
    await supabase
      .from("users")
      .update({ verification_attempts: user.verification_attempts + 1 })
      .eq("id", user.id);

    throw new Error("Incorrect verification code");
  }

  const { data: updated, error } = await supabase
    .from("users")
    .update({
      email_verified: true,
      verification_code: null,
      verification_expires: null,
      verification_attempts: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("id, email, full_name, role")
    .single();

  if (error) throw new Error(error.message);

  return updated;
}

/**
 * Authenticates a user by email + password. Rejects unverified accounts.
 */
async function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const supabase = getSupabase();

  const { data: user } = await supabase
    .from("users")
    .select("id, email, full_name, role, password_hash, email_verified")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  if (!user.email_verified) {
    throw new Error("Please verify your email before logging in");
  }

  return { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
}

/**
 * Generates and sends a fresh verification code for an unverified account.
 */
async function resendVerificationCode({ email }) {
  if (!email) throw new Error("Email is required");

  const supabase = getSupabase();

  const { data: user } = await supabase
    .from("users")
    .select("id, email_verified")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!user) throw new Error("No account found with this email");
  if (user.email_verified) throw new Error("Email is already verified");

  const verificationCode = generateVerificationCode();
  const verificationExpires = getExpiryTimestamp(15);

  await supabase
    .from("users")
    .update({
      verification_code: verificationCode,
      verification_expires: verificationExpires,
      verification_attempts: 0,
    })
    .eq("id", user.id);

  await sendVerificationCode(email.toLowerCase(), verificationCode);
}

module.exports = { registerUser, verifyEmail, loginUser, resendVerificationCode };
