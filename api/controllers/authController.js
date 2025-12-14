const db = require("../db/queries");
const { validationResult, matchedData } = require("express-validator");
const CustomNotFoundError = require("../middlewares/CustomNotFoundError");
const validators = require("../middlewares/Validators");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = [
  validators.signupValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const data = matchedData(req);
      if (!data)
        throw new CustomNotFoundError("provided user information is invalid");
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await db.createUser(req.body.email, req.body.name, hashedPassword);
      const user = await db.getUser("email", req.body.email);

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json({ message: "User created", token, user: payload });
    } catch (err) {
      return next(err);
    }
  },
];

exports.signin = [
  validators.signinValidator,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const data = matchedData(req);
      if (!data) throw new CustomNotFoundError("login information is invalid!");

      const user = await db.getUser("email", req.body.email);
      if (!user)
        return res.status(401).json({ message: "Your email is invalid" });
      const valid = await bcrypt.compare(req.body.password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Your password is invalid" });
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res
        .status(200)
        .json({ message: "You are logged in", token, user: payload });
    } catch (err) {
      return next(err);
    }
  },
];

exports.checkSignin = async (req, res, next) => {
  try {
    const user = await db.getUser("id", req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    res.status(200).json({ message: "User is signed in", user: payload });
  } catch (err) {
    next(err);
  }
};
