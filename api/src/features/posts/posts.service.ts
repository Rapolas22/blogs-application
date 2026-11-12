// SERVICE layer: business rules + Prisma calls.
// Takes plain values (e.g. id: number), returns data or throws HttpError. Never touches req/res.
import prisma from "../../lib/prisma";
import type { Post } from "../../generated/prisma/client";

export function getAllPosts() {
  return prisma.post.findMany({
    select: {
      title: true,
      published: true,
      description: true,
      createdAt: true,
      thumbnailUrl: true,
      id: true,
    },
  });
}

export function createPost(post: Post, userId: number) {
  return prisma.post.create({
    data: {
      author: {
        connect: { id: userId },
      },
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      description: post.description,
      seoName: post.seoName,
    },
  });
}

export function deletePost(paramsId: number) {
  return prisma.post.delete({
    where: {
      id: paramsId,
    },
  });
}

export function getPostById(paramsId: number) {
  return prisma.post.findUnique({
    where: {
      id: paramsId,
    },
  });
}

export function updatePostData(paramsId: number, userId: number, post: Post) {
  return prisma.post.update({
    where: {
      id: paramsId,
      authorId: userId,
    },
    data: {
      title: post.title,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      description: post.description,
      seoName: post.seoName,
    },
  });
}

export function getPublishedPosts() {
  return prisma.post.findMany({
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
}

export function getPublishedPostById(paramsId: number) {
  return prisma.post.findFirst({
    where: {
      published: true,
      id: paramsId,
    },
  });
}
