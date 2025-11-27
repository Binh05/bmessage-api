import User from "../models/User.js";
import bcrypt from "bcrypt";

const signUp = async (req, res, next) => {
  try {
    // kiem tra accesstoken
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: "Thiếu thông tin đăng nhập" });
    }

    // kiem tra sdt ton tai hay chua
    const dulicate = await User.findOne({ phone });
    if (dulicate) {
      return res.status(409).json({ message: "sdt da ton tai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      phone,
      hashedPassword,
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Loi khi goi signup", error);
    next(error);
  }
};

const signIn = (req, res, next) => {
  try {
  } catch (error) {
    console.log("Loi khi login");
    next(error);
  }
};

export { signUp };
