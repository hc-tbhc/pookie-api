const { errorHandler } = require("./errors.middleware");

describe("errorHandler", () => {
  test("maps a foreign key violation to a 404 response", () => {
    const err = new Error("Referenced resource does not exist");
    err.code = "23503";

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found"
    });
  });

  test("giving an unmapped error gives back a 500 error", () => {
    const err = new Error("Error");

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error"
    });
  });
});
