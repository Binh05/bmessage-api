import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { signAccessToken } from "../utils/Token.js";
import Session from "../models/Session.js";

const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000;

const signUp = async (req, res, next) => {
  try {
    // kiem tra accesstoken
    const { username, phone, password } = req.body;
    if (!username || !phone || !password) {
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
      phone,
      hashedPassword,
    });

    return res.sendStatus(200);
  } catch (error) {
    console.error("Loi khi goi signup", error);
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password)
      return res
        .status(400)
        .json({ message: "Không thể thiểu sdt hay password" });

    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Số điện thoại hoặc mật khẩu không đúng" });
    }

    const passwordCorrec = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrec) {
      return res.status(401).json({ message: "Mat khau khong dung" });
    }

    const accessToken = signAccessToken({ userId: user._id });

    //const refreshToken = crypto.randomBytes(64).toString("hex");
    Session.create({
      userId: user._id,
      refreshToken: accessToken,
      avatarUrl: user?.avatarUrl ?? null,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: REFRESH_TOKEN_TTL,
    // });

    return res.status(200).json({
      message: `nguoi dung ${user.username} đã đăng nhập thành công`,
      accessToken,
      _id: user._id,
      username: user.username,
      phone: user.phone,
      avatarUrl: user?.avatarUrl ?? null,
    });
  } catch (error) {
    console.error("Loi khi login");
    next(error);
  }
};

const signOut = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await Session.deleteOne({ refreshToken: token });

      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Loi khi goi signOut");
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "Token khong ton tai" });

    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res
        .status(403)
        .json({ message: "token khong hop le hoac da het han" });
    }

    if (session.expiresAt < Date.now()) {
      return res.status(403).json({ message: "token da het han" });
    }

    const accessToken = signAccessToken({ userId: session.userId });
    return res.status(200).json({ accessToken });
  } catch (error) {}
};

export { signUp, signIn, signOut, refreshToken };
