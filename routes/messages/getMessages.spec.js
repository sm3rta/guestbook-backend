const userSchema = require("../../schemas/user");
const replySchema = require("../../schemas/reply");
const messageSchema = require("../../schemas/message");
const request = require("supertest");
const express = require("express");

const messagesRoute = require("./index");
const app = express();
app.use("/messages", messagesRoute);

describe("Test get /messages route", () => {
  test("It should return messages with status code 200", () => {
    request(app)
      .get("/messages")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
