const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const CustomNotFoundError = require("../middlewares/CustomNotFoundError");
const validators = require("../middlewares/Validators");

exports.getChat = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await db.getChatById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (err) {
    return next(err);
  }
};

exports.createMessage = [
  validators.messageValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const data = matchedData(req);
      if (!data)
        throw new CustomNotFoundError(
          "provided message information is invalid"
        );
      const newMessage = await db.createMessage(
        req.body.chatId,
        req.body.senderId,
        req.body.content
      );
      res.status(201).json({ message: "Message created", newMessage });
    } catch (err) {
      return next(err);
    }
  },
];

exports.editMessage = [
  validators.messageValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const messageId = req.params.id;
      const data = matchedData(req);
      if (!data)
        throw new CustomNotFoundError(
          "provided message information is invalid"
        );
      const updatedMessage = await db.editMessage(messageId, req.body.content);
      res.status(200).json({ message: "Message updated", updatedMessage });
    } catch (err) {
      return next(err);
    }
  },
];

exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    await db.deleteMessage(messageId);
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    return next(err);
  }
};
