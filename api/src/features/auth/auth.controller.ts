import { Request, Response } from "express";
import { HttpError } from "../../lib/HttpError";
import {
  maxAge,
  createToken,
  findUserByEmail,
  createUser,
  checkPassword,
} from "./auth.service";
import { signupSchema, loginSchema } from "./auth.schema";

export const signup_post = async (req: Request, res: Response) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    throw new HttpError(400, result.error.issues[0].message);
  }

  const { email, password } = result.data;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "This email has already been used");
  }

  const user = await createUser(email, password);

  res.status(201).json({ user: user.id });
};

export const login_post = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    throw new HttpError(400, result.error.issues[0].message);
  }

  const { email, password } = result.data;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new HttpError(401, "Wrong email or password");
  }

  const auth = await checkPassword(password, user.password);

  if (!auth) {
    throw new HttpError(401, "Wrong email or password");
  }

  const token = createToken(user.id, user.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: maxAge * 1000,
  });

  res.status(200).json({ user: user.id });
};

export const protectRoutesHandler_get = (req: Request, res: Response) => {
  return res.status(200).json(res.locals.userId);
};
