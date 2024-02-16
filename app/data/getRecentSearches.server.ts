import { PrismaClient } from '@prisma/client';

export async function getRecentSearches(limit: number = 10) {
  const prisma = new PrismaClient();

  try {
    return await prisma.searchTerms.findMany({
      where: {},
      distinct: ['value'],
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        value: true,
      },
      take: limit,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();

    throw e;
  }
}
