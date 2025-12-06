import Friend from "../models/Friend.js";

const pair = (userA, userB) =>
  userA < userB ? [userA, userB] : [userA, userB];

export const checkFriendship = async (req, res, next) => {
  const me = req.user._id.toString();

  const recipientId = req.body?.recipientId ?? null;

  if (!recipientId) {
    return res.status(400).json({ message: "Thiếu Id người nhận" });
  }

  if (recipientId) {
    const [userA, userB] = pair(me, recipientId);

    const friend = await Friend.findOne({ userA, userB });

    if (!friend) {
      return res
        .status(403)
        .json({ message: "Bạn chưa kêt bạn với người này" });
    }

    return next();
  }
};
