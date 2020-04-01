const mongoose = require("mongoose");
const connectToDataBase = require("../utils/connectToDatabase");

connectToDataBase();

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
