import express, { Router, Request, Response } from "express";
import {
  login_post,
  signup_post,
  protectRoutesHandler_get,
} from "../controller/authController";
import { homePagePosts_get } from "../controller/postController";
import { requireAuth } from "../middleware/authMiddleware";

const authRouter: Router = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);
authRouter.get("/me", requireAuth, protectRoutesHandler_get);

export default authRouter;
