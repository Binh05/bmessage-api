export const emitToggleLikeFeed = (io, feed) => {
  io.emit("toggle-like-feed", {
    feedId: feed._id,
    feed: {
      _id: feed._id,
      likeCounts: feed.likeCounts,
      likeBy: feed.likeBy,
      createdBy: feed.createdBy,
    },
  });
};
