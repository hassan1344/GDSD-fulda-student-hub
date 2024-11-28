import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import { ResHandler } from "./utils/custom-response/response-handler.js";
import { propertyRoutes } from "./routes/properties.js";

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

const v1Router = express.Router();

v1Router.use("/properties", propertyRoutes);

app.use("/v1", v1Router); //api already appended in nginx conf for deployment

app.use(ResHandler);

export { app };
