const db = require("../db/connection");
const { setupTestDb } = require("../test-setup");
const {
  insertMessage,
  fetchMessages,
  fetchMessageById,
  removeMessage,
  patchMessage
} = require("./messages.model");
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

describe("insertMessage", () => {
  test("creates and returns a new message under the supplied user ID", async () => {
    const response = await insertMessage(
      "hello pookie",
      testUserId
    );

    expect(response).toEqual({
      id: 1,
      message: "hello pookie",
      user_id: testUserId
    });
  });

  test("rejects with a foreign key violation when supplied user ID doesn't exist", async () => {
    await expect(
      insertMessage("hello nobody", 999999)
    ).rejects.toMatchObject({
      code: "23503"
    });
  });
});

test("fetchMessages retrieves all rows in messages", async () => {
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

  const result = await fetchMessages();

  expect(result).toEqual([
    { id: 1, message: "hello pookie", user_id: testUserId },
    { id: 2, message: "hello again", user_id: testUserId }
  ]);
});

test("fetchMessageById retrieves the row whose id matches the supplied id", async () => {
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

  const result = await fetchMessageById(2);

  expect(result).toEqual({
    id: 2,
    message: "hello again",
    user_id: testUserId
  });
});

describe("removeMessage", () => {
  test("an existing row is deleted and returned", async () => {
    await db.query(
      `INSERT INTO messages
      (message, user_id)
      VALUES ($1, $2);`,
      ["hello pookie", testUserId]
    );

    const result = await removeMessage(1);

    const dbResult = await db.query(
      `SELECT * FROM messages
       WHERE id = $1;`,
      [1]
    );

    expect(dbResult.rows).toEqual([]);
    expect(result).toEqual({
      id: 1,
      message: "hello pookie",
      user_id: testUserId
    });
  })

  test("a valid nonexistent ID returns undefined without throwing", async () => {
    const result = await removeMessage(999999);

    expect(result).toBe(undefined);
  })
});

describe("patchMessage", () => {
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

    const result = await patchMessage(1, "hallo pookles");

    const dbResult = await db.query(
      `SELECT * FROM messages
      WHERE id = $1`,
      [1]
    );

    expect(result).toEqual(expectedResponse);
    expect(dbResult.rows[0]).toEqual(expectedResponse);
  });

  test("attempting to update a nonexistent message returns undefined", async () => {
    const result = await patchMessage(999999, "hallo pookles");

    expect(result).toBe(undefined);
  });
});

afterAll(async () => {
  await db.end();
});