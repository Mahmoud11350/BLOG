const { StatusCodes } = require("http-status-codes");

const errorsHandler = (err, req, res, next) => {
  let customError = {
    errorMsg: err.message || "something went wrong please try again later",
    status: err.statusCode || 500,
  };
  if (err && err.name === "ValidationError") {
    customError.errorMsg = Object.keys(err.errors)
      .map((msg) => err.errors[msg].message)
      .join(" & ");
    customError.status = StatusCodes.BAD_REQUEST;
  }
  if (err && err.code == 11000) {
    customError.errorMsg = "email already in use please login ";
    customError.status = StatusCodes.BAD_REQUEST;
  }
  if (err && err.name === "CastError") {
    customError.errorMsg = "please provide valid id";
    customError.status = StatusCodes.BAD_REQUEST;
  }

  return res.status(customError.status).json({ error: customError.errorMsg });
  return res.send(err);
};

module.exports = errorsHandler;
