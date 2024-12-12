import express from "express";
import {createProfile, deleteProfile, getProfile, updateProfile} from "../services/profileService.js";
import { authenticate } from "../middlewares/auth.js";

const profileRouter = express.Router();

profileRouter.post(
  "/",
  authenticate,
  createProfile
);

profileRouter.get(
  "/:id",
  authenticate,
  getProfile
);

profileRouter.patch(
  "/",
  authenticate,
  updateProfile
);

profileRouter.delete(
  "/",
  authenticate,
  deleteProfile
);

export default profileRouter;
