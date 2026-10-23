import express, { Router, Request, Response } from "express";
import {
  homePagePosts_get,
  postCreation_post,
} from "../controller/postController";
import { requireAuth } from "../middleware/authMiddleware";

const postsRouter: Router = express.Router();

postsRouter.get("/getPosts", requireAuth, homePagePosts_get);
postsRouter.get("/postCreation", requireAuth, postCreation_post);
