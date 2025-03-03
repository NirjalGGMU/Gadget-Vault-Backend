import express from 'express';
import passport from 'passport';
import { generateToken } from '../../utils/auth.js';
import { sendLoginEmail } from '../../auth.js';
import User from '../../models/User.js';

const router = express.Router();

// Google OAuth login route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:3000?token=${token}`);
});

router.post('/login-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await sendLoginEmail(user);
        res.status(200).json({ message: 'Login email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
