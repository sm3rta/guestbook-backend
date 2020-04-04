const mongoose = require("mongoose");

const { Schema } = mongoose;

const replySchema = new Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: String,
  date: { type: Date, default: Date.now },
});

/**
 * @class
 * @classdesc database model for Reply\
 * a Reply object references a User in the submittedBy
 * and is referenced by a Message
 * @description creates a mongoDB reply object
 * @param {Object} replyData reply info to store in database
 * @param {string} replyData.content reply content
 * @param {string} replyData.submittedBy ref to User object,
 * the user who submitted the reply
 * @param {Date} replyData.date reply submission date
 */
const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
