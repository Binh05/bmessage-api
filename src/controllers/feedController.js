import Feed from "../models/Feed.js";
import cloudinary from "../config/cloudinary.js";
import { getIO } from "../sockets/index.js";
import { emitToggleLikeFeed } from "../utils/feedHelper.js";

export const createFeed = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ message: "Title là bắt buộc" });
    }

    let imageUrl = null;

    if (req.file) {
      imageUrl = req.file.path;
    } else if (content) {
      try {
        const result = await cloudinary.uploader.upload(content, {
          folder: "chatapp-mobile/feeds",
          allowed_formats: ["jpg", "png", "jpeg", "webp"],
          transformation: [{ width: 1000, crop: "limit" }],
        });

        imageUrl = result.secure_url;
        console.log(`Image uploaded to Cloudinary: ${imageUrl}`);
      } catch (uploadError) {
        console.error("Lỗi upload ảnh lên Cloudinary:", uploadError);
      }
    }

    const newFeed = new Feed({
      createdBy: userId,
      title,
      content: imageUrl, // Lưu URL ảnh từ Cloudinary
      likeCounts: 0,
      likeBy: [],
    });

    await newFeed.save();

    // Populate thông tin creator
    await newFeed.populate({
      path: "createdBy",
      select: "username avatarUrl",
    });

    console.log("Feed created successfully");

    return res.status(201).json({
      message: "Tạo feed thành công",
      feed: newFeed,
    });
  } catch (error) {
    console.error("Lỗi khi tạo feed:", error);
    next(error);
  }
};

export const getFeeds = async (req, res, next) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;
    const currentUserId = req.user?._id;

    let query = {};

    // Nếu có userId, lấy feed của user đó
    if (userId) {
      query.createdBy = userId;
    }

    const skip = (page - 1) * limit;

    const feeds = await Feed.find(query)
      .populate({
        path: "createdBy",
        select: "username avatarUrl",
      })
      .populate({
        path: "likeBy",
        select: "username avatarUrl",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Đếm tổng feeds
    const total = await Feed.countDocuments(query);

    console.log(`Retrieved ${feeds.length} feeds`);

    return res.status(200).json({
      message: "Lấy feeds thành công",
      feeds,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy feeds:", error);
    next(error);
  }
};

export const getFeedById = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const currentUserId = req.user?._id;

    const feed = await Feed.findById(feedId)
      .populate({
        path: "createdBy",
        select: "username avatarUrl",
      })
      .populate({
        path: "likeBy",
        select: "username avatarUrl",
      });

    if (!feed) {
      return res.status(404).json({ message: "Feed không tồn tại" });
    }

    return res.status(200).json({
      message: "Lấy feed thành công",
      feed,
    });
  } catch (error) {
    console.error("Lỗi khi lấy feed:", error);
    next(error);
  }
};

export const toggleLikeFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const userId = req.user._id;

    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: "Feed không tồn tại" });
    }

    const isLiked = feed.likeBy.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      // Unlike
      feed.likeBy = feed.likeBy.filter(
        (id) => id.toString() !== userId.toString()
      );
      feed.likeCounts = Math.max(0, feed.likeCounts - 1);
    } else {
      // Like
      feed.likeBy.push(userId);
      feed.likeCounts += 1;
    }

    await feed.save();

    await feed.populate({
      path: "likeBy",
      select: "username avatarUrl",
    });

    // Emit socket event to all clients
    emitToggleLikeFeed(getIO(), feed);

    console.log(`✅ Feed ${feedId} toggled like`);

    return res.status(200).json({
      message: isLiked ? "Unlike thành công" : "Like thành công",
      feed,
      isLiked: !isLiked, // Return new like status
    });
  } catch (error) {
    console.error("Lỗi khi like feed:", error);
    next(error);
  }
};

// Xóa feed
export const deleteFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const userId = req.user._id;

    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: "Feed không tồn tại" });
    }

    // Kiểm tra owner
    if (feed.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa feed này" });
    }

    await Feed.findByIdAndDelete(feedId);

    console.log(`✅ Feed ${feedId} deleted`);

    return res.status(200).json({
      message: "Xóa feed thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa feed:", error);
    next(error);
  }
};

// Cập nhật feed
export const updateFeed = async (req, res, next) => {
  try {
    const { feedId } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: "Feed không tồn tại" });
    }

    // Kiểm tra owner
    if (feed.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa feed này" });
    }

    // Cập nhật title
    if (title) feed.title = title;

    // Cập nhật content (có thể là ảnh)
    if (req.file) {
      // Nếu có file mới từ multer
      feed.content = req.file.path;
      console.log(`✅ Image updated on Cloudinary: ${req.file.path}`);
    } else if (content) {
      // Nếu content là base64 hoặc string khác
      if (content.startsWith("data:")) {
        // Là base64, upload lên Cloudinary
        try {
          const result = await cloudinary.uploader.upload(content, {
            folder: "chatapp-mobile/feeds",
            allowed_formats: ["jpg", "png", "jpeg", "webp"],
            transformation: [{ width: 1000, crop: "limit" }],
          });

          feed.content = result.secure_url;
          console.log(`✅ Image updated on Cloudinary: ${result.secure_url}`);
        } catch (uploadError) {
          console.error("Lỗi upload ảnh lên Cloudinary:", uploadError);
          // Không cần return error, tiếp tục cập nhật feed
        }
      } else {
        // Là URL hoặc text thông thường
        feed.content = content;
      }
    }

    await feed.save();

    await feed.populate({
      path: "createdBy",
      select: "username avatarUrl",
    });

    console.log(`✅ Feed ${feedId} updated`);

    return res.status(200).json({
      message: "Cập nhật feed thành công",
      feed,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật feed:", error);
    next(error);
  }
};
