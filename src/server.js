import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import chatSocket from "./sockets/chatSocket.js";
import { Route_V1 } from "./routes/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb.js";
import exitHook from "async-exit-hook";

function START_SERVER() {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  // app.use(
  //   cors({
  //     origin: ["http://localhost:3000"], // cho phép Next.js gọi
  //     methods: ["GET", "POST", "PUT", "DELETE"],
  //     credentials: true, // nếu bạn có dùng cookie hoặc JWT trong header
  //   })
  // );

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  //socket realtime
  chatSocket(io);

  app.get("/", async (req, res) => {
    console.log("Collections in DATABASE:");
    res.end("Hello Binh with socket.io");
  });

  app.use(express.json());
  app.use(cookieParser());

  //route
  app.use("/v1", Route_V1);

  // middlware error global
  app.use(errorHandlingMiddleware);

  server.listen(env.APP_PORT, () => {
    console.log(`server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
  });

  exitHook(() => {
    console.log("Closing MongoDB connect...");
    CLOSE_DB();
    console.log("MongoDB connect closed.");
  });
}

// START_SERVER();

(async () => {
  try {
    // console.log("Connecting to MongoDB Cloud Alats....");
    // await CONNECT_DB();
    // console.log("Connected to MongoDB Cloud Alats");

    START_SERVER();
  } catch (error) {
    console.error(error);
  }
})();

// console.log('Connecting to MongoDB Cloud Alats....')
// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB Cloud Alats"))
//   .then(() => START_SERVER())
//   .catch(err => {
//     console.error(err)
//     process.exit(0)
//   })
