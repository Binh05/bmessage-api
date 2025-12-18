import express from "express";
import * as feedController from "../../controllers/feedController.js";
import upload from "../../middlewares/cloudinaryMiddleware.js";

const Router = express.Router();

// POST - Tạo feed mới (với hỗ trợ upload ảnh)
Router.post("/", upload.single("content"), feedController.createFeed);

// GET - Lấy danh sách feeds
Router.get("/", feedController.getFeeds);

// GET - Lấy chi tiết 1 feed
Router.get("/:feedId", feedController.getFeedById);

// POST - Like/Unlike feed
Router.post("/:feedId/like", feedController.toggleLikeFeed);

// PUT - Cập nhật feed (với hỗ trợ upload ảnh)
Router.put("/:feedId", upload.single("content"), feedController.updateFeed);

// DELETE - Xóa feed
Router.delete("/:feedId", feedController.deleteFeed);

export const feedRoute = Router;
