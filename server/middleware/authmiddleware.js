const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // The token was signed with { id }, so we use decoded.id
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(401).json({ msg: "Invalid token", error: err.message });
  }
};