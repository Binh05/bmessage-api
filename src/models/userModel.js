import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongodb.js";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required().min(1).trim().strict(),
  password: Joi.string().required().min(1).trim().strict(),

  createAt: Joi.date().timestamp("javascript").default(Date.now),
  _destroy: Joi.boolean().default(false),
});

const signUp = async (data) => {
  try {
    const dataInsert = await USER_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    });
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(dataInsert);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (userId) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(userId) });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneUser = async (username) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ username });
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  findOneUser,
  findOneById,
  signUp,
};
