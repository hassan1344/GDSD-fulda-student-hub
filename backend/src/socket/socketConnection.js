import { Server } from "socket.io";
import { authenticateSocket } from "../middlewares/auth.js";
import {
  createChat,
  createConversation,
  getChats,
  getConversations,
  createBiddingSession,
  findActiveBiddingSession,
  updateBiddingSession,
  saveBid,
  getBidsForSession,
} from "./socketController.js";

export const initiateSocket = (server) => {
  try {
    const connectedUsers = {}, biddingRooms = {};
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
      if(socket.handshake.query?.endpoint === 'chat') {
        if (userName) {
          socket.join(userName);
          connectedUsers[userName] = socket.id;
        }
      }
      console.log(`User ${userName} joined room ${userName}`);
      console.log(`A client has connected : ${socket.id}`);

      socket.on("createConversation", async (data) => {
        // console.log("======> data from client", data);

        const result = await createConversation(socket, data);
        // console.log("Result", result);

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
        // console.log(socket.decoded, "decoded");

        io.to(socket.decoded.userName).emit("getChats", chats);
      });

      socket.on("disconnect", () => {
        if (userName && connectedUsers[userName] === socket.id) {
          delete connectedUsers[userName];
        }
        console.log(`A client has disconnected : ${socket.id}`);
      });

      // 1. Start Bidding
    socket.on('startBidding', async ({ listingId, startingPrice, endsAt }) => {
      try {
        if(socket.decoded?.userType !== 'LANDLORD') {
          socket.emit('error', 'Only Landlord can start bidding');
          return;
        }
        const existingSession = await findActiveBiddingSession(listingId);
        if (existingSession) {
          socket.emit('error', 'Bidding already started for this listing.');
          return;
        }

        const session = await createBiddingSession(listingId, startingPrice, endsAt);
        const roomId = session.session_id;
        biddingRooms[roomId] = { listingId, bids: [], isActive: true };

        socket.join(roomId);
        console.log(`Bidding started for room: ${roomId}, listing: ${listingId}`);
        io.to(roomId).emit('biddingStarted', { roomId, listingId, startingPrice, endsAt });
      } catch (error) {
        console.error('Error starting bidding:', error.message);
        socket.emit('error', 'Failed to start bidding.');
      }
    });

    // 2. Join Bidding
    socket.on('joinBidding', async ({ listingId }, callback) => {
      try {
        // console.log("first");
        const session = await findActiveBiddingSession(listingId);
        if (!session) {
          return callback({ error: 'Bidding session not found.' }); 
        }
        const roomId = session.session_id;
        biddingRooms[roomId] = { listingId, bids: [], isActive: true };
        if (biddingRooms[roomId]?.isActive) {
          socket.join(roomId);
          console.log(`User ${userName} joined bidding for room: ${roomId}`);
          const bids = await getBidsForSession(roomId);

          socket.emit('joinedBidding', { roomId, listingId: session.listing_id, bids: bids});
          callback({ roomId, listingId: session.listing_id, bids: bids });
        } else {
          socket.emit('error', 'Bidding is not active for this room.');
          callback({ error: 'Bidding is not active for this room.' });
        }
      } catch (error) {
        console.error('Error joining bidding:', error.message);
        socket.emit('error', 'Failed to join bidding.');
        callback({ error: 'Failed to join bidding.' });
      }
    });

    // 3. Place Bid
    socket.on('placeBid', async ({ listingId, amount }) => {
      try {
        if(socket.decoded?.userType !== 'STUDENT') {
          socket.emit('error', 'Only Students can place bids');
          return;
        }
        const session = await findActiveBiddingSession(listingId);
        if (!session) {
          socket.emit('error', 'Bidding session not found.');
          return;
        }
        const roomId = session.session_id;
        if (biddingRooms[roomId]?.isActive) { 
          if (amount <= Math.max(session.highest_bid, session.starting_price)) {
            socket.emit('error', 'Bid amount must be higher than the current highest bid.');
            return;
          }

          const bid = await saveBid(session.session_id, userName, amount);
          await updateBiddingSession(session.session_id, {
            highest_bid: amount,
            highest_bidder: userName,
          });

          biddingRooms[roomId].bids.push({ userName, amount, timestamp: new Date().toISOString() });
          console.log(`New bid placed by ${userName} in room: ${roomId}`, bid);


          const bids = await getBidsForSession(roomId);
          io.to(roomId).emit('updateBids', { roomId, bids: bids });
        } else {
          socket.emit('error', 'Bidding is not active or room does not exist.');
        }
      } catch (error) {
        console.error('Error placing bid:', error.message);
        socket.emit('error', 'Failed to place bid.');
      }
    });

    // 4. Leave Bidding
    socket.on('leaveBidding', async ({ listingId }) => {
      const session = await findActiveBiddingSession(listingId);
      if (!session) {
        socket.emit('error', 'Bidding session not found.');
        return;
      }
      const roomId = session.session_id;
      socket.leave(roomId);
      console.log(`User ${userName} left bidding for room: ${roomId}`);
      const bids = await getBidsForSession(roomId);
      socket.to(roomId).emit('userLeft', { userName, bids:bids });
    });

    // 5. End Bidding
    socket.on('endBidding', async ({ listingId }) => {
      try {
        if(socket.decoded?.userType !== 'LANDLORD') {
          socket.emit('error', 'Only Landlord can end bidding');
          return;
        }
        const session = await findActiveBiddingSession(listingId);
        if (!session) {
          socket.emit('error', 'Bidding session not found.');
          return;
        }
        const roomId = session.session_id;
        if (biddingRooms[roomId]?.isActive) {
          const bids = biddingRooms[roomId].bids;
          const winner = bids.length
            ? bids.reduce((max, bid) => (bid.amount > max.amount ? bid : max))
            : null;

          await updateBiddingSession(session.session_id, {
            status: 'ended',
            highest_bid: winner?.amount || 0,
            highest_bidder: winner?.userName || null,
          });

          biddingRooms[roomId].isActive = false;
          console.log(`Bidding ended for room: ${roomId}. Winner:`, winner);

          io.to(roomId).emit('biddingEnded', { roomId, winner });
        } else {
          socket.emit('error', 'Bidding is not active or room does not exist.');
        }
      } catch (error) {
        console.error('Error ending bidding:', error.message);
        socket.emit('error', 'Failed to end bidding.');
      }
    });
    });
    
  } catch (error) {
    console.log(error.message);
  }
};
