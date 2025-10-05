import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";

const signToken = (data) => {
  return jwt.sign(data, env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

export const accessToken = { signToken, verifyToken };
