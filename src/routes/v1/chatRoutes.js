import express from "express";
import { chatValidation } from "../../validations/chatValidation.js";
import { chatController } from "../../controllers/chatController.js";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(200).json({ message: "get v1 chat router" });
  })
  .post(chatValidation.createNewChat, chatController.createNewChat);

Router.route("/:id").get(chatController.getMessage);

export const Route_chat = Router;
