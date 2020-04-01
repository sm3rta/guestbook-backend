const mongoose = require("mongoose");
const connectToDataBase = require("../utils/connectToDatabase");

connectToDataBase();
const { Schema } = mongoose;
const messageSchema = new Schema({
  content: String,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  date: { type: Date, default: Date.now },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reply"
    }
  ]
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
