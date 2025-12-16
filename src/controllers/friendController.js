import Friend from "../models/Friend.js";
import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const sendFriendRequest = async (req, res, next) => {
  try {
    const { to } = req.body;
    const from = req.user._id.toString();

    if (!to) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người muốn gửi lời mời kết bạn" });
    }

    if (from === to) {
      return res
        .status(400)
        .json({ message: "Không thể gửi lời mời kết bạn cho chính mình" });
    }

    const userExists = await User.exists({ _id: to });

    if (!userExists) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    let userA = from.toString();
    let userB = from.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriend, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriend) {
      return res.status(400).json({ message: "Hai người đã là bạn bè" });
    }

    if (existingRequest) {
      return res.status(400).json({ message: "Đã gửi lời mời kết bạn" });
    }

    const request = await FriendRequest.create({ from, to });

    const populateRequet = await request.populate({
      path: "to",
      select: "_id username",
    });

    res
      .status(201)
      .json({
        message: "Gửi lời mời kết bạn thành công",
        request: populateRequet,
      });
  } catch (error) {
    console.log("Loi khi gui loi moi ket ban", error);
    next(error);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const user = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Khong tim thay loi moi ket ban" });
    }

    if (user.toString() !== request.to.toString()) {
      return res
        .status(400)
        .json({ message: "Ban khong co quyen chap nhan loi moi ket ban" });
    }

    await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id username avatarUrl")
      .lean();

    return res.status(200).json({
      message: "Chap nhan loi moi ket ban thanh cong",
      newFriend: {
        _id: from?._id,
        username: from?.username,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.log("Loi khi chap nhan loi moi ket ban", error);
    next(error);
  }
};

export const declineFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lời mời kết bạn" });
    }

    if (userId.toString() !== request.to.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền từ chối lời mời kết bạn" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id username avatarUrl")
      .lean();

    return res.status(201).json({
      message: "Từ chối lời mời kết bạn thành công",
      FriendDecline: {
        id: from?._id,
        username: from?.username,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.log("Lỗi khi từ chối lời mời kết bạn", error);
    next(error);
  }
};

export const getAllFriends = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const friendShips = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id username avatarUrl")
      .populate("userB", "_id username avatarUrl")
      .lean();

    if (!friendShips.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendShips.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.log("Loi khi lay danh sach ban be", error);
    next(error);
  }
};

export const getNotFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    });

    const friendRequests = await FriendRequest.find({
      $or: [{ from: userId }, { to: userId }],
    });

    const friendIds = friends.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB._id : f.userA._id
    );

    const friendRequestIds = friendRequests.map((fr) =>
      fr.from._id.toString() === userId.toString() ? fr.to._id : fr.from._id
    );

    const ninIdList = [...friendIds, ...friendRequestIds];

    const users = await User.find({
      _id: {
        $ne: userId,
        $nin: ninIdList,
      },
    }).select("_id username avatarUrl phone");

    return res.status(200).json({ users });
  } catch (error) {
    console.log("Loi khi goi getNotFriends", error);
    return res.status(500).json({ message: "loi he thong" });
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const populateFields = "_id username avatarUrl";

    const [send, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    return res.status(200).json({ send, received });
  } catch (error) {
    console.log("Loi khi lay danh sach loi moi ket ban", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
    next(error);
  }
};

export const cancelFriendRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Bạn đã hủy lời mời kết bạn" });
    }

    if (request.from.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ message: "Bạn không có quyền hủy lời mời kết bạn" });
    }

    const to = await User.findById(request.to)
      .select("_id username avatarUrl")
      .lean();

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({
      message: "Hủy lời mời kết bạn thành công",
      friendCancel: {
        userId: to?._id,
        username: to?.username,
        avatarUrl: to?.avatarUrl,
      },
    });
  } catch (error) {
    console.log("Lỗi khi thu hồi lời mời kết bạn", error);
    next(error);
  }
};

export const unfriend = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    const userId = req.user._id;

    const friend = await User.findById(friendId)
      .select("_id username avatarUrl")
      .lean();

    if (!friend) {
      return res.status(404).json({ message: "Bạn bè không tồn tại" });
    }

    const userA = userId.toString();
    const userB = friendId.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const friendships = await Friend.findOneAndDelete({
      userA,
      userB,
    });

    if (!friendships) {
      return res.status(400).json({ message: "Hai người không phải bạn bè" });
    }

    return res
      .status(200)
      .json({ message: `Hủy kết bạn với ${friend?.username} thành công` });
  } catch (error) {
    console.log("Lỗi khi hủy kết bạn", error);
    next(error);
  }
};
