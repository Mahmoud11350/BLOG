const { Router } = require("express");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");
const commentRoutes = Router();

commentRoutes.post("/", createComment);
commentRoutes.route("/:id").patch(updateComment).delete(deleteComment);

module.exports = commentRoutes;
