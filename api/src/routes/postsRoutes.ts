import express, { Router, Request, Response } from "express";
import {
  homePagePosts_get,
  postCreation_post,
  postRemove_delete,
} from "../controller/postController";
import { requireAuth } from "../middleware/authMiddleware";

const postsRouter: Router = express.Router();

postsRouter.get("/getPosts", requireAuth, homePagePosts_get);
postsRouter.post("/postCreation", requireAuth, postCreation_post);
postsRouter.delete("/post/remove/:id", requireAuth, postRemove_delete);

export default postsRouter;
