import express from "express";
import { createMeeting, getLandlordMeetings, cancelMeeting, getScheduledMeetings } from "../services/calendarController.js";
import { authenticateLandlord, authenticateStudent } from "../middlewares/auth.js";

//-----------
import { getStudents } from "../services/calendarController.js";


const router = express.Router();

// Create a new meeting
router.post("/schedule", authenticateLandlord, createMeeting);

// Get all meetings for a landlord
router.get("/landlord/:landlord_id", authenticateLandlord, getLandlordMeetings);

// Cancel a meeting
router.delete("/cancel/:meeting_id", authenticateLandlord, cancelMeeting);

//--------- Get all students
router.get("/students", authenticateLandlord, getStudents);

router.get("/scheduledMeetings", authenticateStudent, getScheduledMeetings);

router.get("/scheduledMeetingsForLandlord", authenticateLandlord, getScheduledMeetings);

export default router;
