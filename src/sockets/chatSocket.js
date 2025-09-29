export default function chatSocket(io) {
  io.on("connect", (socket) => {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });

    socket.on("clientChat", ({ roomId, msg }) => {
      io.to(roomId).emit("serverResponse", msg);
    });

    socket.on("disconnect", () => console.log("disconnect from server"));
  });
}
