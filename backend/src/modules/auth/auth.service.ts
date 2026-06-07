import { Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/password';
import { signToken, TokenPayload } from '../../utils/jwt';

interface SignupDto {
  name: string;
  email: string;
  address: string;
  password: string;
}

interface LoginDto {
  email: string;
  password: string;
}

export const signup = async (dto: SignupDto) => {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) {
    const err = new Error('Email already in use') as Error & { status: number };
    err.status = 409;
    throw err;
  }

  const hashed = await hashPassword(dto.password);
  const user = await prisma.user.create({
    data: { name: dto.name, email: dto.email, address: dto.address, password: hashed, role: Role.NORMAL_USER },
    select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
  });

  return user;
};

export const login = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user) {
    const err = new Error('Invalid email or password') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(dto.password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password') as Error & { status: number };
    err.status = 401;
    throw err;
  }

  const tokenPayload: TokenPayload = { sub: user.id, role: user.role, email: user.email };
  const token = signToken(tokenPayload);
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

export const updatePassword = async (userId: number, currentPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) {
    const err = new Error('Current password is incorrect') as Error & { status: number };
    err.status = 400;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
};
