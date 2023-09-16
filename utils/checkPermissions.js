const { StatusCodes } = require("http-status-codes");
const CUSTOMAPIERROR = require("../errors/customError");

const checkPermissions = ({ signedUser, plainedId }) => {
  if (signedUser.role === "admin") return;
  if (plainedId == signedUser.userId) return;

  throw new CUSTOMAPIERROR(
    "not authorized to access this route ",
    StatusCodes.UNAUTHORIZED
  );
};

module.exports = checkPermissions;
