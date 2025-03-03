const express = require('express');
const router = express.Router();
const { generateToken } = require('./auth');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Replace this with your actual user authentication logic
    if (username === 'admin' && password === 'password') {
        const user = { id: 1, username: 'admin' };
        const token = generateToken(user);
        return res.json({ token });
    }
    return res.status(401).send('Invalid credentials');
});

module.exports = router;
