import express, { Router, Request, Response } from "express";
import { Post } from "../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export const homePagePosts_get = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
};
