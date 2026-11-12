// ROUTE layer: map URL + HTTP method -> controller function (+ requireAuth where needed).
// No logic here.
import express, { Router } from "express";
import {
  login_post,
  signup_post,
  protectRoutesHandler_get,
} from "./auth.controller";
import { requireAuth } from "../../middleware/authMiddleware";

const authRouter: Router = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);
authRouter.get("/me", requireAuth(["ADMIN"]), protectRoutesHandler_get);

export default authRouter;
