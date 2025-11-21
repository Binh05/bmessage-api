import { authService } from "../services/authService.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const tokens = await authService.login(username, password);

    const { accessToken, refreshToken } = tokens;

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ success: true, accessToken });
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    const signUp = await authService.signUp(req.body);
    res.status(201).json({ signUp });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    const accessToken = await authService.refreshToken(token);
    res.status(200).json({
      message: "Successed refresh access token",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      const err = new Error("Refresh token not found");
      err.status = 400;
      throw err;
    }
    await authService.logout(token);

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({
      message: "Success logout",
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
  signUp,
  refreshToken,
  logout,
};
