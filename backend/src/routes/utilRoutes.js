import express from "express";
import * as utilService from "../services/utilService.js";

const utilRouter = express.Router();

utilRouter.get("/amenities", utilService.getAllAmenities); // GET all amenities
utilRouter.get("/amenities/:id", utilService.getAmenityById); // GET a single amenity by ID

utilRouter.get("/roomtypes", utilService.getAllRoomTypes); // GET all amenities
utilRouter.get("/roomtypes/:id", utilService.getRoomTypeById); // GET a single amenity by ID

export default utilRouter;

