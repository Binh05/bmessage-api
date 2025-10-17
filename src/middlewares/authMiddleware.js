import { tokens } from "../utils/Token.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ mess: "No token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = tokens.verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authMiddleware = {
  verifyToken,
};
