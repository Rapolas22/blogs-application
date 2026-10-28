import { Request, Response } from "express";
import prisma from "../../lib/prisma";

export const homePagePosts_get = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        title: true,
        thumbnailUrl: true,
        description: true,
        id: true,
        published: true,
        createdAt: true,
      },
    });
    res.send(posts);
  } catch (err) {
    console.log(err);
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

    return res.status(201).json(post);
  } catch (err) {
    console.log(err);
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

    res.status(200).json(post);
  } catch (error: any) {
    // P2025 = Prisma couldn't find a post with that id
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(error);
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
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Post not found" });
  }
};

export const updateProduct_patch = async (req: Request, res: Response) => {
  const { title, content, thumbnailUrl, description, seoName } = req.body;
  try {
    const product = await prisma.post.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: title,
        content: content,
        thumbnailUrl: thumbnailUrl,
        description: description,
        seoName: seoName,
      },
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "post not found" });
  }
};
