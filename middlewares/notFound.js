const { StatusCodes } = require("http-status-codes");

const routeNotFound = (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({ err: "Route Not Found" });

module.exports = routeNotFound;
