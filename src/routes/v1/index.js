import express from "express";
import { Route_chat } from "./chatRoutes.js";
import { authRoute } from "./authRoute.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).json({ message: "first route for chat api is running" });
});

Router.use("/login", authRoute);

Router.use("/chat", authMiddleware.verifyToken, Route_chat);

export const Route_V1 = Router;
