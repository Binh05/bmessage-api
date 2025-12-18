import User from "../models/User.js";

export const authMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Loi khi goi ham authMe", error);
    next(error);
  }
};

// Cập nhật thông tin user (username, bio)
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
