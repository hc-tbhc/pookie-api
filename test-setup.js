const db = require("./db/connection");

async function setupTestDb() {
  await db.query(
    `DROP TABLE IF EXISTS
    messages;`
  );

  await db.query(
    `CREATE TABLE messages
    (id INTEGER
    GENERATED ALWAYS AS
    IDENTITY PRIMARY KEY,
    message TEXT NOT NULL);`
  );
}

module.exports = {
  setupTestDb
};