const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secretKey = 'your_secret_key';

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

function validateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Token is required');
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
}

async function sendLoginEmail(user) {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const token = generateToken(user);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Login to Gadget Vault',
        text: `Click the link to login: http://localhost:3000/login?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { generateToken, validateToken, sendLoginEmail };
