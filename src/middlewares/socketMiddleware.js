import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/environment.js";

export const socketMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized - Token khong ton tai"));
    }

    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(
        new Error("Unauthorized - Token khong hop le hoac da het han")
      );
    }

    const user = await User.findById(decoded.userId).select("-hashedPassword");

    if (!user) {
      return next(new Error("User khong ton tai"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Loi khi verify jwt trong socketMiddleware", error);
    next(new Error("Unauthorized"));
  }
};
