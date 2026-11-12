// CONTROLLER layer: read req (params, body, res.locals), call the service, send res.
// No try/catch: anything thrown here goes to middleware/errorHandler.ts (Express 5 does that for async handlers).
import { Request, Response } from "express";
import { HttpError } from "../../lib/HttpError";
import {
  getCommentsByPostId,
  getCommentById,
  deleteComment,
  createComment,
} from "./comments.service";
import { commentSchema } from "./comments.schema";

export const getPostComments_get = async (req: Request, res: Response) => {
  const comments = await getCommentsByPostId(Number(req.params.id));

  res.status(200).json(comments);
};

export const deletePostCommentById_delete = async (
  req: Request,
  res: Response,
) => {
  const commentId = Number(req.params.commentId);
  const comment = await getCommentById(commentId);

  if (!comment) throw new HttpError(404, "Comment not found");

  if (comment.userId !== res.locals.userId) {
    throw new HttpError(403, "Forbidden");
  }

  await deleteComment(commentId);

  res.status(200).json(comment);
};

export const createAComment_post = async (req: Request, res: Response) => {
  const result = commentSchema.safeParse(req.body);

  if (result.success === false)
    throw new HttpError(400, result.error.issues[0].message);

  const content = result.data.content;
  const postId = Number(req.params.id);
  const userId = Number(res.locals.userId);

  const comment = await createComment(content, postId, userId);

  res.status(201).json(comment);
};
