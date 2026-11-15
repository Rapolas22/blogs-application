import { type Request, type Response, type NextFunction } from "express";
import { HttpError } from "../lib/HttpError";
import { Prisma } from "../generated/prisma/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    return res.status(404).json({ message: "Record not found" });
  }

  console.error(err);
  res.status(500).json({ message: "Server error" });
}
