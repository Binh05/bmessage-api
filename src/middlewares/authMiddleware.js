import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import User from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Khong tim thay token" });
    }

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, async (err, decodeUser) => {
      if (err) {
        console.error(err);
        return res
          .status(403)
          .json({ message: "Access token het han hoac khong dung" });
      }

      const user = await User.findById(decodeUser.userId).select(
        "-hashedPassword"
      );

      if (!user) {
        return res.status(404).json({ message: "Nguoi dung khong ton tai" });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.log("Loi khi xac thuc JWT token", error);
    return res.status(500).json({ message: "Loi he thong" });
  }
};
