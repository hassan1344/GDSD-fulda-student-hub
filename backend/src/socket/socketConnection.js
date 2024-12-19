import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";
import {
  createChat,
  createConversation,
  getChats,
  getConversations,
} from "./socketController.js";

export const initiateSocket = (server) => {
  try {
    const io = new Server(server, {
      cors: {
        // origin: config.CLIENT_URL,
        origin: "*",
      },
    });
    io.of("/wsapp").use((socket, next) => {
      authenticateSocket(socket, next);
    }).on("connection", (socket) => {
      const userName = socket.decoded?.userName;
      if (userName) {
        socket.join(userName);
        console.log(`User ${userName} joined room ${userName}`);
      }
      console.log(`A client has connected : ${socket.id}`);

      socket.on("createConversation", async (data) => {
        // console.log("======> data from client", data);

        const conversation = await createConversation(socket, data);

        // console.log("conversationn ==>", conversation);
        if (conversation) {
          socket.join(conversation.conversation.conversation_id);
        }
        socket.emit("createConversation", conversation);
      });

      socket.on("sendMessage", async (data) => {
        if (data) {
          await createChat(data);
          io.emit("sendMessage", {
            message: data.message,
            sender_id: data.sender_id,
            createdAt: data.created_at,
            conversation_id: data.conversation_id,
          });
          io.emit("updatedLastMessage", data.message);
        }
      });

      // Fetch all conversations for a user
      socket.on("getConversations", async () => {
        const conversations = await getConversations(socket);

        // Emit the fetched conversations back to the client
        socket.emit("getConversations", conversations);
      });

      // Fetch all chats in a conversation
      socket.on("getChats", async (data) => {
        const chats = await getChats(socket, data);
        console.log(socket.decoded, "decoded");
        // Emit the fetched chats back to the client
        io.to(socket.decoded.userName).emit("getChats", chats);
      });

      socket.on("disconnect", () => {
        console.log(`A client has disconnected : ${socket.id}`);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};
