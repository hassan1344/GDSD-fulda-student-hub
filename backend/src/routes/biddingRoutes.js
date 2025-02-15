import express from "express";
import { getBiddingStatus, getAllActiveBiddings, getUserBiddingSessions } from "../services/biddingService.js";
import { authenticate } from "../middlewares/auth.js";

const biddingRouter = express.Router();

biddingRouter.get(
  "/status",
  authenticate,
  getBiddingStatus
);

biddingRouter.get(
  "/active-biddings",
  authenticate,
  getAllActiveBiddings
);

biddingRouter.get(
  "/user-biddings",
  authenticate,
  getUserBiddingSessions
);

export default biddingRouter;