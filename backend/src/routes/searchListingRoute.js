import express from "express";
import * as searchListingService from "../services/searchListingService.js";
import { authenticate } from "../middlewares/auth.js";

const searchListingRouter = express.Router();

searchListingRouter.get("/", searchListingService.getAllListings); // GET all Listings
searchListingRouter.post("/search", 
    // authenticate,
    searchListingService.getListingsByIds); // Get multiple listings by IDs

export default searchListingRouter;

