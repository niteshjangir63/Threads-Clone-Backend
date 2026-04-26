const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // ✅ 1. Try access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      console.log("Access token expired, trying refresh...");
    }
  }

  // ✅ 2. Try refresh token
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // 🔥 create new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    // 🔥 set cookie for NEXT requests
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};