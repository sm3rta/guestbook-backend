const express = require("express");
const router = express.Router();

const addReplyRoute = require("./addReply");
router.use("/", addReplyRoute);

module.exports = router;
