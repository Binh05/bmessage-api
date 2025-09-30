import Joi from "joi";
import { ObjectId } from "mongodb";
import { OBJECT_ID, OBJECT_ID_MESSAGE } from "../utils/validator.js";
import { GET_DB } from "../config/mongodb.js";

const CHAT_COLLECTION_NAME = "chat";
const CHAT_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required().trim().strict(),
  sender: Joi.string().required().min(1).trim().strict(),
  receive: Joi.string().required().min(1).trim().strict(),
  message: Joi.string().required().min(1).trim().strict(),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  _destroy: Joi.boolean().default(false),
});

const createNew = async (data) => {
  try {
    const dataInsert = await CHAT_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    });
    return await GET_DB()
      .collection(CHAT_COLLECTION_NAME)
      .insertOne(dataInsert);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CHAT_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

export const chatModel = {
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
