import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient();
import { generateToken } from "../utils/jwtUtils.js";

export const createUser = async ({
  userName,
  email,
  password,
  userType,
}) => {
  // Check if the phone number or email is already registered
  const existingUser = await prismaClient.user.findFirst({
    where: {
      OR: [{ email }, { user_name: userName }],
    },
  });

  if (existingUser) {
    throw new Error("A user with this email or username already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new User record in the database
  const newUser = await prismaClient.user.create({
    data: {
      user_name: userName,
      email,
      password: hashedPassword,
      user_type: userType,
    },
  });

  // // Create a new Landlord record associated with the newly created User
  // const newLandlord = await prismaClient.landlord.create({
  //   data: {
  //     user_id: newUser.user_name,
  //     trust_score: 0, // Default value
  //   },
  // });

  return { user: newUser };
};

export const loginUserHelper = async (userName, password) => {
  const user = await prismaClient.user.findUnique({
    where: { user_name: userName },
  });
  console.log(process.env.ACCESS_TOKEN_SECRET)

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials.");
  }

  const accessToken = generateToken(
    { userName: user.user_name, email: user.email, userType: user.user_type },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
  );

  // Generate refresh token
  const refreshToken = generateToken(
    { userName: user.user_name, email: user.email, userType: user.user_type },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
  );

  return {
    accessToken,
    refreshToken,
  };
};
