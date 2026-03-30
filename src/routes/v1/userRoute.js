import express from "express";
import {
  authMe,
  searchUserByEmail,
  uploadAvatar,
} from "../../controllers/userController.js";
import { upload } from "../../middlewares/cloudinaryMiddleware.js";

const Router = express.Router();

Router.get("/me", authMe);
Router.get("/", searchUserByEmail);
Router.post("/uploadAvatar", upload.single("file"), uploadAvatar);

export const userRoute = Router;
