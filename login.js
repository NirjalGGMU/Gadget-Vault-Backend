const express = require('express');
const { generateToken } = require('./gadget-vault-backend/auth');
const router = express.Router();

// ...existing code...

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Validate user credentials (this is just an example, implement your own logic)
    if (username === 'user' && password === 'password') {
        const token = generateToken({ id: 1, username });
        return res.json({ token });
    }
    return res.status(401).send('Invalid credentials');
});

// ...existing code...

module.exports = router;
