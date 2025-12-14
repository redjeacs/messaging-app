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

exports.addFriend = async (userId, friendEmail) => {
  const friend = await prisma.user.findUnique({
    where: { email: friendEmail },
  });
  if (!friend) {
    throw new Error("Email not found");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        connect: { id: friend.id },
      },
    },
  });
  const possibleChats = await prisma.chat.findMany({
    where: {
      users: {
        every: {
          id: { in: [userId, friend.id] },
        },
      },
    },
  });

  const existingChat = possibleChats.find((chat) => {
    chat.users.length === 2 &&
      chat.users.some((u) => u.id === userId) &&
      chat.users.some((u) => u.id === friend.id);
  });

  if (!existingChat) {
    await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: userId }, { id: friend.id }],
        },
      },
    });
  }
};

exports.removeFriend = async (userId, friendEmail) => {
  const friend = await prisma.user.findUnique({
    where: { email: friendEmail },
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
      messages: { include: { sender: true } },
      users: true,
    },
  });
  return chat;
};

exports.createMessage = async (chatId, senderId, message) => {
  const newMessage = await prisma.message.create({
    data: {
      chatId: chatId,
      senderId: senderId,
      message: message,
    },
  });
  return newMessage;
};

exports.editMessage = async (messageId, message) => {
  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { message: message },
  });
  return updatedMessage;
};

exports.deleteMessage = async (messageId) => {
  await prisma.message.delete({
    where: { id: messageId },
  });
};
