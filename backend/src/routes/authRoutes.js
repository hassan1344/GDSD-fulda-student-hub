import express from 'express';
import {registerUser, loginUser} from '../services/authService.js';
import {generateToken, verifyToken} from '../utils/jwtUtils.js';

const router = express.Router();

router.post('/register', async(req, res) => {
  try {
    console.log(req.body)
    const { 
      userName,
      email, 
      password
    } = req.body;
    const { user: userType } = req.query;
    await registerUser({userName, password, email, userType});
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async(req, res) => {
  try {
    const { userName, password } = req.body;
    const token = await loginUser(userName, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.post('/refresh-token', async(req, res) => {
  try {
    const { refreshToken } = req.body;
    const payload = verifyToken(refreshToken);
    const newToken = generateToken({ userName: payload.userName },
      "access",
      "15m"
    );
    res.json({ token: newToken });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post('/logout', async(req, res) => {
  res.status(200).json({ message: "Logged out successfully" });

});

export const authRoutes = router;
