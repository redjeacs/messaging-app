const { Router } = require("express");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middlewares/Verifytoken");

const messageRouter = Router();

messageRouter.post("/", verifyToken, messageController.createChat);
messageRouter.get("/:chatId", verifyToken, messageController.getChat);
messageRouter.post("/:chatId", verifyToken, messageController.createMessage);
messageRouter.put("/:messageId", verifyToken, messageController.editMessage);
messageRouter.delete(
  "/:messageId",
  verifyToken,
  messageController.deleteMessage
);

module.exports = messageRouter;
