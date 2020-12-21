const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: true,
    },
    Body: {
      type: String,
      required: true,
    },
    Photo: {
      type: Buffer,
      default: "no photo",
    },
    PhotoType: {
      type: String,
    },
    PostedBy: {
      type: ObjectId,
      ref: "User",
    },
    Likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    Comments: [
      {
        Text: String,
        PostedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
