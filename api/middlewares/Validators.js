const { body } = require("express-validator");
const db = require("../db/queries");

const emptyMsg = "is required";
const length = "should be between 1 and 50 characters";

exports.signupValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("username " + emptyMsg)
    .isLength({ min: 1, max: 50 })
    .withMessage("email " + length)
    .isEmail()
    .withMessage("email is not valid")
    .custom(async (value) => {
      const user = await db.getUser("email", value);
      if (user) throw new Error("Email already exists");
      else return true;
    }),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name " + emptyMsg)
    .isLength({ min: 1, max: 50 })
    .withMessage("name " + length)
    .isAlpha()
    .withMessage("name must be alphabetic characters only"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password " + emptyMsg)
    .isLength({ min: 1, max: 50 })
    .withMessage("username " + length),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("password confirmation " + emptyMsg)
    .custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match");
      else return true;
    }),
];

exports.signinValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email " + emptyMsg)
    .isLength({ min: 1, max: 50 })
    .withMessage("email " + length)
    .isEmail()
    .withMessage("email is not valid"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password " + emptyMsg)
    .isLength({ min: 1, max: 50 })
    .withMessage("username " + length),
];

exports.chatValidator = [
  body("name")
    .trim()
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("name " + length),
  body("userIds")
    .isArray({ min: 2 })
    .withMessage("userIds must be an array with at least two user IDs")
    .custom(async (value) => {
      for (const id of value) {
        const user = await db.getUser("id", id);
        if (!user) throw new Error(`User with ID ${id} does not exist`);
      }
      return true;
    }),
];

exports.messageValidator = [
  body("chatId")
    .trim()
    .notEmpty()
    .withMessage("chatId " + emptyMsg)
    .custom(async (value) => {
      const chat = await db.getChatById(value);
      if (!chat) throw new Error("Chat does not exist");
      else return true;
    }),
  body("senderId")
    .trim()
    .notEmpty()
    .withMessage("senderId " + emptyMsg)
    .custom(async (value) => {
      const user = await db.getUser("id", value);
      if (!user) throw new Error("Sender does not exist");
      else return true;
    }),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message " + emptyMsg)
    .isLength({ min: 1, max: 500 })
    .withMessage("Message should be between 1 and 500 characters"),
];
