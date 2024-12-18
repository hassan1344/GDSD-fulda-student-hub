import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createConversation = async (socket, payload) => {
  try {
    const { receiver_id } = payload;
    const { userName: sender_id } = socket.decoded;

    console.log(sender_id, receiver_id);

    let createConversation;
    let messages;

    // validate convo existence
    createConversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { AND: [{ sender_id }, { receiver_id }] },
          { AND: [{ sender_id }, { receiver_id }] },
        ],
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    // if exists, get the msgs
    if (createConversation) {
      messages = await prisma.chat.findMany({
        where: { conversation_id: createConversation.conversation_id },
      });
    } else {
      // if doesnot create new
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
      messages,
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
