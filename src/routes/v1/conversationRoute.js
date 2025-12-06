import express from "express";
import {
  createConversation,
  getConversations,
  getMessages,
} from "../../controllers/conversationController.js";
import { checkFriendship } from "../../middlewares/friendMiddleware.js";

const Router = express.Router();

Router.post("/", checkFriendship, createConversation);
Router.get("/", getConversations);
Router.get("/:conversationId/messages", getMessages);

export const conversationRoute = Router;
