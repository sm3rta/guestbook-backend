const express = require("express");
const router = express.Router();

const addMessageRoute = require("./addMessage");
const editMessageRoute = require("./editMessage");
const deleteMessageRoute = require("./deleteMessage");
const getMessagesRoute = require("./getMessages");

router.use("/", addMessageRoute);
router.use("/", editMessageRoute);
router.use("/", deleteMessageRoute);
router.use("/", getMessagesRoute);

module.exports = router;
