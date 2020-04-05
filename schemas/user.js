const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  console.log("token", token);
  return token;
};

/**
 * @class
 * @classdesc database model for User
 * @description creates a mongoDB user object
 * @param {Object} userData user info to store in database
 * @param {string} userData.name user's name
 * @param {string} userData.email user email
 * @param {string} userData.password user password hashed
 */
const User = mongoose.model("User", userSchema);

module.exports = User;
