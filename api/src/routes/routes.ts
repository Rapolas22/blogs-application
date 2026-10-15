import express, { Router, Request, Response } from "express";
import { login_post, signup_post } from "../controller/authController";
import { homePagePosts_get } from "../controller/postController";

const authRouter: Router = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);
authRouter.get("/getPosts", homePagePosts_get);

export default authRouter;
