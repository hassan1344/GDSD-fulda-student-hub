import express from "express";
import { getBiddingStatus, getAllActiveBiddings, getUserBiddingSessions, getLandlordBiddingSessions } from "../services/biddingService.js";
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

biddingRouter.get(
  "/landlord-biddings",
  authenticate,
  getLandlordBiddingSessions
);
export default biddingRouter;