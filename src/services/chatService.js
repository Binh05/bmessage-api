const createNewChat = async (reqBody) => {
  try {
    const newChat = {
      ...reqBody,
      createAt: new Date(),
    };

    return newChat;
  } catch (error) {
    throw error;
  }
};

export const chatService = {
  createNewChat,
};
