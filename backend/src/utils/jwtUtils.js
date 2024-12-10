import jwt from 'jsonwebtoken';

export const generateToken = (payload, secret, options) => jwt.sign(payload, secret, options);

export const verifyToken = (token, secret) => jwt.verify(token, secret);
