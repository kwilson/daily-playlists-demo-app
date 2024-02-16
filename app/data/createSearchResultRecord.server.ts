import { PrismaClient } from '@prisma/client';

export async function createSearchResultRecord(searchTerm: string) {
  const prisma = new PrismaClient();

  try {
    return prisma.searchTerms.create({
      data: {
        value: searchTerm,
      },
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();

    throw e;
  }
}
