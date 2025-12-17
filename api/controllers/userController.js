const db = require("../db/queries");
const cloudinary = require("../utils/cloudinary");

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    return next(err);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = {};
    const { name, email, profile } = req.body;

    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;

    const updatedUser = await db.updateUserProfile(userId, data);
    if (!updatedUser)
      return res.status(404).json({ message: "User update failed" });
    res.status(200).json({ user: updatedUser, message: "Profile updated" });
  } catch (err) {
    return next(err);
  }
};

exports.updateProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_images",
      width: 500,
      height: 500,
      crop: "fill",
    });
    const updatedUser = await db.updateUserProfile(userId, {
      profile: result.secure_url,
    });
    if (!updatedUser)
      return res.status(404).json({ message: "Profile image update failed" });
    res
      .status(200)
      .json({ user: updatedUser, message: "Profile image updated" });
  } catch (err) {
    return next(err);
  }
};

exports.getUserChats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const chats = await db.getChatsByUserId(userId);
    res.status(200).json(chats);
  } catch (err) {
    return next(err);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendEmail = req.params.friendEmail;
    await db.addFriend(userId, friendEmail);
    res.status(200).json({ message: "Friend added" });
  } catch (err) {
    return next(err);
  }
};

exports.removeFriend = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friendName = req.params.friendName;
    await db.removeFriend(userId, friendName);
    res.status(200).json({ message: "Friend removed" });
  } catch (err) {
    return next(err);
  }
};

exports.listFriends = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const friends = await db.listFriends(userId);
    res.status(200).json(friends);
  } catch (err) {
    return next(err);
  }
};
