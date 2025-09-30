import Joi from "joi";
import { OBJECT_ID, OBJECT_ID_MESSAGE } from "../utils/validator";

const CHAT_COLLECTION_NAME = "boards";
const CHAT_COLLECTION_SCHEMA = Joi.object({
  id: Joi.string().required().pattern(OBJECT_ID).message(OBJECT_ID_MESSAGE),
  roomId: Joi.string().required().trim().strict(),
  sender: Joi.string().required().min(1).trim().strict(),
  receive: Joi.string().required().min(1).trim().strict(),
  message: Joi.string().required().min(1).trim().strict(),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  _destroy: Joi.boolean().default(false),
});

export const chatModel = {
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTION_SCHEMA,
};
