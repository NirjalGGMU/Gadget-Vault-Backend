import { User } from '../../models/index.js';
import bcrypt from 'bcrypt';

/**
 * Get all users
 */
const getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Exclude password from results
        });
        res.status(200).send({ 
            data: users, 
            message: "Successfully fetched users" 
        });
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Create new user
 */
const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validation
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
            password: hashedPassword
        });
        
        // Remove password from response
        const userData = newUser.toJSON();
        delete userData.password;
        
        res.status(201).send({ 
            data: userData, 
            message: "Successfully created user" 
        });
    } catch (e) {
        console.error("Error creating user:", e);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

/**
 * Update existing user
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        // Update user data
        if (name) user.name = name;
        if (email) user.email = email;
        
        // If password is provided, hash it
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        await user.save();
        
        // Remove password from response
        const userData = user.toJSON();
        delete userData.password;
        
        res.status(200).send({ 
            data: userData, 
            message: "User updated successfully" 
        });
    } catch (e) {
        console.error("Error updating user:", e);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

/**
 * Delete user
 */
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        await user.destroy();
        res.status(200).send({ message: "User deleted successfully" });
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

/**
 * Get user by ID
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] } // Exclude password
        });
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        
        res.status(200).send({ 
            data: user, 
            message: "User fetched successfully" 
        });
    } catch (e) {
        console.error("Error fetching user:", e);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const userController = {
    getAll,
    create,
    update,
    deleteById,
    getById
};