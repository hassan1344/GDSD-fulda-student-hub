import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import { ResHandler } from "./utils/custom-response/response-handler.js";
import propertyRouter from "./routes/propertyRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";

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

app.use("/v1/auth", authRoutes);

app.use("/api/v1/application", applicationRoutes);

// app.use(ResHandler);

export { app };
