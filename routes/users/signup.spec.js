const User = require("../../schemas/user");
const Reply = require("../../schemas/reply");
const Message = require("../../schemas/message");
const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
require("../../utils/connectToDatabase")();
const usersRoute = require("./index");
const app = express();
app.use(bodyParser.json());
app.use("/users", usersRoute);

describe("Test post /users route", () => {
  //add user with invalid information
  //invalid email
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //short password
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example",
        password: "abcd",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  //weak password
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example",
        password: "abcdefgh",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //too long name
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "Jooooooooooooooooooooohn Dooooooooooooooooeeeeeeeeeee",
        email: "test@example",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });
  //invalid email
  test("It should return 400 for malformed data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(400);
      });
  });

  //add user with good data, should work
  test("It should return 200 for correct data", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example.com",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
  // add the same user again
  test("It should return 409 for already existing emails", async () => {
    request(app)
      .post("/users/signup")
      .send({
        name: "John Doe",
        email: "test@example.com",
        password: "ABCD@abc",
      })
      .then((response) => {
        expect(response.statusCode).toBe(409);
      });
  });

  async function removeAllCollections() {
    await User.deleteMany({});
    await Reply.deleteMany({});
    await Message.deleteMany({});
  }
  afterAll(async () => {
    await removeAllCollections();
  });
});
