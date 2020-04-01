const express = require("express");
const router = express.Router();

const signupRoute = require("./signup");
const signinRoute = require("./signin");

router.use("/signup", signupRoute);
router.use("/signin", signinRoute);
module.exports = router;
