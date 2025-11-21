import express from "express";
import { authValidate } from "../../validations/authValidation.js";
import { authController } from "../../controllers/authController.js";

const Router = express.Router();

Router.route("/login").post(authValidate.validLogin, authController.login);

Router.route("/signup").post(authValidate.validSignUp, authController.signUp);

Router.route("/refresh").post(
  authValidate.validRefreshToken,
  authController.refreshToken
);

Router.route("/me").post(authValidate.validRefreshToken, (req, res) =>
  res.sendStatus(204)
);

Router.route("/logout").post(authController.logout);

export const authRoute = Router;
