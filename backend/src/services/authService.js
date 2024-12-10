import { createUser, loginUserHelper } from './userService.js';
import {verifyToken, generateToken} from '../utils/jwtUtils.js';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  try {
    const { 
      userName,
      email, 
      password
    } = req.body;
    const { user: userType } = req.query;
    await createUser({userName, password, email, userType});
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const tokens = await loginUserHelper(userName, password);
    await setRefreshToken(userName, tokens.refreshToken);
    res.json({ tokens });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getNewAccessToken = async (req, res) => {
  try {
    const { refreshToken, userName } = req.body;
    const fetchedRefreshToken = await getRefreshToken(userName);
    if(refreshToken !== fetchedRefreshToken) {
      throw new Error('Invalid Token');
    }
    const payload = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const newToken = generateToken(
      { userName: payload.userName, email: payload.email, userType: payload.userType },
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    );
    res.json({ accessToken: newToken });
  } catch(error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { userName } = req.body;
    await deleteRefreshToken(userName);
    res.status(200).json({ message: "Logged out successfully" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}

const setRefreshToken = async (userName, refreshToken) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { user_name: userName },
      data: { refresh_token: refreshToken },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error setting refresh token:', error);
    throw new Error('Could not set refresh token');
  }
};

const deleteRefreshToken = async (userName) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { user_name: userName },
      data: { refresh_token: null },
    });
    return updatedUser;
  } catch (error) {
    console.error('Error deleting refresh token:', error);
    throw new Error('Could not delete refresh token');
  }
};

export const getRefreshToken = async (userName) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_name: userName },
      select: { refresh_token: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.refresh_token;
  } catch (error) {
    console.error('Error fetching refresh token:', error);
    throw new Error('Could not fetch refresh token');
  }
};
