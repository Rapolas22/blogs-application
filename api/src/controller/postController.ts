import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { HttpError } from "../lib/HttpError";

export const homePagePosts_get = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        published: true,
        description: true,
        createdAt: true,
        thumbnailUrl: true,
        id: true,
      },
    });

    res.status(200).json(posts);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const postCreation_post = async (req: Request, res: Response) => {
  const { title, content, thumbnailUrl, description, seoName } = req.body;
  try {
    const post = await prisma.post.create({
      data: {
        author: {
          connect: { id: res.locals.userId },
        },
        title: title,
        content: content,
        thumbnailUrl: thumbnailUrl,
        description: description,
        seoName: seoName,
      },
    });

    if (!post) throw new HttpError(500, "Failed to create the post");

    return res.status(201).json(post);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const postRemove_delete = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!post) throw new HttpError(404, "Post not found");

    res.status(200).json(post);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ message: "Record to delete does not exist." });
    }

    if (error instanceof HttpError)
      throw new HttpError(error.status, error.message);

    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById_get = async (req: Request, res: Response) => {
  try {
    const response = await prisma.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!response) throw new HttpError(404, "Post not found");

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const updateProduct_patch = async (req: Request, res: Response) => {
  const { title, content, thumbnailUrl, description, seoName } = req.body;
  try {
    const product = await prisma.post.update({
      where: {
        id: Number(req.params.id),
        authorId: Number(req.params.id),
      },
      data: {
        title: title,
        content: content,
        thumbnailUrl: thumbnailUrl,
        description: description,
        seoName: seoName,
      },
    });

    if (!product)
      throw new HttpError(404, "Post not found or you are not the author");

    res.status(200).json(product);
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const userPagePostsFetch_get = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnailUrl: true,
        createdAt: true,
      },
    });

    return res.status(200).json(posts);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const userPageGetSinglePost_get = async (
  req: Request,
  res: Response,
) => {
  try {
    const post = await prisma.post.findFirst({
      where: {
        published: true,
        id: Number(req.params.id),
      },
    });

    if (!post) throw new HttpError(404, "Post not found");

    res.status(200).json(post);
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const getPostComments_get = async (req: Request, res: Response) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(req.params.id) },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deletePostCommentById_delete = async (
  req: Request,
  res: Response,
) => {
  try {
    const commentId = req.params.commentId;
    const comment = await prisma.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== res.locals.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.comment.delete({
      where: {
        id: Number(commentId),
      },
    });

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createAComment_post = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = res.locals.userId;
    const comment = await prisma.comment.create({
      data: {
        text: content,
        post: {
          connect: { id: Number(postId) },
        },
        user: {
          connect: { id: Number(userId) },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
