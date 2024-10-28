import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { sendMessage } from "./controllers/messageController";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // 채팅방 참여 이벤트 처리`
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async (messageData) => {
    const { success, data } = await sendMessage(messageData);

    if (success) {
      io.to(messageData.roomId).emit("message", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
