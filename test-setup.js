const db = require("./db/connection");

async function setupTestDb() {
  await db.query(
    `DROP TABLE IF EXISTS messages;`
  );

  await db.query(
    `DROP TABLE IF EXISTS users;`
  );

  await db.query(
    `CREATE TABLE users (
      id INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
      username TEXT UNIQUE NOT NULL
    );`
  );

  await db.query(
    `CREATE TABLE messages (
      id INTEGER
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,
      message TEXT NOT NULL,
      user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE
    );`
  );
}

module.exports = {
  setupTestDb
};