const { StatusCodes } = require("http-status-codes");
const Article = require("../models/Article");
const CUSTOMAPIERROR = require("../errors/customError");
const checkPermission = require("../utils/checkPermissions");
const cloudinary = require("cloudinary").v2;
const Comment = require("../models/Comments");
const createArticle = async (req, res) => {
  req.body.author = req.user.userId;
  let result;
  let image;
  if (req.files) {
    image = req.files.image;
    const imagePath = image.tempFilePath;
    if (!image.mimetype.startsWith("image")) {
      throw new CUSTOMAPIERROR("please provide image", StatusCodes.BAD_REQUEST);
    }
    result = await cloudinary.uploader.upload(imagePath, {
      folder: "blog",
      use_filename: true,
      public_id: image.name,
    });
    req.body.image = result.secure_url;
  }

  const article = await Article.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: article });
};
const getArticle = async (req, res) => {
  const articleId = req.params.id;
  const article = await Article.findOne({ _id: articleId })
    .populate({
      path: "author",
      select: "name bio",
    })
    .populate("comments");
  if (!article) {
    throw new CUSTOMAPIERROR(`no article found with id ${articleId}`);
  }
  res.status(StatusCodes.OK).json({ data: article });
};
const getAllArticles = async (req, res) => {
  const articles = await Article.find().sort("createdAt").populate({
    path: "author",
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
  let article = await Article.findOne({ _id: articleId });
  if (!article) {
    throw new CUSTOMAPIERROR(`no article found with id ${articleId}`);
  }
  checkPermission({ signedUser: req.user, plainedId: req.user.userId });

  article = await Article.findOneAndDelete({ _id: articleId });
  res.status(StatusCodes.OK).json({ msg: "article deleted successfully " });
};

const getUserArticles = async (req, res) => {
  const articles = await Article.find({ author: req.params.id });
  if (!articles) {
    throw new CUSTOMAPIERROR("this user didn't create any article yet");
  }
  res.status(StatusCodes.OK).json({ data: articles });
};

const getFavouriteArticles = async (req, res) => {
  const favourites = await Comment.find({
    author: req.user.userId,
    isFavourite: true,
  });

  let favArticles = [];

  favArticles = favourites.map(
    async (fav) => await Article.findOne({ _id: fav.author })
  );
  console.log(favArticles);
  res.send(favArticles);
};
// const uploadArticleImage = async (req, res) => {
//   const image = req.files.image;
//   const imagePath = image.tempFilePath;
//   if (!image.mimetype.startsWith("image")) {
//     throw new CUSTOMAPIERROR("please provide image", StatusCodes.BAD_REQUEST);
//   }
//   const result = await cloudinary.uploader.upload(imagePath, {
//     folder: "blog",
//     use_filename: true,
//     public_id: image.name,
//   });
//   res.status(StatusCodes.ACCEPTED).json({ data: { src: result.secure_url } });
// };

module.exports = {
  createArticle,
  getArticle,
  getAllArticles,
  updateArtacle,
  deleteArticle,
  getUserArticles,
  getFavouriteArticles,
  // uploadArticleImage,
};
