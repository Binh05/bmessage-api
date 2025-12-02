export const authMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Loi khi goi ham authMe", error);
    next(error);
  }
};
