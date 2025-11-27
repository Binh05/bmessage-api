import express from "express";
import { authRoute } from "./authRoute.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).json({ message: "first route for chat api is running" });
});

Router.use("/auth", authRoute);
Router.get("/test", authMiddleware.verifyToken, (req, res) => {
  return res.sendStatus(204);
});

export const Route_V1 = Router;
