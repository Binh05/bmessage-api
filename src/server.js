import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import { Route_V1 } from "./routes/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb.js";
import exitHook from "async-exit-hook";
import { authRoute } from "./routes/v1/authRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

function START_SERVER() {
  const app = express();
  const server = http.createServer(app);

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  app.get("/", async (req, res) => {
    res.end("Start success");
  });

  // public route
  app.use("/v1/auth", authRoute);

  app.use(protectedRoute);
  //private route
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

(async () => {
  try {
    console.log("Connecting to MongoDB Cloud Alats....");
    await CONNECT_DB();

    START_SERVER();
  } catch (error) {
    console.error(error);
  }
})();
