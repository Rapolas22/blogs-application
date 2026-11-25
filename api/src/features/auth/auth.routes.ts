import express, { Router } from "express";
import {
  login_post,
  signup_post,
  protectRoutesHandler_get,
  logout_get,
} from "./auth.controller";
import { requireAuth } from "../../middleware/authMiddleware";

const authRouter: Router = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);
authRouter.get("/logout", requireAuth(), logout_get);
authRouter.get("/me", requireAuth(), protectRoutesHandler_get);

export default authRouter;
