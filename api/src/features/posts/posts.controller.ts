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
import type { Post } from "../../generated/prisma/client";

export const homePagePosts_get = async (req: Request, res: Response) => {
  const posts = await getAllPosts();

  res.status(200).json(posts);
};

export const postCreation_post = async (req: Request, res: Response) => {
  const postData: Post = req.body;

  const post = await createPost(postData, res.locals.userId);

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
  const postData: Post = req.body;

  const post = await updatePostData(
    Number(req.params.id),
    res.locals.userId,
    postData,
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
