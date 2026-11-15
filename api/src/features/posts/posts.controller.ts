import { Request, Response } from "express";
import { HttpError } from "../../lib/HttpError";
import {
  getAllPosts,
  createPost,
  deletePost,
  getPostById,
  updatePostData,
  getPublishedPosts,
  getPublishedPostById,
} from "./posts.service";
import { postSchema } from "./posts.schema";

export const homePagePosts_get = async (req: Request, res: Response) => {
  const posts = await getAllPosts();

  res.status(200).json(posts);
};

export const postCreation_post = async (req: Request, res: Response) => {
  const result = postSchema.safeParse(req.body);

  if (result.success === false)
    throw new HttpError(400, result.error.issues[0].message);

  const post = await createPost(result.data, res.locals.userId);

  res.status(201).json(post);
};

export const postRemove_delete = async (req: Request, res: Response) => {
  const post = await deletePost(Number(req.params.id));

  res.status(200).json(post);
};

export const getPostById_get = async (req: Request, res: Response) => {
  const post = await getPostById(Number(req.params.id));

  if (!post) throw new HttpError(404, "Post not found");

  res.status(200).json(post);
};

export const updateProduct_patch = async (req: Request, res: Response) => {
  const result = postSchema.safeParse(req.body);

  if (result.success === false)
    throw new HttpError(400, result.error.issues[0].message);

  const post = await updatePostData(
    Number(req.params.id),
    res.locals.userId,
    result.data,
  );

  res.status(200).json(post);
};

export const userPagePostsFetch_get = async (req: Request, res: Response) => {
  const posts = await getPublishedPosts();

  res.status(200).json(posts);
};

export const userPageGetSinglePost_get = async (
  req: Request,
  res: Response,
) => {
  const post = await getPublishedPostById(Number(req.params.id));

  if (!post) throw new HttpError(404, "Post not found");

  res.status(200).json(post);
};
