import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";

export const initiateSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        // origin: config.CLIENT_URL,
        origin: "*",
      },
    });
    io.use((socket, next) => {
      authenticateSocket(socket, next);
    }).on("connection", (socket) => {
      console.log(`A client has connected : ${socket.id}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
