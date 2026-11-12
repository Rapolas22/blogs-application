// Central error handler (Express 5 sends thrown async errors here).
// Must have 4 params: (err, req, res, next). Register it LAST in app.ts.
import { type Request, type Response, type NextFunction } from "express";
import { HttpError } from "../lib/HttpError";
import { Prisma } from "../generated/prisma/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction, // unused, but must stay: Express only treats 4-param functions as error handlers
) {
  // Errors we threw on purpose: throw new HttpError(404, "Post not found")
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Prisma's "record not found" (update/delete on an id that doesn't exist).
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  // Anything else is a bug or an outage. Log the real error for YOU,
  // but send the client only a generic message (no stack traces / DB details).
  console.error(err);
  res.status(500).json({ message: "Server error" });
}
