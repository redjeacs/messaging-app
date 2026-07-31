require("dotenv").config();
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const { query } = require("express-validator");

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

exports.updateUserProfile = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: data,
  });

  return updatedUser;
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
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { friends: true, friendsOf: true },
  });

  if (currentUser.email === friendEmail) {
    throw new Error("You cannot add yourself as a friend");
  }

  const friend = await prisma.user.findUnique({
    where: { email: friendEmail },
  });

  if (!friend) {
    throw new Error("Email not found");
  }

  const isAlreadyFriend = currentUser.friends.some((f) => f.id === friend.id);

  if (!isAlreadyFriend) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: { connect: { id: friend.id } },
        friendsOf: { connect: { id: friend.id } },
      },
    });
  }

  const chats =
    (await prisma.chat.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId } } },
          { users: { some: { id: friend.id } } },
        ],
      },
      include: {
        users: {
          select: { id: true },
        },
      },
    })) || [];

  let existingChat = chats.find((chat) => chat.users.length === 2);

  console.log("test", chats);

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

exports.getMessage = async (query, value) => {
  const key = { [query]: value };
  const message = await prisma.message.findUnique({
    where: key,
  });
  return message;
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

exports.deleteMessage = async (userId, messageId) => {
  await prisma.message.delete({
    where: { id: messageId, senderId: userId },
  });
};
