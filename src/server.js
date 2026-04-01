import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import { Route_V1 } from "./routes/v1/index.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
import { CONNECT_DB, CLOSE_DB } from "./config/mongodb.js";
import exitHook from "async-exit-hook";
import { authRoute } from "./routes/v1/authRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { app, server } from "./sockets/index.js";
import { v2 as cloudinary } from "cloudinary";

function START_SERVER() {
  app.use(express.json());
  // Tăng giới hạn payload để hỗ trợ upload ảnh base64 (max 10MB)
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  app.get("/", async (req, res) => {
    res.redirect("https://bmessage.vercel.app/");
  });

  // swagger
  const swaggerDocument = JSON.parse(
    fs.readFileSync("./src/swagger.json", "utf8"),
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
