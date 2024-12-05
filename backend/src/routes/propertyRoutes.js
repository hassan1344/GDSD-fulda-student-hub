import express from "express";
import * as propertyService from "../services/propertyService.js";

const propertyRouter = express.Router();

propertyRouter.get("/", propertyService.getAllProperties);
propertyRouter.get("/:id", propertyService.getPropertyById);

export default propertyRouter;
