import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { HttpError } from "../lib/HttpError";

const maxAge = 3 * 24 * 60 * 60; // 3 dienos sekundėmis

const createToken = (id: number, role: string) => {
  const secret = process.env.JWT_SIGN;

  return jwt.sign({ id, role }, secret, { expiresIn: maxAge });
};

export const signup_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new HttpError(409, "This email has already been used");
    }

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ user: user.id });
  } catch (err: any) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: err.message });
  }
};

export const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new HttpError(401, "Wrong email");

    const auth = user && (await bcrypt.compare(password, user.password));

    if (!auth) throw new HttpError(401, "Wrong password");

    const token = createToken(user.id, user.role);

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ user: user.id });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const protectRoutesHandler_get = (req: Request, res: Response) => {
  return res.status(200).json(res.locals.userId);
};
