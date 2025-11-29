import express from "express";
import { userRoute } from "./userRoute.js";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(200).json({ message: "first route for chat api is running" });
});

Router.use("/user", userRoute);

export const Route_V1 = Router;
