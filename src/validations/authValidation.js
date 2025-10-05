import Joi from "joi";

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

export const authValidate = {
  validLogin,
};
