const { validateMessage, validateMessageId, validateUserId } = require("./messages.middleware");

test("validateMessage succeeds when passed a valid message", () => {
  const req = {
    body: {
      message: "hello pookie"
    }
  };
  const res = {};
  const next = jest.fn();

  validateMessage(req, res, next);

  expect(next).toHaveBeenCalled();
});

test.each([
  "",
  "     ",
  123,
  null,
  undefined,
  ["hello"]
])("validateMessage responds with 400 when passed an invalid message", (invalidMessage) => {
  const req = {
    body: {
      message: invalidMessage
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  validateMessage(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Message must be a non-empty string"
  });
});

test("validateMessage responds with 400 when there is no request body", () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  validateMessage(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Message must be a non-empty string"
  });
});

test.each([
  "banana",
  "2.5",
  "0",
  "-3"
])("responds with 'Invalid message ID' when supplied with an invalid messageId", (messageId) => {
  const req = {
    params: {
      messageId
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  validateMessageId(req, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    message: "Invalid message ID"
  });
});

test("validation succeeds when supplied with a valid message ID", () => {
  const req = {
    params: {
      messageId: "2"
    }
  };
  const res = {};
  const next = jest.fn();

  validateMessageId(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(req.params.messageId).toBe(2);
});

describe("validateUserId", () => {
  test("validation succeeds when supplied with a valid user ID", () => {
    const req = {
      body: {
        userId: "1"
      }
    };
    const res = {
      status: jest.fn(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateUserId(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(req.body.userId).toBe(1);
  });

  test.each(
    ["banana", "-2", "2.5", ""]
  )("validation responds with status 400 when supplied with invalid user ID", (userId) => {
    const req = {
      body: {
        userId
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    validateUserId(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid user ID"
    });
  });
});
