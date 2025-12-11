const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
      req.user = decoded; // Set req.user to the decoded JWT payload
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
