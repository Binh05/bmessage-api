import express from "express";
import { authValidate } from "../../validations/authValidation.js";
import { authController } from "../../controllers/authController.js";

const Router = express.Router();

Router.route("/login").post(authValidate.validLogin, authController.login);

Router.route("/signup").post(authValidate.validSignUp, authController.signUp);

Router.route("/refreshtoken").post(
  authValidate.validRefreshToken,
  authController.refreshToken
);

Router.route("/logout").post(authController.logout);

export const authRoute = Router;
