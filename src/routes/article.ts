import express from "express";
import ArticleController from "../controllers/ArticleController";
import MiddlewareController from "../controllers/MiddlewareController";

// This is the route for the article, it is a protected route that only an admin can access
const articleRouter = express.Router();
const articleController = new ArticleController();
const middlewareController = new MiddlewareController();

articleRouter.get("/size", articleController.getArticleSize);
articleRouter.get("/deleted/size", articleController.getDeletedArticleSize);
articleRouter.get(
  "/deleted",
  middlewareController.verifyAdminToken,
  articleController.getDeletedArticles,
);
articleRouter.get("/:id", articleController.getArticleById);
articleRouter.get("/", articleController.getAllArticles);
articleRouter.post(
  "/",
  middlewareController.verifyAdminToken,
  articleController.createArticle,
);
articleRouter.patch(
  "/:id/soft-delete",
  middlewareController.verifyAdminToken,
  articleController.softDeleteArticle,
);
articleRouter.patch(
  "/:id/viewed",
  articleController.increaseViewed,
);
articleRouter.patch(
  "/:id/restore",
  middlewareController.verifyAdminToken,
  articleController.restoreArticle,
);
articleRouter.patch(
  "/:id",
  middlewareController.verifyAdminToken,
  articleController.updateArticle,
);
articleRouter.delete(
  "/:id",
  middlewareController.verifyAdminToken,
  articleController.deleteArticle,
);

export default articleRouter;
