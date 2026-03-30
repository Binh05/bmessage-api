import User from "../models/User.js";
import Friend from "../models/Friend.js";
import { uploadImageFromBuffer } from "../middlewares/cloudinaryMiddleware.js";

export const authMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Loi khi goi ham authMe", error);
    next(error);
  }
};

export const searchUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const userId = req.user._id;

    if (!email || email.trim() == "") {
      return res.status(400).json({ message: "Email khong duoc de trong" });
    }

    const searcheduser = await User.findOne({
      email,
      _id: { $ne: userId },
    }).select("_id username email avatarUrl");

    if (!searcheduser) {
      return res.status(200).json({ user: null });
    }

    const [userA, userB] =
      userId < searcheduser._id
        ? [userId, searcheduser._id]
        : [searcheduser._id, userId];

    const isFriend = await Friend.exists({ userA, userB });

    return res.status(200).json({
      user: {
        ...searcheduser.toObject(),
        isFriend,
      },
    });
  } catch (error) {
    console.error("Loi khi tim kiem user", error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user._id;

    if (!username && !bio) {
      return res.status(400).json({
        message: "Vui lòng cung cấp ít nhất một trường để cập nhật",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    // Kiểm tra username đã tồn tại (nếu có thay đổi)
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Username này đã được sử dụng" });
      }
      user.username = username;
    }

    // Cập nhật bio
    if (bio) {
      user.bio = bio;
    }

    await user.save();

    console.log(`User ${userId} profile updated`);

    return res.status(200).json({
      message: "Cập nhật thông tin thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    next(error);
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: "Thieu file anh" });
    }

    const result = await uploadImageFromBuffer(file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      { new: true },
    ).select("avatarUrl");

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: "avatar url null" });
    }

    return res.status(200).json({
      message: "Upload avatar thành công",
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    console.error("Lỗi khi upload avatar", error);
    return res.status(500);
  }
};
