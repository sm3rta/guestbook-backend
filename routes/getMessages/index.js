/**
 * @module
 * @description adds the get Messages route handler
 */
const express = require("express");
const router = express.Router();
const Message = require("../../schemas/message");

router.get(
  "/",
  /**
   * @callback getMessagesRequestHandler
   * @description sends all the messages with a 200 status code
   */
  async (req, res) => {
    const messages = await Message.find()
      .populate("submittedBy", ["_id", "name", "email"])
      .populate({
        path: "replies",
        populate: { path: "submittedBy", select: ["_id", "name", "email"] },
      })
      .sort({ date: -1 });

    res.status(200).send({ error: false, data: { messages } });
  }
);

module.exports = router;
