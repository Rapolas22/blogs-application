import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";

type Role = "ADMIN" | "USER";

export const requireAuth =
  (roles: Role[] = []) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SIGN, (err: any, decodedToken: any) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Not authenticated" });
      }

      if (roles.length !== 0 && !roles.includes(decodedToken.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      res.locals.userId = decodedToken.id;
      return next();
    });
  };
