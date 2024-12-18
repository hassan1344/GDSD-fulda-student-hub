import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";
import { createChat, createConversation } from "./socketController.js";

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

      socket.on("createConversation", async (data) => {
        console.log("======> data from client", data);

        const conversation = await createConversation(socket, data);

        console.log("conversationn ==>", conversation);
        if (conversation) {
          socket.join(conversation.conversationId);
        }
        socket.emit("createConversation", conversation);
      });

      socket.on("sendMessage", async (data) => {
        if (data) {
          await createChat(data);
          io.to(data.conversation).emit("sendMessage", {
            message: data.message,
            sender_id: data.senderId,
            createdAt: data.created_at,
          });
        }
      });

      socket.on("disconnect", () => {
        console.log(`A client has disconnected : ${socket.id}`);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};
