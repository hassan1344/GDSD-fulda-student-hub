import { createLandlordUser, loginLandlordUser } from './userService.js';

export const registerUser = async (userData) => {
  return createLandlordUser(userData);
};

export const loginUser = async (userName, password) => {
  return loginLandlordUser(userName, password);
};
