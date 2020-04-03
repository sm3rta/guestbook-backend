const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Message = require("../../schemas/message");
const Reply = require("../../schemas/reply");

const replySchema = Joi.object({
  content: Joi.string()
    .min(3)
    .max(500)
    .required(),
  submittedBy: Joi.string().required(),
  messageId: Joi.string().required(),
  date: Joi.date()
});

router.post("/", async (req, res) => {
  const validation = replySchema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ error: true, message: validation.error.message });
  }

  const { content, submittedBy, messageId } = req.body;
  const reply = new Reply({
    content,
    submittedBy
  });
  const savedReply = await reply.save();
  console.log("savedReply", savedReply);
  const message = await Message.findById(messageId);
  message.replies.push(savedReply._id);
  const savedMessage = await message.save();
  console.log("savedMessage", savedMessage);
  res.status(200).send({ error: false, message: "Reply added successfully" });
});

module.exports = router;
