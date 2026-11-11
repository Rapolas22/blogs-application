import express, { Router, Request, Response } from "express";
import {
  homePagePosts_get,
  postCreation_post,
  postRemove_delete,
  getPostById_get,
  updateProduct_patch,
  userPagePostsFetch_get,
  userPageGetSinglePost_get,
  deletePostCommentById_delete,
  getPostComments_get,
  createAComment_post,
} from "../controller/postController";
import { requireAuth } from "../middleware/authMiddleware";

const postsRouter: Router = express.Router();

postsRouter.get("/getPosts", requireAuth(["ADMIN"]), homePagePosts_get);
postsRouter.post("/postCreation", requireAuth(["ADMIN"]), postCreation_post);
postsRouter.delete(
  "/post/remove/:id",
  requireAuth(["ADMIN"]),
  postRemove_delete,
);
postsRouter.get("/getPosts/:id", requireAuth(["ADMIN"]), getPostById_get);
postsRouter.patch(
  "/patchPosts/:id",
  requireAuth(["ADMIN"]),
  updateProduct_patch,
);

postsRouter.get("/user/posts", userPagePostsFetch_get);
postsRouter.get("/user/posts/:id", userPageGetSinglePost_get);
postsRouter.get("/user/posts/:id/comments", getPostComments_get);
postsRouter.post(
  "/user/posts/:id/comments",
  requireAuth(),
  createAComment_post,
);
postsRouter.delete(
  "/user/posts/:id/comments/:commentId",
  requireAuth(["ADMIN", "USER"]),
  deletePostCommentById_delete,
);

export default postsRouter;
