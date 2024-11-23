import logger from "./utils/logger.js";
import { app } from "./app.js";
import http from "http";

import serverConfig from "./config/serverConfig.js";

http.createServer(app).listen(serverConfig.PORT, () => {
  logger.info(`Server listening at Port ${serverConfig.PORT}`);
});
