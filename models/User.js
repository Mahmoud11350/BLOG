const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "please provide your name"],
      trim: true,
      minlength: 3,
      maxlength: 15,
    },
    bio: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      trim: true,
      unique: [true, "email is already in use"],
      validate: {
        validator: validator.isEmail,
        message: "please provide valid email adress ",
      },
    },
    password: {
      type: String,
      required: [true, "please provide strong password "],
      minlength: [6, "password can't be less than 6 character"],
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],

      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
});
userSchema.methods.comparePassword = async function (plainPassword) {
  const isPasswordCorrect = await bcrypt.compare(plainPassword, this.password);
  return isPasswordCorrect;
};
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = model("User", userSchema);
