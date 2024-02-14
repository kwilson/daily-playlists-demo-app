import { PartialSearchResult, Track } from '@spotify/web-api-ts-sdk';
import { z } from 'zod';

const trackResult = z.object({
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
    release_date: z.string(),
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
});

function parseResult(track: Track) {
  return trackResult.parse(track);
}

export function parseResults(
  result: Required<Pick<PartialSearchResult, 'tracks'>>,
) {
  return { tracks: result.tracks.items.map(parseResult), raw: result };
}
