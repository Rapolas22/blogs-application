import express, { Router, Request, Response } from "express";
import {
  homePagePosts_get,
  postCreation_post,
  postRemove_delete,
  getPostById_get,
  updateProduct_patch,
} from "../controller/postController";
import { requireAuth } from "../middleware/authMiddleware";

const postsRouter: Router = express.Router();

postsRouter.get("/getPosts", requireAuth, homePagePosts_get);
postsRouter.post("/postCreation", requireAuth, postCreation_post);
postsRouter.delete("/post/remove/:id", requireAuth, postRemove_delete);
postsRouter.get("/getPosts/:id", requireAuth, getPostById_get);
postsRouter.patch("/products/:id", requireAuth, updateProduct_patch);

export default postsRouter;
