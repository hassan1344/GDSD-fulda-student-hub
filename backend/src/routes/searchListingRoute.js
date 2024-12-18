import express from "express";
import * as searchListingService from "../services/searchListingService.js";

const searchListingRouter = express.Router();

searchListingRouter.get("/", searchListingService.getAllListings); // GET all Listings
searchListingRouter.get("/search/:id", searchListingService.getListingById); // GET a single Listing by ID

export default searchListingRouter;

