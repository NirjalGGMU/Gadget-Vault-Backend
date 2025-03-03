








// module.exports = router;});    res.send('This is a protected route');router.post('/protected-route', validateToken, (req, res) => {const router = express.Router();const { validateToken } = require('./auth');const express = require('express');