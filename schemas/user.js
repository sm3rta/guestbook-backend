const mongoose = require("mongoose");
const connectToDataBase = require("../utils/connectToDatabase");

connectToDataBase();

const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
});

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
