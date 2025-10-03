// passwordService.js
// A single responsibility module for hashing and verifying passwords

const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
module.exports.hashPassword = async (password) => {
  if (!password) {
    throw new Error("Password is required for hashing.");
  }
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a plain text password against a hash
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The hashed password from DB
 * @returns {Promise<boolean>} - True if match, false otherwise
 */
module.exports.verifyPassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) {
    throw new Error(
      "Password and hashed password are required for verification."
    );
  }
  return await bcrypt.compare(password, hashedPassword);
};
