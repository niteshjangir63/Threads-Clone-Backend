const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorised" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    req.userId = decoded.id;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};