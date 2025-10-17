import { userModel } from "../models/userModel.js";
import { tokens } from "../utils/Token.js";
import { refreshTokenModel } from "../models/refreshTokenModel.js";

const login = async (username, password) => {
  try {
    const user = await userModel.findOneUser(username);
    if (!user) throw new Error("user not found");

    if (password !== user.password) throw new Error("password incorrect");

    const payload = { userId: user._id, username: username };
    const accessToken = tokens.signAccessToken(payload);
    const refreshToken = tokens.signRefreshToken(payload);

    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const insertedRef = await refreshTokenModel.create({
      userId: user._id.toString(),
      token: refreshToken,

      expiredAt,
    });

    return {
      accessToken,
      refreshToken: {
        id: insertedRef.insertedId.toString(),
        expiredAt,
      },
    };
  } catch (error) {
    throw error;
  }
};

const signUp = async (reqBody) => {
  try {
    const newUser = await userModel.signUp(reqBody);

    const getNewUser = await userModel.findOneUser(newUser.insertedId);
    return getNewUser;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (tokenId) => {
  const refToken = await refreshTokenModel.findOneById(tokenId);
  if (!refToken) throw new Error("refresh token not found");

  try {
    tokens.verifyRefreshToken(refToken.token);
  } catch (error) {
    throw new Error("Expired or invalid refresh token");
  }

  if (refToken.expiredAt < new Date()) {
    await refreshTokenModel.deleteOneById(refToken._id);
    throw new Error("refresh token expired");
  }

  const newAccessToken = tokens.signAccessToken({
    userId: refToken.userId,
  });

  return newAccessToken;
};

const logout = async (tokenId) => {
  if (!tokenId) return;
  try {
    await refreshTokenModel.deleteOneById(tokenId);
  } catch (error) {
    throw error;
  }
};

export const authService = {
  login,
  signUp,
  refreshToken,
  logout,
};
