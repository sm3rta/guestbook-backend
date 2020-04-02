const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");
const Message = require("../../schemas/message");

const messageSchema = Joi.object({
  content: Joi.string()
    .min(3)
    .max(500)
    .required(),
  submittedBy: Joi.string().required(),
  date: Joi.date()
});

router.put("/:messageId", async (req, res) => {
  const validation = messageSchema.validate(req.body);
  if (validation.error) {
    return res
      .status(400)
      .send({ error: true, message: validation.error.message });
  }

  const messageId = req.params.messageId;
  const { content } = req.body;

  const editedMessage = await Message.findByIdAndUpdate(
    messageId,
    {
      $set: {
        content
      }
    },
    { new: true }
  );

  res.status(200).send({
    error: false,
    message: "Message edited successfully",
    data: { editedMessage }
  });
});

module.exports = router;
