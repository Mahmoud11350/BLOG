const { Router } = require("express");
const {
  getAllArticles,
  createArticle,
  getArticle,
  updateArtacle,
  deleteArticle,
  getUserArticles,
  getFavouriteArticles,
  // uploadArticleImage,
} = require("../controllers/articlesController");

const articlesRoutes = Router();

articlesRoutes.route("/").get(getAllArticles).post(createArticle);

articlesRoutes
  .route("/:id")
  .get(getArticle)
  .patch(updateArtacle)
  .delete(deleteArticle);

// articlesRoutes.post("/image", uploadArticleImage);

articlesRoutes.get("/user/:id", getUserArticles);
articlesRoutes.get("/favourites/articles", getFavouriteArticles);

module.exports = articlesRoutes;
