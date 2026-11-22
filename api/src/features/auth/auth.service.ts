import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";

export const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

export function createToken(id: number, role: string) {
  const secret = process.env.JWT_SIGN;

  return jwt.sign({ id, role }, secret, { expiresIn: maxAge });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(
  email: string,
  password: string,
  name: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
}

export function checkPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}
