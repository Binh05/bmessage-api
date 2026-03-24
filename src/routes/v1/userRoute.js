import express from "express";
import { authMe, searchUser } from "../../controllers/userController.js";

const Router = express.Router();

Router.get("/me", authMe);
Router.get("/", searchUser);

export const userRoute = Router;
