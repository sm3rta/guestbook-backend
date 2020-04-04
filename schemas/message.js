const mongoose = require("mongoose");
const connectToDataBase = require("../utils/connectToDatabase");

connectToDataBase();
const { Schema } = mongoose;
const messageSchema = new Schema({
  content: String,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: { type: Date, default: Date.now },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reply",
    },
  ],
});
/**
 * @class
 * @classdesc database model for Message\
 * @description creates a mongoDB message object
 * @param {Object} messageData message info to store in database
 * @param {string} messageData.content message content
 * @param {string} messageData.submittedBy ref to User object,
 * the user who submitted the message
 * @param {Date} messageData.date message submission date
 * @param {Array.<string>} messageData.replies an array of
 * references to replies to the message
 */
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
