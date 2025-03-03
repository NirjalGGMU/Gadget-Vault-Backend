import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Public routes that don't require authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register'
];

/**
 * Middleware to verify JWT token
 */
export function authenticateToken(req, res, next) {
  // Skip token verification for public routes
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  // Get token from Authorization header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : null;

  if (!token) {
    return res.status(401).send({ 
      message: "Access denied. No token provided." 
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(403).send({ 
      message: "Invalid or expired token." 
    });
  }
}