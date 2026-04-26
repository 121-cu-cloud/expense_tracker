const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Save user info in request
    req.user = verified;

    // Move to next function
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};