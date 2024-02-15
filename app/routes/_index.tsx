import { ActionFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { TrackDetails, parseResults } from '../utils/parseResults';
import { SearchField } from '~/components/SearchField';
import { Button } from '~/components/Button';
import { TrackInfo } from '~/components/TrackInfo';
import { create as createSpotifySdk } from '~/utils/spotifySdkFactory.server';

export function headers() {
  return {
    // This is an example of how to set caching headers for a route
    // For more info on headers in Remix, see: https://remix.run/docs/en/v1/route/headers
    'Cache-Control': 'public, max-age=60, s-maxage=60',
  };
}

const searchTermFieldName = 'searchTerm';

type SuccessResult = {
  ok: true;
  tracks: TrackDetails[];
};

type FailureResult = {
  ok: false;
  tracks?: never;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const searchTerm = formData.get(searchTermFieldName);

  const sdk = createSpotifySdk();

  if (!searchTerm || typeof searchTerm !== 'string') {
    const failureResult: FailureResult = { ok: false };
    return failureResult;
  }

  const result = await sdk.search(searchTerm, ['track']);
  const response: SuccessResult = { ok: true, tracks: parseResults(result) };
  return response;
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const isSearching = fetcher.state !== 'idle';

  const data = fetcher.data;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4">
        <fetcher.Form method="post">
          <fieldset className="flex gap-2 group" disabled={isSearching}>
            <SearchField label="Track Name" name={searchTermFieldName} />

            <Button type="submit">Search</Button>
          </fieldset>
        </fetcher.Form>
      </div>

      {data?.ok && (
        <div className="flex flex-col flex-wrap gap-4 justify-between">
          {data.tracks.map((track) => (
            <TrackInfo track={track} key={track?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
