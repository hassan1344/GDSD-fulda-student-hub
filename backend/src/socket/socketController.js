import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createConversation = async (socket, payload) => {
  try {
    const { receiver_id } = payload;
    const { userName: sender_id } = socket.decoded;

    console.log("senderrrid ", sender_id, receiver_id);

    // if (sender_id === receiver_id) return null;
    let createConversation;

    // validate convo existence

    createConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { AND: [{ sender_id }, { receiver_id }] }, // Case 1: sender -> receiver
          { AND: [{ sender_id: receiver_id }, { receiver_id: sender_id }] }, // Case 2: swapped sender and receiver
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (!createConversation) {
      createConversation = await prisma.conversation.create({
        data: {
          sender_id,
          receiver_id,
        },
        include: {
          sender: true,
          receiver: true,
        },
      });
    }

    const data = {
      conversation: createConversation,
    };

    console.log("*****************************", data);
    return data;
  } catch (error) {
    return error.message;
  }
};

export const createChat = async (payload) => {
  try {
    const { sender_id, message, conversation_id, created_at } = payload;

    await prisma.chat.create({
      data: {
        sender_id,
        message,
        conversation_id,
        created_at,
      },
    });

    await prisma.conversation.update({
      where: { conversation_id },
      data: {
        last_message: message,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getConversations = async (socket) => {
  try {
    const { userName } = socket.decoded;
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ sender_id: userName }, { receiver_id: userName }],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    const processedConversations = conversations.map((conversation) => {
      const isSender = conversation.sender_id === userName;

      return {
        ...conversation,
        user: isSender ? conversation.receiver : conversation.sender,
      };
    });
    console.log("processed onversationssss", processedConversations);
    return processedConversations;
  } catch (error) {
    console.error("Error fetching conversations:", error.message);
  }
};

export const getChats = async (socket, payload) => {
  try {
    const { conversation_id } = payload;
    const { userName } = socket.decoded;
    const conversations = await prisma.conversation.findMany({
      where: {
        // conversation_id: conversation_id,
        OR: [{ sender_id: userName }, { receiver_id: userName }],
      },
    });
    if (conversations.length === 0) {
      throw new Error("Chat inaccessible");
    }
    const chats = await prisma.chat.findMany({
      where: {
        conversation_id: conversation_id,
      },
      orderBy: {
        created_at: "asc", // Sort messages by creation time
      },
    });
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error.message);
  }
};
