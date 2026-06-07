import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../utils/password';

interface CreateUserDto {
  name: string;
  email: string;
  address: string;
  password: string;
  role?: Role;
}

interface ListUsersQuery {
  name?: string;
  email?: string;
  address?: string;
  role?: Role;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortDir?: 'asc' | 'desc';
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  address: true,
  role: true,
  createdAt: true,
};

export const listUsers = async (query: ListUsersQuery) => {
  const { name, email, address, role, sortBy = 'createdAt', sortDir = 'desc' } = query;

  const where: Prisma.UserWhereInput = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };
  if (role) where.role = role;

  const users = await prisma.user.findMany({
    where,
    select: {
      ...userSelect,
      ownedStore: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
    orderBy: { [sortBy]: sortDir },
  });

  return users.map((user) => {
    const { ownedStore, ...rest } = user;
    if (!ownedStore) return rest;

    const avgRating =
      ownedStore.ratings.length > 0
        ? ownedStore.ratings.reduce((sum, r) => sum + r.value, 0) / ownedStore.ratings.length
        : null;

    return { ...rest, storeAvgRating: avgRating };
  });
};

export const createUser = async (dto: CreateUserDto) => {
  const hashed = await hashPassword(dto.password);
  const role = dto.role || Role.NORMAL_USER;

  const user = await prisma.user.create({
    data: { name: dto.name, email: dto.email, address: dto.address, password: hashed, role },
    select: userSelect,
  });

  return user;
};

export const createAdmin = async (dto: Omit<CreateUserDto, 'role'>) => {
  const hashed = await hashPassword(dto.password);
  const user = await prisma.user.create({
    data: { name: dto.name, email: dto.email, address: dto.address, password: hashed, role: Role.ADMIN },
    select: userSelect,
  });
  return user;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      ...userSelect,
      ownedStore: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
  });

  if (!user) {
    const err = new Error('User not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const { ownedStore, ...rest } = user;
  if (!ownedStore) return rest;

  const avgRating =
    ownedStore.ratings.length > 0
      ? ownedStore.ratings.reduce((sum, r) => sum + r.value, 0) / ownedStore.ratings.length
      : null;

  return { ...rest, storeAvgRating: avgRating };
};
