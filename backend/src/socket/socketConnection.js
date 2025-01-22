import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";
import {
  createChat,
  createConversation,
  getChats,
  getConversations,
  placeBid,
  endBidding,
} from "./socketController.js";

export const initiateSocket = (server) => {
  try {
    const connectedUsers = {};
    const io = new Server(server, {
      cors: {
        // origin: config.CLIENT_URL,
        origin: "*",
        methods: ["GET", "POST"],
        transports: ["polling", "websocket"],
      },
    });
    io.use((socket, next) => {
      authenticateSocket(socket, next);
    }).on("connection", (socket) => {
      const userName = socket.decoded?.userName;
      if (userName) {
        socket.join(userName);
        connectedUsers[userName] = socket.id;
        console.log(`User ${userName} joined room ${userName}`);
      }
      console.log(`A client has connected : ${socket.id}`);

      socket.on("createConversation", async (data) => {
        // console.log("======> data from client", data);

        const result = await createConversation(socket, data);
        console.log("Result", result);

        const conversation = result?.conversation;

        if (conversation) {
          socket.join(conversation.conversation_id);
          socket.emit("createConversation", conversation);
          const receiverId = conversation.receiver_id;
          const receiverSocketId = connectedUsers[receiverId];
          if (receiverSocketId) {
            // Send the new conversation event to the receiver
            io.to(receiverSocketId).emit("newConversation", conversation);
          }
        } else {
          socket.emit("createConversation", null);
        }
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

      socket.on("getConversations", async () => {
        const conversations = await getConversations(socket);

        socket.emit("getConversations", conversations);
      });

      // Fetch all chats in a conversation
      socket.on("getChats", async (data) => {
        const chats = await getChats(socket, data);
        console.log(socket.decoded, "decoded");

        io.to(socket.decoded.userName).emit("getChats", chats);
      });

      socket.on("placeBid", async (data) => {
        // data : sessionId, amount
        const bid = await placeBid(data);

        io.to(data.sessionId).emit("updateBids", {
          sessionId: bid.sessionId,
          highestBid: bid.highestBid,
          highestBidder: bid.highestBidder,
        });
      });

      socket.on("endBidding", async (data) => {
        //data : sessionId
        const endBid = await endBidding(data);

        io.to(data.sessionId).emit("biddingEnded", {
          sessionId: endBid.sessionId,
          highestBid: endBid.highestBid,
          highestBidder: endBid.highestBidder,
        });
      });

      socket.on("disconnect", () => {
        if (userName && connectedUsers[userName] === socket.id) {
          delete connectedUsers[userName];
        }
        console.log(`A client has disconnected : ${socket.id}`);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};
