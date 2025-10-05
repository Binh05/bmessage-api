import { userModel } from "../models/userModel.js";
import { accessToken } from "../utils/accessToken.js";

const login = async (username, password) => {
  try {
    //const user = await userModel.findOneUser(username);
    if (username !== "binh") throw new Error("User not found");

    if (password !== "123") throw new Error("Password incorrect");

    const payload = { username, password };
    return accessToken.signToken(payload);
  } catch (error) {
    throw error;
  }
};

export const authService = {
  login,
};
