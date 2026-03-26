import express from "express";
import { authMe, searchUserByEmail } from "../../controllers/userController.js";

const Router = express.Router();

Router.get("/me", authMe);
Router.get("/", searchUserByEmail);

export const userRoute = Router;
