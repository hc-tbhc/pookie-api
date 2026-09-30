const db = require("../db/connection");

async function fetchMessages() {
  const result = await db.query(
    `SELECT * FROM messages;`
  );

  return result.rows;
}

async function insertMessage(message) {
  const result = await db.query(
    `INSERT INTO messages
    (message)
    VALUES ($1)
    RETURNING *;`,
    [message]
  );

  return result.rows[0];
}

async function fetchMessageById(messageId) {
  const result = await db.query(
    `SELECT * FROM messages
    WHERE id = $1;`,
    [messageId]
  );

  return result.rows[0];
}

async function removeMessage(messageId) {
  const result = await db.query(
    `DELETE FROM messages
    WHERE id = $1
    RETURNING *;`,
    [messageId]
  );

  return result.rows[0];
}

module.exports = {
  fetchMessages,
  insertMessage,
  fetchMessageById,
  removeMessage
};