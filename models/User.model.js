const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  avatar: { type: String, default: "https://i.pravatar.cc/150" },
  banner: { type: String, default: "" },

  channels: { type: [String], default: [] },
});

module.exports = mongoose.model("Users", UserSchema);
