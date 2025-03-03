import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
}

export function validateToken(req, res, next) {
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
