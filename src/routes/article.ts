import express from "express";
import ArticleController from "../controllers/ArticleController";

const articleRouter = express.Router();
const articleController = new ArticleController();

articleRouter.get("/:id", articleController.getArticleById);
articleRouter.get("/", articleController.getAllArticles);
articleRouter.post("/", articleController.createArticle);
articleRouter.patch("/:id", articleController.updateArticle);
articleRouter.delete("/:id", articleController.deleteArticle);

export default articleRouter;
