const { Router } = require("express");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/Verifytoken");

const authRouter = Router();

authRouter.get("/", verifyToken, authController.checkSignin);
authRouter.post("/signup", authController.createUser);
authRouter.post("/signin", authController.signin);

module.exports = authRouter;
