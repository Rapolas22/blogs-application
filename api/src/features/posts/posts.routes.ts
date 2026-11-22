import express, { Router } from "express";

import {
  homePagePosts_get,
  postCreation_post,
  postRemove_delete,
  getPostById_get,
  updateProduct_patch,
  userPagePostsFetch_get,
  userPageGetSinglePost_get,
} from "./posts.controller";

import { requireAuth } from "../../middleware/authMiddleware";

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
postsRouter.get(
  "/user/posts/:id",
  requireAuth(["ADMIN", "USER"]),
  userPageGetSinglePost_get,
);

export default postsRouter;
