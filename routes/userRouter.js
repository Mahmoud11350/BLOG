const { Router } = require("express");
const authanticatedUser = require("../middlewares/authMiddleware");
const {
  getUser,
  updateUser,
  deleteUser,
  getAllusers,
} = require("../controllers/userController");

const userRoutes = Router();

userRoutes.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
userRoutes.route("/users/all").get(getAllusers);

module.exports = userRoutes;
