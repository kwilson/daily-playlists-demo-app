import { ActionFunction } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '~/environment.server';
import { parseResults } from '../utils/parseResults';

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const searchTerm = formData.get(searchTermFieldName);

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = environment();
  const sdk = SpotifyApi.withClientCredentials(
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
  );

  if (!searchTerm || typeof searchTerm !== 'string') {
    return { ok: false };
  }

  const result = await sdk.search(searchTerm, ['track']);
  return parseResults(result);
};

export default function Index() {
  const actionData = useActionData<ReturnType<typeof parseResults>>();

  return (
    <main>
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
