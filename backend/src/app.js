import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

// import { ResHandler } from "./utils/custom-response/response-handler.js";
import propertyRouter from "./routes/propertyRoutes.js";
import authRouter from "./routes/authRoutes.js";
import profileRouter from './routes/profileRoutes.js';
import { applicationRoutes } from "./routes/applicationRoutes.js";
import propertyModuleRouter from "./routes/propertyModuleRoutes.js";
import utilRouter from "./routes/utilRoutes.js";
import searchListingRouter from "./routes/searchListingRoute.js";
import listingModuleRouter from "./routes/listingModuleRoutes.js";
import biddingRouter from "./routes/biddingRoutes.js";
import nearestServicesRouter from "./routes/nearestServicesRoutes.js";

//Calendar
import calendarRouter from "./routes/calendarRoutes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.get("/", (req, res) => {
  return res.send("Service is available...");
});

app.use("/v1/properties", propertyRouter);

app.use("/v1/auth", authRouter);

app.use("/v1/application", applicationRoutes);

app.use("/v1/profile", profileRouter);

app.use("/v1/propertiesModule", propertyModuleRouter);

app.use("/v1/utils", utilRouter);
app.use("/v1/searchListing", searchListingRouter);
app.use("/v1/listingsModule", listingModuleRouter);
app.use("/v1/bidding", biddingRouter);
app.use("/v1/services", nearestServicesRouter);

// app.use(ResHandler);

//Calendar
app.use("/v1/calendar", calendarRouter);

export { app };
