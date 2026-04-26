const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  let accessToken = req.cookies.accessToken;

  // 1. If access token exists, verify it
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      req.userId = decoded.id;
      return next();
    } catch (err) {


    }
  }


  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized: no token" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });

    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};