import express from "express";
import http from "http";
import { Server } from "socket.io";
import { env } from "./config/environment.js";
import jwt from "jsonwebtoken";
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

  // app.get("/", async (req, res) => {
  //   console.log("Collections in DATABASE:");
  //   res.end("Hello Binh with socket.io");
  // });

  app.use(express.json());

  //jwt

  const test = [
    {
      id: 1,
      name: "15p",
      author: "binh",
    },
    {
      id: 2,
      name: "1 tiet",
      author: "binh",
    },
  ];

  app.get("/test", authenToken, (req, res) => {
    res.json({ status: "success", data: test });
  });

  //jwt middleware

  function authenToken(req, res, next) {
    const authorizationHeader = req.headers["authorization"];
    // beaer [token]
    const token = authorizationHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, env.ACCESS_TOKEN_SECRET, (err, data) => {
      console.log(err, data);
      if (err) return res.sendStatus(403);
      next();
    });
  }

  //socket realtime
  //chatSocket(io);

  //route
  app.use("/v1", Route_V1);

  // middlware error global
  app.use(errorHandlingMiddleware);

  server.listen(env.APP_PORT, () => {
    console.log(`server is running at http://${env.APP_HOST}:${env.APP_PORT}`);
  });

  // exitHook(() => {
  //   console.log("Closing MongoDB connect...");
  //   CLOSE_DB();
  //   console.log("MongoDB connect closed.");
  // });
}

START_SERVER();

// (async () => {
//   try {
//     console.log("Connecting to MongoDB Cloud Alats....");
//     await CONNECT_DB();
//     console.log("Connected to MongoDB Cloud Alats");

//     START_SERVER();
//   } catch (error) {
//     console.error(error);
//   }
// })();

// console.log('Connecting to MongoDB Cloud Alats....')
// CONNECT_DB()
//   .then(() => console.log("Connected to MongoDB Cloud Alats"))
//   .then(() => START_SERVER())
//   .catch(err => {
//     console.error(err)
//     process.exit(0)
//   })
