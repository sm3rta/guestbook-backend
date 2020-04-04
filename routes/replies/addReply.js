/**
 * @module
 * @description adds the add reply route handler
 */
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Message = require("../../schemas/message");
const Reply = require("../../schemas/reply");
const User = require("../../schemas/user");

const replySchema = Joi.object({
  content: Joi.string().min(3).max(500).required(),
  submittedBy: Joi.string().required(),
  messageId: Joi.string().required(),
  date: Joi.date(),
});

router.post(
  "/",
  /**
   * @callback addReplyRequestHandler
   * @description validates request data and sends
   * - 400 if data is invalid
   * - 200 if data is correct and the reply object is added successfully
   */
  async (req, res) => {
    const validation = replySchema.validate(req.body);
    if (validation.error) {
      return res
        .status(400)
        .send({ error: true, message: validation.error.message });
    }

    const { content, submittedBy, messageId } = req.body;

    const message = await Message.findById(messageId);
    const user = await User.findById(submittedBy);

    if (!message)
      return res
        .status(400)
        .send({ error: true, message: "Message ID doesn't exist" });
    if (!user)
      return res
        .status(400)
        .send({ error: true, message: "User ID doesn't exist" });

    const reply = new Reply({
      content,
      submittedBy,
    });
    const savedReply = await reply.save();

    message.replies.push(savedReply._id);
    await message.save();

    res.status(200).send({ error: false, message: "Reply added successfully" });
  }
);

module.exports = router;
