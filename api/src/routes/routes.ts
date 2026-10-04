import express, { Router, Request, Response } from "express";
import { login_post, signup_post } from "../controller/authController";

const authRouter: Router = express.Router();

authRouter.post("/login", login_post);
authRouter.post("/signup", signup_post);

export default authRouter;
