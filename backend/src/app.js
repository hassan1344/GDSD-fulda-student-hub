import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import { ResHandler } from "./utils/custom-response/response-handler.js";

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

app.use(ResHandler);

export { app };
