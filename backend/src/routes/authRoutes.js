import express from 'express';
import {registerUser, loginUser, getNewAccessToken, logoutUser} from '../services/authService.js';
import {generateToken, verifyToken} from '../utils/jwtUtils.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);

authRouter.post('/login', loginUser);

authRouter.post('/refresh-token', getNewAccessToken);

authRouter.post('/logout', logoutUser);

export default authRouter;