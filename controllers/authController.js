const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  createToken,
  createTokenUser,
  attachCookieToResponse,
} = require("../utils/jwt");
const CUSTOMAPIERROR = require("../errors/customError");
const registerUser = async (req, res) => {
  const isFirstAcount = (await User.countDocuments()) == 0;
  req.body.role = isFirstAcount ? "admin" : "user";
  const user = await User.create(req.body);
  const tokenUser = createTokenUser(user);
  const token = await createToken({ payload: tokenUser });
  attachCookieToResponse({ res, token });
  res.status(StatusCodes.CREATED).json({ data: user });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CUSTOMAPIERROR(
      "Please Provide email & password",
      StatusCodes.BAD_REQUEST
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CUSTOMAPIERROR("email not found ", StatusCodes.NOT_FOUND);
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CUSTOMAPIERROR("wrong password", StatusCodes.BAD_REQUEST);
  }
  const tokenUser = createTokenUser(user);
  const token = await createToken({ payload: tokenUser });
  attachCookieToResponse({ res, token });
  res.status(StatusCodes.OK).json({ data: user });
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "logged out" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
