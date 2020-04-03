const express = require("express");
const app = express();
const cors = require("cors");

//enable cors
app.use(cors());

//simulate loading
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

app.use(async function(req, res, next) {
  await sleep(1000);
  next();
});

//use body parser to parse request body
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "*/*" }));

//import subroutes
const usersRoute = require("./routes/users");
const messagesRoute = require("./routes/messages");
const repliesRoute = require("./routes/replies");
//add subroutes to the application
app.use("/users", usersRoute);
app.use("/messages", messagesRoute);
app.use("/replies", repliesRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
