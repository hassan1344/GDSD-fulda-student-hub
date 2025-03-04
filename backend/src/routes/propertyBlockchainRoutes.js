// propertyBlockchainRoutes.js
import express from "express";
import {
  createPropertyBlockchainConfig,
  updatePropertyBlockchainConfig,
  deletePropertyBlockchainConfig,
  getBlockchainConfigByPropertyId,
  getWalletByPropertyId,
  getWalletByListingId
} from "../services/propertyBlockchainService.js";
import {authenticateLandlord, authenticateStudent } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authenticateLandlord, createPropertyBlockchainConfig);
router.put("/:id" ,authenticateLandlord, updatePropertyBlockchainConfig);
router.delete("/:id",authenticateLandlord, deletePropertyBlockchainConfig);
router.get("/property/:property_id", authenticateLandlord, getBlockchainConfigByPropertyId);
router.get("/wallet/:property_id", authenticateLandlord, getWalletByPropertyId);
router.get("/wallet-by-listing/:listing_id", authenticateStudent, getWalletByListingId);


// IMPORTANT: must have a default export
export default router;
