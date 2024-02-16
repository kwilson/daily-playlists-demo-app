import { PrismaClient } from '@prisma/client';

export async function getRecentlyViewedTracks(limit: number = 10) {
  const prisma = new PrismaClient();

  try {
    return await prisma.viewedTracks.findMany({
      where: {},
      distinct: ['id'],
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        artist: true,
      },
      take: limit,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();

    throw e;
  }
}
