import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
  cancelFriendRequest,
  unfriend,
} from "../../controllers/friendController.js";

const Router = express.Router();

Router.post("/requests", sendFriendRequest);
Router.post("/requests/:requestId/accept", acceptFriendRequest);
Router.post("/requests/:requestId/decline", declineFriendRequest);
Router.post("/requests/:requestId/cancel", cancelFriendRequest);

Router.get("/", getAllFriends);
Router.get("requests", getFriendRequests);

Router.delete("/:friendId/unfriend", unfriend);

export const friendRoute = Router;
