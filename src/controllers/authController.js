import { authService } from "../services/authService.js";

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  login,
};
