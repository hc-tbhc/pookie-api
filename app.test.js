const db = require("./db/connection");
const { setupTestDb } = require("./test-setup");
const request = require("supertest");
const app = require("./app");
let testUserId;

beforeEach(async () => {
  await setupTestDb();

  const testUser = await db.query(
    `INSERT INTO users
    (username)
    VALUES ($1)
    RETURNING *;`,
    ["pookie"]
  );

  testUserId = testUser.rows[0].id;
});

describe("GET /messages", () => {
  test("responds with all rows from the messages table", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );
  
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello again", testUserId]
    );
  
    const response = await request(app)
      .get("/messages");
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      messages: [
        { id: 1, message: "hello pookie", user_id: testUserId },
        { id: 2, message: "hello again", user_id: testUserId }
      ]
    });
  });

  test("responds with message object whose id matches the supplied id", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );
  
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello again", testUserId]
    );
  
    const response = await request(app)
      .get("/messages/2");
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: {
        id: 2,
        message: "hello again",
        user_id: testUserId
      }
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
        message: "hello pookie",
        userId: testUserId
      });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toEqual({
      id: 1,
      message: "hello pookie",
      user_id: testUserId
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

  test("returns 404 when the supplied user does not exist", async () => {
    const response = await request(app)
      .post("/messages")
      .send({
        message: "hello nobody",
        userId: 999999
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found"
    });
  });
});

describe("DELETE /messages", () => {
  test("an existing message gets deleted", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );

    const response = await request(app)
      .delete("/messages/1");

    const dbResult = await db.query(
      `SELECT * FROM messages
      WHERE id = $1;`,
      [1]
    );

    expect(dbResult.rows).toEqual([]);
    expect(response.status).toBe(204);
  });

  test("request with invalid message ID gets 400 'Invalid message ID'", async () => {
    const response = await request(app)
      .delete("/messages/banana");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid message ID"
    });
  });

  test("attempting to delete a nonexistent message gets 404 'Message not found'", async () => {
    const response = await request(app)
      .delete("/messages/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Message not found"
    });
  });
});

describe("PATCH /messages", () => {
  test("an existing message gets updated and returned", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );

    const expectedResponse = {
      id: 1,
      message: "hallo pookles",
      user_id: testUserId
    };

    const response = await request(app)
      .patch("/messages/1")
      .send({
        message: "hallo pookles"
      });

    const dbResult = await db.query(
      `SELECT * FROM messages
      WHERE id = $1;`,
      [1]
    );

    expect(response.status).toBe(200);
    expect(dbResult.rows[0]).toEqual(expectedResponse);
    expect(response.body).toEqual({
      message: expectedResponse
    });
  });

  test("request with malformed message ID receives 400 'Invalid message ID'", async () => {
    const response = await request(app)
      .patch("/messages/banana")
      .send({
        message: "hallo pookles"
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid message ID"
    });
  });

  test("attempt to update nonexistent message gets 404 'Message not found'", async () => {
    const response = await request(app)
      .patch("/messages/99999")
      .send({
        message: "hallo pookles"
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Message not found"
    });
  });

  test("attempt to update message with malformed body gets 400 error", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );

    const response = await request(app)
      .patch("/messages/1")
      .send({
        message: "     "
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Message must be a non-empty string"
    });
  });
});

afterAll(async () => {
  await db.end();
});
