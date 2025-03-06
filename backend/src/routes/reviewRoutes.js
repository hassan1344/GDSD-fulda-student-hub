import express from "express";
import * as reviewService from "../services/reviewService.js";
import { authenticateStudent } from "../middlewares/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", authenticateStudent, reviewService.addReview);
reviewRouter.get(
  "/application/:applicationId",
  authenticateStudent,
  reviewService.getStudentReviews
);

reviewRouter.get(
  "/:listingId",
  // authenticateStudent,
  reviewService.getAllReviewsForALandlord
);

export default reviewRouter;
