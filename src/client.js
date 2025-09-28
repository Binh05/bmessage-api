import { io } from "socket.io-client";

// Kết nối tới server
const socket = io("http://localhost:5000");

// Khi kết nối thành công
socket.on("connect", () => {
  console.log("✅ Connected to server, id:", socket.id);
});

socket.emit("clientChat", "First chat from client");

// Nhận message từ server
socket.on("serverResponse", (msg) => {
  console.log("Response from server:", msg);
});

socket.on("disconnect", () => {
  console.log("Disconnect from server: ");
});
