import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";
import bcrypt from "bcrypt";

/**
 * User login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate JWT token
    const userData = user.toJSON();
    delete userData.password; // Don't include password in token
    
    const token = generateToken({ user: userData });
    
    // Log token for debugging
    console.log("Generated token:", token);
    console.log("User logged in:", userData);

    return res.status(200).send({
      data: { 
        user: userData,
        access_token: token 
      },
      message: "Successfully logged in",
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Failed to login" });
  }
};

/**
 * User registration
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).send({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userData = newUser.toJSON();
    delete userData.password;

    return res.status(201).send({
      data: userData,
      message: "User registered successfully",
    });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ error: "Failed to register user" });
  }
};

/**
 * Get current user info
 */
const init = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    
    const userData = user.toJSON();
    delete userData.password;
    
    res.status(200).send({ 
      data: userData, 
      message: "Successfully fetched current user" 
    });
  } catch (e) {
    console.error("Init error:", e);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

export const authController = {
  login,
  register,
  init,
};