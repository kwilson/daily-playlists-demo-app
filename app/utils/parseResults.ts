import { PartialSearchResult, Track } from '@spotify/web-api-ts-sdk';
import { z } from 'zod';

const trackResult = z
  .object({
    id: z.string(),
    name: z.string(),
    duration_ms: z.number(),
    artists: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
    album: z.object({
      name: z.string(),
      release_date: z.coerce.date(),
      images: z.array(
        z.object({
          height: z.number(),
          width: z.number(),
          url: z.string(),
        }),
      ),
    }),
    external_urls: z.object({
      spotify: z.string(),
    }),
  })
  .transform((track) => ({
    id: track.id,
    name: track.name,
    durationMs: track.duration_ms,
    artists: track.artists,
    album: {
      name: track.album.name,
      releaseYear: track.album.release_date.getFullYear(),
      images: track.album.images,
    },
    href: track.external_urls.spotify,
  }));

export type TrackDetails = z.infer<typeof trackResult>;

export function parseResult(track: Track): TrackDetails {
  return trackResult.parse(track);
}

export function parseResults(
  result: Required<Pick<PartialSearchResult, 'tracks'>>,
) {
  return result.tracks.items.map(parseResult);
}
