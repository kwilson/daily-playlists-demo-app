import { PrismaClient } from '@prisma/client';

type TrackRecord = {
  id: string;
  name: string;
  artist: string;
};

export async function createTrackViewRecord(track: TrackRecord) {
  const prisma = new PrismaClient();
  try {
    return await prisma.viewedTracks.create({
      data: track,
    });
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
}
