import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../../controllers/messageController.js";
import { checkFriendship } from "../../middlewares/friendMiddleware.js";

const Router = express.Router();

Router.post("/direct", checkFriendship, sendDirectMessage);
Router.post("/group", sendGroupMessage);

export const messageRoute = Router;
