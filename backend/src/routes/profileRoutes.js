import express from "express";
import {createProfile, deleteProfile, getProfile, updateProfile} from "../services/profileService.js";
import { authenticate } from "../middlewares/auth.js";
import { handleMultiPartData } from "../utils/handleMultiPart.js";

const profileRouter = express.Router();

profileRouter.post(
  "/",
  authenticate,
  handleMultiPartData.fields([
    { name: "profile_pic", maxCount: 1 },
  ]),
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
  handleMultiPartData.fields([
    { name: "profile_pic", maxCount: 1 },
  ]),
  updateProfile
);

profileRouter.delete(
  "/",
  authenticate,
  deleteProfile
);

export default profileRouter;
