const express = require("express");
const app = express();

//use body parser to parse request body
const bodyParser = require("body-parser");
app.use(bodyParser.json({ type: "*/*" }));

//import subroutes
const usersRoute = require("./routes/users");

//add subroutes to the application
app.use("/users", usersRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
