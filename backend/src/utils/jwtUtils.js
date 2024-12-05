import jwt from 'jsonwebtoken';

const JWT_SECRET = "your_jwt_secret"; // Use a secure key in production
const JWT_EXPIRY = "1h"; // Adjust as needed

export const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
