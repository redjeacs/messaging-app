const { Router } = require("express");
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/Verifytoken");

const userRouter = Router();

userRouter.get("/", verifyToken, userController.getUserProfile);
userRouter.get("/chats", verifyToken, userController.getUserChats);
userRouter.post("/friends/:friendEmail", verifyToken, userController.addFriend);
userRouter.delete(
  "/friends/:friendName",
  verifyToken,
  userController.removeFriend
);
userRouter.get("/friends", verifyToken, userController.listFriends);

module.exports = userRouter;
