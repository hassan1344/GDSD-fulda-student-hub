import express from "express";
import * as nearestServices from "../services/nearestServicesService.js";

const router = express.Router();

router.get("/nearest-services", nearestServices.getNearestServices);

export default router;
