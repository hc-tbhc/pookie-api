const db = require("./db/connection");
const { setupTestDb } = require("./test-setup");
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

test("deleting a user also deletes their messages", async () => {
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
    ["hello pookus", testUserId]
  );

  await db.query(
    `INSERT INTO messages
    (message, user_id)
    VALUES ($1, $2);`,
    ["hello doogle", testUserId]
  );

  await db.query(
    `DELETE FROM users
    WHERE id = $1`,
    [testUserId]
  );

  const result = await db.query(
    `SELECT * FROM messages
    WHERE user_id = $1`,
    [testUserId]
  );

  expect(result.rows).toEqual([]);
});

afterAll(async () => {
  await db.end();
});
