import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Generate JWT token
 * @param {Object} payload - Data to be included in the token
 * @returns {string} JWT token
 */
const generateToken = (payload) => {
  const options = {
    expiresIn: '24h', // Token expires in 24 hours
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

export {
  generateToken,
  verifyToken,
};