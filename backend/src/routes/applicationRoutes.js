import express from "express";
import * as applicationService from "../services/applicationService.js";
import { authenticateLandlord, authenticateStudent } from "../middlewares/auth.js";
import { handleMultiPartData } from "../utils/handleMultiPart.js";
import {generateLeaseAgreement} from '../services/leaseService.js';

const applicationRouter = express.Router();

applicationRouter.post(
  "/create-application",
  authenticateStudent,
  handleMultiPartData.fields([
    { name: "government_id", maxCount: 1 },
    { name: "enrolment_certificate", maxCount: 1 },
    { name: "financial_proof", maxCount: 1 },
    { name: "other_documents", maxCount: 10 },
  ]),
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

applicationRouter.post(
  "/generate-lease/",
  authenticateLandlord,
  handleMultiPartData.fields([
    { name: "landlord_signature", maxCount: 1 },
  ]),
  generateLeaseAgreement
);

// applicationRouter.put(
//   "/update-application-by-id/:id",
//   authenticateStudent,
//   applicationService.updateApplicationById
// );

applicationRouter.delete(
  "/delete-application-by-id/:id",
  authenticateStudent,
  applicationService.deleteApplicationById
);

export const applicationRoutes = applicationRouter;
