import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

const maxAge = 3 * 24 * 60 * 60; // 3 dienos sekundėmis

const createToken = (id: number) => {
  const secret = process.env.JWT_SIGN;

  return jwt.sign({ id }, secret, { expiresIn: maxAge });
};

export const signup_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = createToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user.id });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "This email has already been used" });
    }
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login_post = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const auth = user && (await bcrypt.compare(password, user.password));

    if (!user || !auth) {
      return res.status(401).json({ message: "Wrong password or email" });
    }

    const token = createToken(user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ user: user.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
