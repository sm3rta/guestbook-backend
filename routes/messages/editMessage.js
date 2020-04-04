/**
 * @module
 * @description adds the edit Message route handler
 */
const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Message = require("../../schemas/message");

const messageSchema = Joi.object({
  content: Joi.string().min(3).max(500).required(),
});

/**
 * @method
 * @description verifies that a message with gived ID exists
 * @param {string} messageId message ID to check
 * @returns - if message exists, returns message object
 * - if not, returns null
 */

const checkThatMessageExists = async (messageId) => {
  const message = await Message.findById(messageId);
  return message;
};

router.patch(
  "/:messageId",
  /**
   * @callback addMessageRequestHandler
   * @description validates request data and sends
   * - 400 if data is invalid
   * - 200 if data is correct and the message is edited successfully
   */

  async (req, res) => {
    const validation = messageSchema.validate(req.body);
    if (validation.error) {
      return res
        .status(400)
        .send({ error: true, message: validation.error.message });
    }

    const messageId = req.params.messageId;
    const { content } = req.body;

    if (!(await checkThatMessageExists(messageId))) {
      return res
        .status(400)
        .send({ error: true, message: "Message ID doesn't exist" });
    }

    const editedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          content,
        },
      },
      { new: true }
    );

    res.status(200).send({
      error: false,
      message: "Message edited successfully",
      data: { editedMessage },
    });
  }
);

module.exports = router;
