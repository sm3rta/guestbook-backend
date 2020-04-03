const express = require("express");
const router = express.Router();
const Message = require("../../schemas/message");
const Reply = require("../../schemas/reply");

router.delete("/:messageId", async (req, res) => {
  const messageId = req.params.messageId;

  const messageDeletionResult = await Message.findByIdAndDelete(messageId);
  messageDeletionResult.replies.forEach(replyId =>
    Reply.findByIdAndDelete(replyId)
  );
  console.log("messageDeletionResult", messageDeletionResult);

  if (messageDeletionResult) {
    res.status(200).send({
      error: false,
      message: "Message deleted successfully"
    });
  } else {
    res.status(400).send({
      error: true,
      message: "Message to be deleted doesn't exist"
    });
  }
});

module.exports = router;
