const db = require("../db/connection");
const { setupTestDb } = require("../test-setup");
const {
  insertMessage,
  fetchMessages,
  fetchMessageById,
  removeMessage,
  patchMessage
} = require("./messages.model");

beforeEach(async () => {
  await setupTestDb();
});

test("insertMessage returns a newly-created row when invoked with a message", async () => {
  const response = await insertMessage("hello pookie");

  expect(response).toEqual({
    id: 1, message: "hello pookie"
  });
});

test("fetchMessages retrieves all rows in messages", async () => {
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

  const result = await fetchMessages();

  expect(result).toEqual([
    { id: 1, message: "hello pookie" },
    { id: 2, message: "hello again" }
  ]);
});

test("fetchMessageById retrieves the row whose id matches the supplied id", async () => {
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

  const result = await fetchMessageById(2);

  expect(result).toEqual({
    id: 2,
    message: "hello again"
  });
});

describe("removeMessage", () => {
  test("an existing row is deleted and returned", async () => {
    await db.query(
      `INSERT INTO messages
      (message)
      VALUES ($1);`,
      ["hello pookie"]
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
      message: "hello pookie"
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
      (message)
      VALUES ($1);`,
      ["hello pookie"]
    );

    const expectedResponse = {
      id: 1,
      message: "hallo pookles"
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