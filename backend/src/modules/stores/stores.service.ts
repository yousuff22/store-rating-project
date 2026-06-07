import { Prisma, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma';

interface CreateStoreDto {
  name: string;
  email: string;
  address: string;
  ownerId: number;
}

interface ListStoresQuery {
  name?: string;
  address?: string;
  sortBy?: 'name' | 'address' | 'createdAt';
  sortDir?: 'asc' | 'desc';
  requestingUserId?: number;
  requestingUserRole?: Role;
}

export const listStores = async (query: ListStoresQuery) => {
  const { name, address, sortBy = 'name', sortDir = 'asc', requestingUserId, requestingUserRole } = query;

  const where: Prisma.StoreWhereInput = {};
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (address) where.address = { contains: address, mode: 'insensitive' };

  const stores = await prisma.store.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ownerId: true,
      _count: { select: { ratings: true } },
      ratings: {
        select: {
          value: true,
          userId: true,
        },
      },
    },
    orderBy: sortBy !== 'createdAt' ? { [sortBy]: sortDir } : { createdAt: sortDir },
  });

  return stores.map((store) => {
    const { ratings, _count, ...rest } = store;
    const avgRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length : null;

    const userRating =
      requestingUserRole === Role.NORMAL_USER && requestingUserId
        ? (ratings.find((r) => r.userId === requestingUserId)?.value ?? null)
        : undefined;

    const result: Record<string, unknown> = { ...rest, avgRating, totalRatings: _count.ratings };
    if (requestingUserRole === Role.NORMAL_USER) result.userRating = userRating;
    return result;
  });
};

export const createStore = async (dto: CreateStoreDto) => {
  const owner = await prisma.user.findUnique({ where: { id: dto.ownerId } });
  if (!owner) {
    const err = new Error('Owner user not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }
  if (owner.role !== Role.STORE_OWNER) {
    const err = new Error('User must have role STORE_OWNER to own a store') as Error & { status: number };
    err.status = 400;
    throw err;
  }

  const existingStore = await prisma.store.findUnique({ where: { ownerId: dto.ownerId } });
  if (existingStore) {
    const err = new Error('This user already owns a store') as Error & { status: number };
    err.status = 409;
    throw err;
  }

  return prisma.store.create({
    data: { name: dto.name, email: dto.email, address: dto.address, ownerId: dto.ownerId },
    select: { id: true, name: true, email: true, address: true, ownerId: true, createdAt: true },
  });
};

export const getStoreById = async (id: number, requestingUserId?: number, requestingUserRole?: Role) => {
  const store = await prisma.store.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ownerId: true,
      ratings: { select: { value: true, userId: true } },
    },
  });

  if (!store) {
    const err = new Error('Store not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const { ratings, ...rest } = store;
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length : null;
  const userRating =
    requestingUserRole === Role.NORMAL_USER && requestingUserId
      ? (ratings.find((r) => r.userId === requestingUserId)?.value ?? null)
      : undefined;

  const result: Record<string, unknown> = { ...rest, avgRating };
  if (requestingUserRole === Role.NORMAL_USER) result.userRating = userRating;
  return result;
};

export const getMyStore = async (ownerId: number) => {
  const store = await prisma.store.findUnique({
    where: { ownerId },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          value: true,
          updatedAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { updatedAt: 'desc' },
      },
    },
  });

  if (!store) {
    const err = new Error('You do not have a store assigned to your account') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const { ratings, ...rest } = store;
  const avgRating = ratings.length > 0 ? ratings.reduce((s, r) => s + r.value, 0) / ratings.length : null;
  const raters = ratings.map((r) => ({ ...r.user, rating: r.value, ratedAt: r.updatedAt }));

  return { ...rest, avgRating, raters };
};
