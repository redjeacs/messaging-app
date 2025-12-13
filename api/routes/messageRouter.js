const { Router } = require("express");
const messageController = require("../controllers/messageController");
const verifyToken = require("../middlewares/Verifytoken");

const messageRouter = Router();

messageRouter.get("/:id", verifyToken, messageController.getChat);
messageRouter.post("/", verifyToken, messageController.createMessage);
messageRouter.put("/:id", verifyToken, messageController.editMessage);
messageRouter.delete("/:id", verifyToken, messageController.deleteMessage);

module.exports = messageRouter;
