import prisma from "../../lib/prisma";

export function getCommentsByPostId(postId: number) {
  return prisma.comment.findMany({
    where: { postId },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

export function getCommentById(commentId: number) {
  return prisma.comment.findUnique({
    where: { id: commentId },
  });
}

export function deleteComment(commentId: number) {
  return prisma.comment.delete({
    where: { id: commentId },
  });
}

export function createComment(text: string, postId: number, userId: number) {
  return prisma.comment.create({
    data: {
      text,
      post: {
        connect: { id: postId },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
}
