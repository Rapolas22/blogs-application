import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

const requiredRole = "ADMIN";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SIGN, (err: any, decodedToken: any) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (requiredRole && decodedToken.role !== requiredRole) {
      return res
        .status(403)
        .json({ error: "Access denied: insufficient rights" });
    }

    res.locals.userId = decodedToken.id;
    next();
  });
};
