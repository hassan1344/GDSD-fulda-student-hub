import logger from "./utils/logger.js";
import { app } from "./app.js";
import { initiateSocket } from "./socket/socketConnection.js";
import http from "http";

import serverConfig from "./config/serverConfig.js";

const httpServer = http.createServer(app).listen(serverConfig.PORT, () => {
  logger.info(`Server listening at Port ${serverConfig.PORT}`);
});

initiateSocket(httpServer);
