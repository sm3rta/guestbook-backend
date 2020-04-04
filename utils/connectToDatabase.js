const mongoose = require("mongoose");
const dbPath = "mongodb://localhost/guestbook";

/**
 * @method
 * @description attempts to connect to the database
 */
const connectToDatabase = () => {
  mongoose
    .connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to database successfully.");
    })
    .catch(() => {
      console.error("Couldn't connect to database.");
    });
};

module.exports = connectToDatabase;
