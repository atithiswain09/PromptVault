const mongoose=require("mongoose");


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    provider: {  //provider is A type ,
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    profilePic: {
      type: String, // URL of avatar (optional)
    },

    vaults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vault",
      },
    ],
  },
  { timestamps: true }
);

// MongoModule
const UserModel=mongoose.model("User",userSchema);

//Exporting the Module
module.exports=UserModel;