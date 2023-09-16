const { Schema, model, Types } = require("mongoose");

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [5, "article content can't be less than 150 characters"],
    },
    body: {
      type: String,
      required: true,
      minlength: [5, "article content can't be less than 150 characters"],
    },
    image: {
      type: String,
    },
    numOfComments: {
      type: Number,
      required: true,
      default: 0,
    },
    numOfFavourites: {
      type: Number,
      required: true,
      default: 0,
    },
    author: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

articleSchema.pre("findOneAndDelete", async function () {
  await this.model("Comment").deleteMany({ article: this._id });
});
articleSchema.virtual("comments", {
  localField: "_id",
  foreignField: "article",
  ref: "Comment",
});

module.exports = model("Article", articleSchema);
