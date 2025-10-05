import express from "express";
import { authValidate } from "../../validations/authValidation.js";
import { authController } from "../../controllers/authController.js";

const Router = express.Router();

Router.route("/").post(authValidate.validLogin, authController.login);

export const authRoute = Router;
