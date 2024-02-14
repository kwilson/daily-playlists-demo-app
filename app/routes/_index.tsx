import { ActionFunction } from '@netlify/remix-runtime';
import { Form, useActionData } from '@remix-run/react';
import {
  SpotifyApi,
  PartialSearchResult,
  Track,
} from '@spotify/web-api-ts-sdk';
import { z } from 'zod';
import { environment } from '~/environment.server';

export function headers({
  loaderHeaders,
  parentHeaders,
}: {
  loaderHeaders: Headers;
  parentHeaders: Headers;
}) {
  console.log(
    'This is an example of how to set caching headers for a route, feel free to change the value of 60 seconds or remove the header',
  );
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  };
}

const searchTermFieldName = 'searchTerm';

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

function parseResults(result: Required<Pick<PartialSearchResult, 'tracks'>>) {
  return { tracks: result.tracks.items.map(parseResult), raw: result };
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const searchTerm = formData.get(searchTermFieldName);
    console.log({ searchTerm });

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = environment();
    const sdk = SpotifyApi.withClientCredentials(
      SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET,
    );

    if (!searchTerm || typeof searchTerm !== 'string') {
      return { ok: false };
    }

    const result = await sdk.search(searchTerm, ['track'], undefined, 10);
    console.log({ result });
    return parseResults(result);
  } catch (e) {
    return { error: e };
  }
};

export default function Index() {
  const actionData = useActionData<ReturnType<typeof parseResults>>();

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <Form method="post">
        <fieldset>
          <input type="search" name={searchTermFieldName} />

          <button type="submit">Search</button>
        </fieldset>
      </Form>

      {actionData && <pre>{JSON.stringify(actionData.tracks, null, 2)}</pre>}
    </main>
  );
}
