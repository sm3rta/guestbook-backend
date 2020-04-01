const express = require("express");
const router = express.Router();

const addMessageRoute = require("./addMessage");
const editMessageRoute = require("./editMessage");
const deleteMessageRoute = require("./deleteMessage");

router.use("/", addMessageRoute);
router.use("/", editMessageRoute);
router.use("/", deleteMessageRoute);

module.exports = router;
