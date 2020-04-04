const userSchema = require("../../schemas/user");
const replySchema = require("../../schemas/reply");
const messageSchema = require("../../schemas/message");
const request = require("supertest");
const express = require("express");

const messagesRoute = require("./index");
const app = express();
app.use("/messages", messagesRoute);

describe("Test the /messages path", () => {
  test("It should response the GET method", () => {
    request(app)
      .get("/messages")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
