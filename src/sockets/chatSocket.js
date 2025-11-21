import { chatService } from "../services/chatService.js";

export default function chatSocket(io) {
  io.on("connection", (socket) => {
    socket.on("user-connect", () => {
      socket.emit("serverResponse", "connected to socket server");
    });

    socket.on("join-room", (roomId, peerId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", peerId);
      user;
    });

    socket.on("responsePeerId", (roomId, peerId) => {
      socket.to(roomId).emit("old-user", peerId);
    });
  });
}

// io.on("connect", (socket) => {
//   socket.on("joinRoom", async (data) => {
//     socket.join(data.roomId);
//     const messages = await chatService.getMessageByRoom(data.roomId);
//     socket.emit("loadHistory", messages);
//     io.to(data.roomId).emit("notiJoin", `${data.userName} has joined`);
//   });
//   socket.on("clientMsg", async (data) => {
//     const newMessage = await chatService.createNewChat(data);
//     io.to(newMessage.roomId).emit("serverResponse", newMessage);
//   });
//   socket.on("disconnect", () => console.log("disconnect from server"));
// });
