import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

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
          connect: { id: res.locals.id },
        },
        title: title,
        content: content,
        thumbnailUrl: thumbnailUrl,
        description: description,
        seoName: seoName,
      },
    });

    return res.status(200).json();
  } catch (err) {
    console.log(err);
  }
};
