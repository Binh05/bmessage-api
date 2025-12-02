import express from "express";
import { authMe } from "../../controllers/userController.js";

const Router = express.Router();

Router.get("/me", authMe);

export const userRoute = Router;
