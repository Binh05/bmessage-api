import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";

const signAccessToken = (data) => {
  return jwt.sign(data, env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET);
};

const signRefreshToken = (data) => {
  return jwt.sign(data, env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET);
};

export {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
