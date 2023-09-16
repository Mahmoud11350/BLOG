const { Schema, model, Types } = require("mongoose");
const CUSTOMAPIERROR = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

const commentSchema = new Schema({
  body: {
    type: String,
    required: [true, "please provide comment"],
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: Types.ObjectId,
    ref: "Article",
    required: true,
  },
});

commentSchema.statics.calculateComments = async function (articleId) {
  const result = await this.aggregate([
    { $match: { article: articleId } },
    { $group: { _id: null, numOfComments: { $sum: 1 } } },
  ]);
  return result;
};
commentSchema.statics.calculateFavourites = async function (articleId) {
  const result = await this.aggregate([
    { $match: { article: articleId } },
    {
      $group: {
        _id: "$isFavourite",
        numOfFavourites: { $sum: 1 },
      },
    },
  ]);

  return result;
};

commentSchema.pre("save", async function () {
  const result = await this.constructor.calculateComments(this.article);
  const isFavourites = await this.constructor.calculateFavourites(this.article);
  const numOfFavourites = isFavourites.filter((comment) => comment._id == true);
  await this.model("Article").findOneAndUpdate(
    { _id: this.article },
    {
      numOfComments: result[0]?.numOfComments || 0,
      numOfFavourites: numOfFavourites[0]?.numOfFavourites || 0,
    }
  );
});

commentSchema.post("deleteOne", { document: true }, async function () {
  const result = await this.constructor.calculateComments(this.article);
  const isFavourites = await this.constructor.calculateFavourites(this.article);
  const numOfFavourites = isFavourites.filter((comment) => comment._id == true);
  await this.model("Article").findOneAndUpdate(
    { _id: this.article },
    {
      numOfComments: result[0]?.numOfComments || 0,
      numOfFavourites: numOfFavourites[0]?.numOfFavourites || 0,
    }
  );
});
module.exports = model("Comment", commentSchema);
