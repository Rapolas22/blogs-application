// Builds the Express app: middleware (json, cors, cookies) -> feature routers -> errorHandler.
// index.ts will import this and only call app.listen().

import "dotenv/config";
import express from "express";
import CookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./features/auth/auth.routes";
import postsRouter from "./features/posts/posts.routes";
import commentsRouter from "./features/comments/comments.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(CookieParser());
app.use(authRouter);
app.use(postsRouter);
app.use(commentsRouter);
app.use(errorHandler);

export default app;
