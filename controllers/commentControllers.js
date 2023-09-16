const Comment = require("../models/Comments");
const Article = require("../models/Article");
const CUSTOMAPIERROR = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const createComment = async (req, res) => {
  req.body.author = req.user.userId;
  const article = await Article.findOne({ _id: req.body.article });
  if (!article) {
    throw new CUSTOMAPIERROR(
      `no article found with id ${req.body.article}`,
      StatusCodes.NOT_FOUND
    );
  }

  const comment = await Comment.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: comment });
};

const deleteComment = async (req, res) => {
  let comment = await Comment.findOne({
    _id: req.params.id,
  });
  if (!comment) {
    throw new CUSTOMAPIERROR(
      `no comment found with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  await comment.deleteOne();
  res.status(StatusCodes.OK).json({ data: comment });
};

const updateComment = async (req, res) => {
  let comment = await Comment.findOne({
    _id: req.params.id,
  });
  if (!comment) {
    throw new CUSTOMAPIERROR(
      `no comment found with id ${req.params.id}`,
      StatusCodes.NOT_FOUND
    );
  }
  comment = await Comment.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(StatusCodes.OK).json({ data: comment });
};

module.exports = { createComment, deleteComment, updateComment };
