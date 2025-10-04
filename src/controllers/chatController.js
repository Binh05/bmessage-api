import { chatService } from "../services/chatService.js";

const createNewChat = async (req, res, next) => {
  try {
    const createChat = await chatService.createNewChat(req.body);

    res.status(201).json(createChat);
  } catch (error) {
    next(error);
  }
};

const getMessage = async (req, res, next) => {
  try {
    const msg = await chatService.getMessage(req.params.id);

    res.status(200).json(msg);
  } catch (error) {
    next(error);
  }
};

export const chatController = {
  createNewChat,
  getMessage,
};
