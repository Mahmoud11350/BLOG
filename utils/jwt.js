const jwt = require("jsonwebtoken");
const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
  };
};

const createToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookieToResponse = ({ res, token }) => {
  return res.cookie("token", token, { signed: true, httpOnly: true });
};

module.exports = {
  createToken,
  verifyToken,
  createTokenUser,
  attachCookieToResponse,
};
