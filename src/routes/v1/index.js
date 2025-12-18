import express from "express";
import { userRoute } from "./userRoute.js";
import { friendRoute } from "./friendRoute.js";
import { messageRoute } from "./messageRoute.js";
import { conversationRoute } from "./conversationRoute.js";
import { feedRoute } from "./feedRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).json({ message: "first route for chat api is running" });
});

Router.use("/user", userRoute);
Router.use("/friends", friendRoute);
Router.use("/messages", messageRoute);
Router.use("/conversations", conversationRoute);
Router.use("/feeds", feedRoute);

export const Route_V1 = Router;
