// SERVICE layer: business rules + Prisma calls.
// Takes plain values (e.g. id: number), returns data or throws HttpError. Never touches req/res.
import prisma from "../../lib/prisma";

// All comments on one post, with the commenter's name (not their email/password).
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

// `connect` links the new comment to an existing post and user by their ids.
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
