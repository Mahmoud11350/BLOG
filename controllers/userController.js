const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const checkPermissions = require("../utils/checkPermissions");
const CUSTOMAPIERROR = require("../errors/customError");

const getAllusers = async (req, res) => {
  const signedUser = req.user;
  checkPermissions({ signedUser, plainedId: null });
  const users = await User.find();
  res.status(StatusCodes.OK).json({ date: users });
};

const getUser = async (req, res) => {
  const signedUser = req.user;
  const user = await User.findOne({ _id: req.params.id });
  checkPermissions({ signedUser, plainedId: req.params.id });
  res.status(StatusCodes.OK).json({ date: user });
};
const updateUser = async (req, res) => {
  let user = await User.findOne({ _id: req.params.id });
  if (!user) {
    throw new CUSTOMAPIERROR("user not found", StatusCodes.NOT_FOUND);
  }

  const signedUser = req.user;

  checkPermissions({ signedUser, plainedId: req.params.id });

  user = await User.findByIdAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(StatusCodes.OK).json({ data: user });
};

const deleteUser = async (req, res) => {
  let user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    throw new CUSTOMAPIERROR("user not found", StatusCodes.NOT_FOUND);
  }

  const signedUser = req.user;

  checkPermissions({ signedUser, plainedId: req.params.id });
  // user = await User.findOneAndRemove({ _id: req.params.id });
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ data: user });
};

module.exports = { getAllusers, getUser, deleteUser, updateUser };
