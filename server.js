import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './database/index.js';
import userRoutes from './routes/user/userRoute.js';
import authRoutes from './routes/auth/authRoute.js';
import fileRoutes from './routes/file/uploadRoute.js';
import googleAuthRoutes from './routes/auth/googleAuthRoute.js';
import emailAuthRoutes from './routes/auth/authRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/passport.js'; // Import Passport configuration

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize()); // Initialize Passport

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/auth', googleAuthRoutes); // Add this line for Google OAuth routes
app.use('/api/auth', emailAuthRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
