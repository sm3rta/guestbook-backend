/**
 * @module
 * @description adds the delete Message route handler
 */
const express = require("express");
const router = express.Router();
const Message = require("../../schemas/message");
const Reply = require("../../schemas/reply");

router.delete(
  "/:messageId",
  /**
   * @callback deleteMessageRequestHandler
   * @description sends
   * - 400 if the message doesn't exist
   * - 200 if the message is deleted successfully
   */
  async (req, res) => {
    const messageId = req.params.messageId;

    const messageDeletionResult = await Message.findByIdAndDelete(messageId);

    if (!messageDeletionResult) {
      return res.status(400).send({
        error: true,
        message: "Message to be deleted doesn't exist",
      });
    }

    messageDeletionResult.replies.forEach((replyId) =>
      Reply.findByIdAndDelete(replyId)
    );

    res.status(200).send({
      error: false,
      message: "Message deleted successfully",
    });
  }
);

module.exports = router;
