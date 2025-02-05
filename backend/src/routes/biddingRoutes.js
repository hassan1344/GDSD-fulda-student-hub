import express from "express";
import { getBiddingStatus, getAllActiveBiddings } from "../services/biddingService.js";
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

export default biddingRouter;