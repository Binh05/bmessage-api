import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

import { updateConversationAfterCreateMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res, next) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({ message: "Thiếu nội dung tin nhắn" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCount: new Map(),
      });
    }

    const message = await Message.create({
      senderId,
      conversationId: conversation._id,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    return res.status(201).json({ message });
  } catch (error) {
    console.log("Loi khi gui nhan tin", error), next(error);
  }
};

export const sendGroupMessage = async (req, res, next) => {
  try {
  } catch (error) {
    console.log("Loi khi gui tin nhan nhom", error);
    next(error);
  }
};
