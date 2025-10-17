import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { OBJECT_ID, OBJECT_ID_MESSAGE } from "../utils/validator.js";
import { ObjectId } from "mongodb";

const REFRESHTOKEN_COLLECTION_NAME = "refresh_tokens";
const REFRESHTOKEN_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID).message(OBJECT_ID_MESSAGE).required(),
  token: Joi.string().required(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  expiredAt: Joi.date().required(),
});

const create = async (data) => {
  try {
    const newData = await REFRESHTOKEN_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false,
    });
    newData.userId = new ObjectId(newData.userId);
    return await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .insertOne(newData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (tokenId) => {
  try {
    return await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(tokenId) });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneById = async (tokenId) => {
  try {
    return await GET_DB()
      .collection(REFRESHTOKEN_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(tokenId) });
  } catch (error) {
    throw new Error(error);
  }
};

export const refreshTokenModel = {
  create,
  findOneById,
  deleteOneById,
};
