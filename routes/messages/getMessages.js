const express = require("express");
const router = express.Router();
const Message = require("../../schemas/message");

router.get("/", async (req, res) => {
  const messages = await Message.find()
    .populate("submittedBy")
    .populate("replies");

  res.status(200).send({ error: false, data: { messages } });
});

module.exports = router;
