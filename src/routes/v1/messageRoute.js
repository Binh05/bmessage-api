import express from "express";
import {
  sendDirectMessage,
  sendGroupMessage,
} from "../../controllers/messageController.js";
import {
  checkFriendship,
  checkGroupMembership,
} from "../../middlewares/friendMiddleware.js";

const Router = express.Router();

Router.post("/direct", checkFriendship, sendDirectMessage);
Router.post("/group", checkGroupMembership, sendGroupMessage);

export const messageRoute = Router;
