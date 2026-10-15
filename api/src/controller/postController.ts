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
