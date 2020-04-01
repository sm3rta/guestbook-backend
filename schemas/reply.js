const mongoose = require("mongoose");
const connectToDataBase = require("../utils/connectToDatabase");

connectToDataBase();
const { Schema } = mongoose;

const replySchema = new Schema({
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  content: String,
  date: { type: Date, default: Date.now }
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
