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

app.use("/api/v1/properties", propertyRouter);

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/application", applicationRoutes);

app.use("/api/v1/profile", profileRouter);

app.use("/api/v1/propertiesModule", propertyModuleRouter);

// app.use(ResHandler);

export { app };
