import { prisma } from '../../lib/prisma';

export const upsertRating = async (userId: number, storeId: number, value: number) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    const err = new Error('Store not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  if (store.ownerId === userId) {
    const err = new Error('Store owners cannot rate their own store') as Error & { status: number };
    err.status = 403;
    throw err;
  }

  const rating = await prisma.rating.upsert({
    where: { userId_storeId: { userId, storeId } },
    create: { userId, storeId, value },
    update: { value },
    select: { id: true, value: true, userId: true, storeId: true, updatedAt: true },
  });

  return rating;
};

export const getRatingsForStore = async (storeId: number) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    const err = new Error('Store not found') as Error & { status: number };
    err.status = 404;
    throw err;
  }

  const ratings = await prisma.rating.findMany({
    where: { storeId },
    select: {
      id: true,
      value: true,
      updatedAt: true,
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return ratings.map((r) => ({ ...r.user, rating: r.value, ratedAt: r.updatedAt, ratingId: r.id }));
};
