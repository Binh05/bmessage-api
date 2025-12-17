import { Server } from "socket.io";
import { env } from "../config/environment.js";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";
import { getUserConversationForSocketIo } from "../controllers/conversationController.js";

let io;

// Map to track online users: userId -> { socketId, connectedAt }
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketMiddleware);

  io.on("connection", async (socket) => {
    const user = socket.user;
    const userId = user._id.toString();

    console.log(`${user.username} connected with socket: ${socket.id}`);

    // Track online user
    onlineUsers.set(userId, {
      socketId: socket.id,
      connectedAt: Date.now(),
      username: user.username,
    });

    // Broadcast updated online users list to all clients
    const onlineUsersList = Array.from(onlineUsers.keys());

    io.emit("online-users", onlineUsersList);

    const conversationIds = await getUserConversationForSocketIo(user._id);
    conversationIds.forEach((id) => socket.join(id));

    // Join user to personal room for direct messages
    socket.join(`user:${userId}`);

    // Socket event: User typing
    socket.on("typing", (data) => {
      const { conversationId } = data;
      socket.broadcast.emit("user-typing", {
        userId,
        conversationId,
      });
    });

    socket.on("stop-typing", (data) => {
      const { conversationId } = data;
      socket.broadcast.emit("user-stopped-typing", {
        userId,
        conversationId,
      });
    });

    socket.on("send-message", (data) => {
      const { conversationId, receiverId } = data;
      // Send to specific user's room
      if (receiverId) {
        socket.broadcast.to(`user:${receiverId}`).emit("new-message", data);
      }
      // Broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit("new-message", data);
    });

    // Socket disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      const onlineUsersList = Array.from(onlineUsers.keys());
      io.emit("online-users", onlineUsersList);
      console.log(`${user.username} disconnected from socket: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

export const isUserOnline = (userId) => {
  return onlineUsers.has(userId.toString());
};
