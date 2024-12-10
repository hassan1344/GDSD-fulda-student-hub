import express from "express";
import * as applicationService from "../services/applicationService.js";
import { authenticateStudent } from "../middlewares/auth.js";

const applicationRouter = express.Router();

applicationRouter.post(
  "/create-application",
  authenticateStudent,
  applicationService.createApplication
);

applicationRouter.get(
  "/get-all-applications",
  authenticateStudent,
  applicationService.getAllApplications
);

applicationRouter.get(
  "/get-application-by-id/:id",
  authenticateStudent,
  applicationService.getApplicationById
);

applicationRouter.put(
  "/update-application-by-id/:id",
  authenticateStudent,
  applicationService.updateApplicationById
);

applicationRouter.delete(
  "/delete-application-by-id",
  authenticateStudent,
  applicationService.deleteApplicationById
);

export const applicationRoutes = applicationRouter;
