const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  avatar: { type: String, default: "" },
  channels: { type: [String], default: [] },
  avatar: { type: String, default: "https://i.pravatar.cc/150" },
});

module.exports = mongoose.model("Users", UserSchema);
