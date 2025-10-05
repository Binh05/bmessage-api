import { accessToken } from "../utils/accessToken.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ mess: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = accessToken.verifyToken(token);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const authMiddleware = {
  verifyToken,
};
