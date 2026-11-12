// ROUTE layer: map URL + HTTP method -> controller function (+ requireAuth where needed).
// No logic here.
import express, { Router } from "express";
import {
  getPostComments_get,
  createAComment_post,
  deletePostCommentById_delete,
} from "./comments.controller";
import { requireAuth } from "../../middleware/authMiddleware";

const commentsRouter: Router = express.Router();

commentsRouter.get("/user/posts/:id/comments", getPostComments_get);
commentsRouter.post(
  "/user/posts/:id/comments",
  requireAuth(),
  createAComment_post,
);
commentsRouter.delete(
  "/user/posts/:id/comments/:commentId",
  requireAuth(["ADMIN", "USER"]),
  deletePostCommentById_delete,
);

export default commentsRouter;
