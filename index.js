const express = require("express");
const app = express();

const usersRoute = require("./routes/users");

app.use("/users", usersRoute);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
