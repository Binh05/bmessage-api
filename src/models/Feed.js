import mongoose from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    likeCounts: {
      type: Number,
      default: 0,
    },
    likeBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

feedSchema.index({ createdBy: 1, createdAt: -1 });

const Feed = mongoose.model("Feed", feedSchema);
export default Feed;
