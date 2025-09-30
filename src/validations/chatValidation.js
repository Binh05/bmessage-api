import Joi from "joi";

const createNewChat = async (req, res, next) => {
  const valid = Joi.object({
    message: Joi.string().min(1).required().trim().strict(),
    roomId: Joi.string().required().trim().strict(),
    sender: Joi.string().required().min(1).trim().strict(),
    receive: Joi.string().required().min(1).trim().strict(),
    message: Joi.string().required().min(1).trim().strict(),
  });

  try {
    await valid.validateAsync(req.body, { abortEarly: false });

    next();
  } catch (error) {
    console.log(error);

    res.status(422).json({
      error: new Error(error).message,
    });
  }
};

export const chatValidation = {
  createNewChat,
};
