require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

exports.createUser = async (email, name, password) => {
  await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: password,
    },
  });
};

exports.getUser = async (colName, query) => {
  const key = { [colName]: query };
  const user = await prisma.user.findUnique({
    where: key,
  });
  return user;
};

exports.getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
};

exports.getChatsByUserId = async (userId) => {
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      messages: true,
      users: true,
    },
  });
  return chats;
};

exports.addFriend = async (userId, friendName) => {
  const friend = await prisma.user.findUnique({
    where: { name: friendName },
  });
  if (!friend) {
    throw new Error("Friend not found");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        connect: { id: friend.id },
      },
    },
  });
};

exports.removeFriend = async (userId, friendName) => {
  const friend = await prisma.user.findUnique({
    where: { name: friendName },
  });
  if (!friend) {
    throw new Error("Friend not found");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        disconnect: { id: friend.id },
      },
    },
  });
};

exports.listFriends = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { friends: true },
  });
  return user.friends;
};

exports.createChat = async (userIds) => {
  const newChat = await prisma.chat.create({
    data: {
      users: {
        connect: userIds.map((id) => ({ id: id })),
      },
    },
  });
  return newChat;
};

exports.getChatById = async (chatId) => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: true,
      users: true,
    },
  });
  return chat;
};

exports.createMessage = async (chatId, senderId, content) => {
  const newMessage = await prisma.message.create({
    data: {
      chatId: chatId,
      senderId: senderId,
      content: content,
    },
  });
  return newMessage;
};

exports.editMessage = async (messageId, content) => {
  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { content: content },
  });
  return updatedMessage;
};

exports.deleteMessage = async (messageId) => {
  await prisma.message.delete({
    where: { id: messageId },
  });
};
