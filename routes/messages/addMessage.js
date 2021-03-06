/**
 * @module
 * @description adds the add Message route handler
 */
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Message = require("../../schemas/message");
const User = require("../../schemas/user");

const messageSchema = Joi.object({
  content: Joi.string().min(3).max(500).required(),
  date: Joi.date(),
});
/**
 * @method
 * @description verifies that a user with gived ID exists
 * @param {string} userId user ID to check
 * @returns - if user exists, returns user object
 * - if not, returns null
 */
const verifyThatUserExists = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

router.post(
  "/",
  /**
   * @callback addMessageRequestHandler
   * @description validates request data and sends
   * - 400 if data is invalid
   * - 200 if data is correct and the message has been saved successfully
   */
  async (req, res) => {
    const validation = messageSchema.validate(req.body);
    if (validation.error) {
      return res
        .status(400)
        .send({ error: true, message: validation.error.message });
    }

    const { content } = req.body;
    const { _id: submittedBy } = req.user;

    const user = await verifyThatUserExists(submittedBy);

    if (!user) {
      return res
        .status(401)
        .send({ error: true, message: "User doesn't exist" });
    }

    const message = new Message({
      content,
      submittedBy,
      replies: [],
    });
    const result = await message.save();
    res
      .status(200)
      .send({ error: false, message: "Message added successfully" });
  }
);

module.exports = router;
