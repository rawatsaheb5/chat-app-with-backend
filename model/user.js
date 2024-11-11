const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default:"other"
    }
  },
  {
    timestamps: true,
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
module.exports = User;
