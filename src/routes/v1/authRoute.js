import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../../controllers/authController.js";

const Router = express.Router();

Router.post("/signup", signUp);
Router.post("/signin", signIn);
Router.post("/signout", signOut);
Router.post("/refresh", refreshToken);

export const authRoute = Router;
