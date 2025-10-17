import { authService } from "../services/authService.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const tokens = await authService.login(username, password);

    res.cookie("refresh_token_id", tokens.refreshToken.id, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: tokens.refreshToken.expiredAt - Date.now(),
      path: "/",
    });

    res.json({ success: true, tokens });
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
    const tokenId = req.cookies.refresh_token_id;
    const accessToken = await authService.refreshToken(tokenId);
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
    const tokenId = req.cookies.refresh_token_id;
    if (!tokenId) {
      const err = new Error("Refresh token not found");
      err.status = 400;
      throw err;
    }
    await authService.logout(tokenId);

    res.clearCookie("refresh_token_id", {
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
