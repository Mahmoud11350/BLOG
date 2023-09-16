const { Router } = require("express");
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArtacle,
  deleteArticle,
} = require("../controllers/articlesController");

const articlesRoutes = Router();

articlesRoutes.route("/").get(getAllArticles).post(createArticle);
articlesRoutes
  .route("/:id")
  .get(getArticle)
  .patch(updateArtacle)
  .delete(deleteArticle);

module.exports = articlesRoutes;
