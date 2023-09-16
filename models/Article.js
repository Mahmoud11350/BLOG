const { Schema, model, Types } = require("mongoose");

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    minlength: [5, "article content can't be less than 150 characters"],
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});
articleSchema.pre("save", function () {
  console.log("new article save hook");
});
articleSchema.pre("findOneAndUpdate", function () {
  console.log("user updated");
});

articleSchema.pre("findOneAndDelete", function () {
  console.log("delete hook");
});

module.exports = model("Article", articleSchema);
