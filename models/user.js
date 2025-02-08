const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    favorites: { type: [Number], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
