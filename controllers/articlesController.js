const { StatusCodes } = require("http-status-codes");
const Article = require("../models/Article");
const CUSTOMAPIERROR = require("../errors/customError");
const checkPermission = require("../utils/checkPermissions");
const createArticle = async (req, res) => {
  req.body.user = req.user.userId;
  const article = await Article.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: article });
};
const getArticle = async (req, res) => {
  const articleId = req.params.id;
  const article = await Article.findOne({ _id: articleId }).populate({
    path: "user",
    select: "name bio",
  });
  if (!article) {
    throw new CUSTOMAPIERROR(`no article found with id ${articleId}`);
  }
  res.status(StatusCodes.OK).json({ data: article });
};
const getAllArticles = async (req, res) => {
  const articles = await Article.find().populate({
    path: "user",
    select: "name",
  });
  if (!articles) {
    throw new CUSTOMAPIERROR(`no articles created yet`);
  }
  res.status(StatusCodes.OK).json({ data: articles });
};
const updateArtacle = async (req, res) => {
  const articleId = req.params.id;
  let article = await Article.findOne({ _id: articleId }).populate({
    path: "user",
    select: "name bio",
  });
  if (!article) {
    throw new CUSTOMAPIERROR(`no article found with id ${articleId}`);
  }
  checkPermission({ signedUser: req.user, plainedId: req.user.userId });
  article = await Article.findOneAndUpdate({ _id: articleId }, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(StatusCodes.OK).json({ data: article });
};

const deleteArticle = async (req, res) => {
  const articleId = req.params.id;
  let article = await Article.findOne({ _id: articleId }).populate({
    path: "user",
    select: "name bio",
  });
  if (!article) {
    throw new CUSTOMAPIERROR(`no article found with id ${articleId}`);
  }
  checkPermission({ signedUser: req.user, plainedId: req.user.userId });

  article = await Article.findOneAndDelete({ _id: articleId });
  res.status(StatusCodes.OK).json({ msg: "article deleted successfully " });
};

module.exports = {
  createArticle,
  getArticle,
  getAllArticles,
  updateArtacle,
  deleteArticle,
};
