import express from "express";
import { createMeeting, getLandlordMeetings, cancelMeeting } from "../services/calendarController.js";
import { authenticateLandlord } from "../middlewares/auth.js";

const router = express.Router();

// Create a new meeting
router.post("/schedule", authenticateLandlord, createMeeting);

// Get all meetings for a landlord
router.get("/landlord/:landlord_id", authenticateLandlord, getLandlordMeetings);

// Cancel a meeting
router.delete("/cancel/:meeting_id", authenticateLandlord, cancelMeeting);



export default router;
