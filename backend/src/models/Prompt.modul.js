const mongoose=require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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

    category: {
      type: String,
      enum: ["marketing", "study", "code", "creative", "other"],
      default: "other",
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

    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] }, // upvote = 1, downvote = -1
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
const  promptModel=mongoose.model("Prompt",prompt);

module.exports=promptModel;