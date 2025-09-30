const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // To implement custom categories without any restriction
    category: {
      type: [String],
      default: [],
    },

    vaultType: {
      type: String,
      enum: ["personal", "community"],
      default: "personal",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // To track up votes in count as number
    upvotes: {
      type: Number,
      default: 0,
    },

    // To track down votes in count as number
    downvotes: {
      type: Number,
      default: 0,
    },

    // Optional: To track individual voters and prevent multiple votes
    votedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        voteType: { type: String, enum: ["upvote", "downvote"] },
      },
    ],

    shares: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["view", "edit"], default: "view" },
      },
    ],
  },
  { timestamps: true }
);

// MongoModule
const promptModel = mongoose.model("Prompt", prompt);

module.exports = promptModel;
