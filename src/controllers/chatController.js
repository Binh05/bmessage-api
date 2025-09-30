import { chatService } from "../services/chatService.js";

const createNewChat = async (req, res, next) => {
  try {
    const createChat = await chatService.createNewChat(req.body);
    console.log(createChat);
    res.status(201).json(createChat);
  } catch (error) {
    next(error);
    // res.status(500).json({
    //     error: error.message
    // })
  }
};

export const chatController = {
  createNewChat,
};
