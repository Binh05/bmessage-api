import Joi from "joi";
import { OBJECT_ID, OBJECT_ID_MESSAGE } from "../utils/validator.js";

async function validLogin(req, res, next) {
  const valid = Joi.object({
    username: Joi.string().required().min(1).trim().strict(),
    password: Joi.string().required().min(1).trim().strict(),
  });

  try {
    await valid.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (err) {
    res.status(400).json({
      error: new Error(err).message,
    });
  }
}

const validSignUp = async (req, res, next) => {
  const valid = Joi.object({
    username: Joi.string().required().min(1).trim().strict(),
    password: Joi.string().required().min(1).trim().strict(),
  });

  try {
    await valid.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    res.status(400).json({
      error: new Error(error).message,
    });
  }
};

const validRefreshToken = async (req, res, next) => {
  const valid = Joi.object({
    id: Joi.string().pattern(OBJECT_ID).message(OBJECT_ID_MESSAGE).required(),
  });

  try {
    await valid.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: new Error(error).message,
    });
  }
};

export const authValidate = {
  validLogin,
  validSignUp,
  validRefreshToken,
};
