const { StatusCodes } = require("http-status-codes");
const CUSTOMAPIERROR = require("../errors/customError");
const { verifyToken } = require("../utils/jwt");

const authanticatedUser = (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CUSTOMAPIERROR("not valid token", StatusCodes.BAD_REQUEST);
  }
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authanticatedUser;
