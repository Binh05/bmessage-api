import express from "express";
import { signUp } from "../../controllers/authController.js";

const Router = express.Router();

Router.post("/signup", signUp);

export const authRoute = Router;
