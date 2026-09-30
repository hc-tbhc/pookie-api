const db = require("./db/connection");
const { setupTestDb } = require("./test-setup");
const request = require("supertest");
const app = require("./app");

beforeEach(async () => {
  await setupTestDb();
});

describe("GET /messages", () => {
  test("responds with all rows from the messages table", async () => {
    await db.query(
      `INSERT INTO messages
      (message)
      VALUES ($1);`,
      ["hello pookie"]
    );
  
    await db.query(
      `INSERT INTO messages
      (message)
      VALUES ($1);`,
      ["hello again"]
    );
  
    const response = await request(app)
      .get("/messages");
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      messages: [
        { id: 1, message: "hello pookie" },
        { id: 2, message: "hello again" }
      ]
    });
  });

  test("responds with message object whose id matches the supplied id", async () => {
    await db.query(
      `INSERT INTO messages
      (message)
      VALUES ($1);`,
      ["hello pookie"]
    );
  
    await db.query(
      `INSERT INTO messages
      (message)
      VALUES ($1);`,
      ["hello again"]
    );
  
    const response = await request(app)
      .get("/messages/2");
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: { id: 2, message: "hello again" }
    });
  });

  test("responds with 400 'Invalid message ID' when supplied with a malformed message ID", async () => {
    const response = await request(app)
      .get("/messages/banana");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid message ID"
    });
  });

  test("responds with 404 'Message not found' when the chosen message does not exist", async () => {
    const response = await request(app)
      .get("/messages/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Message not found"
    });
  });
});

describe("POST /messages", () => {
  test("posting a valid message responds with 201 and the newly created message row", async () => {
    const response = await request(app)
      .post("/messages")
      .send({
        message: "hello pookie"
      });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual({
      id: 1,
      message: "hello pookie"
    });
  });
  
  test("invalid messages are not added to the database", async () => {
    const response = await request(app)
      .post("/messages")
      .send({
        message: "     "
      });
  
    const result = await db.query(
      `SELECT * FROM messages;`
    );
  
    expect(result.rows).toEqual([]);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Message must be a non-empty string"
    });
  });
});

afterAll(async () => {
  await db.end();
});