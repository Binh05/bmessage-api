import { chatModel } from "../models/chatModel.js";

const createNewChat = async (reqBody) => {
  try {
    const newChat = {
      ...reqBody,
    };

    const createdChat = await chatModel.createNew(newChat);

    const getNewChat = await chatModel.findOneById(
      createdChat.insertedId.toString()
    );

    return getNewChat;
  } catch (error) {
    throw error;
  }
};

export const chatService = {
  createNewChat,
};
