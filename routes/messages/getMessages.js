const express = require("express");
const router = express.Router();
const Message = require("../../schemas/message");

router.get("/", async (req, res) => {
  const messages = await Message.find()
    .populate("submittedBy", ["_id", "name", "email"])
    .populate({
      path: "replies",
      populate: { path: "submittedBy", select: ["_id", "name", "email"] }
    });

  res.status(200).send({ error: false, data: { messages } });
});

module.exports = router;
