import { ActionFunctionArgs } from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { TrackDetails, parseResults } from '../utils/parseResults';
import { SearchField } from '~/components/SearchField';
import { Button } from '~/components/Button';
import { TrackInfo } from '~/components/TrackInfo';
import { create as createSpotifySdk } from '~/utils/spotifySdkFactory.server';
import { Anchor } from '~/components/Anchor';
import { getRecentSearches } from '~/data/getRecentSearches.server';
import { getRecentlyViewedTracks } from '~/data/getRecentlyViewedTracks.server';
import { createSearchResultRecord } from '~/data/createSearchResultRecord.server';

const searchTermFieldName = 'searchTerm';

type SuccessResult = {
  ok: true;
  tracks: TrackDetails[];
};

type FailureResult = {
  ok: false;
  tracks?: never;
};

export const loader = async () => {
  try {
    const [recentSearches, recentTracks] = await Promise.all([
      getRecentSearches(10),
      getRecentlyViewedTracks(10),
    ]);

    return { recentSearches, recentTracks };
  } catch (e) {
    console.error(e);
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const searchTerm = formData.get(searchTermFieldName);

  if (!searchTerm || typeof searchTerm !== 'string') {
    const failureResult: FailureResult = { ok: false };
    return failureResult;
  }

  try {
    const sdk = createSpotifySdk();
    const [result] = await Promise.all([
      sdk.search(searchTerm, ['track']),
      createSearchResultRecord(searchTerm),
    ]);

    const response: SuccessResult = { ok: true, tracks: parseResults(result) };
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default function Index() {
  const data = useActionData<typeof action>();
  const { recentSearches, recentTracks } = useLoaderData<typeof loader>();

  const transition = useNavigation();
  const isSearching = transition.state !== 'idle';

  return (
    <div className="flex flex-col items-center p-4 gap-8 w-full">
      <Form className="flex justify-center gap-2 group w-full" method="post">
        <fieldset className="contents" disabled={isSearching}>
          <SearchField
            placeholder="Hey Jude"
            label="Track Name"
            name={searchTermFieldName}
            required
          />
          <Button busy={isSearching} type="submit">
            Search
          </Button>
        </fieldset>
      </Form>

      {!data?.ok && recentTracks.length > 0 && (
        <div className="text-center mt-4">
          <h2 className="text-xl mb-2">Recent Tracks</h2>
          <ul className="flex flex-col gap-2 justify-center">
            {recentTracks.map((track) => (
              <li key={track.id}>
                <Anchor to={`/tracks/${track.id}`}>
                  {track.name} / {track.artist}
                </Anchor>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!data?.ok && recentSearches.length > 0 && (
        <div className="text-center mt-4">
          <h2 className="text-xl mb-2">Recent Searches</h2>
          <ul className="flex flex-wrap gap-2 justify-center">
            {recentSearches.map((search) => (
              <li key={search.id}>
                <Form method="post">
                  <input
                    type="hidden"
                    name={searchTermFieldName}
                    value={search.value}
                  />
                  <Button type="submit">
                    <span className="lowercase">{search.value}</span>
                  </Button>
                </Form>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.ok && (
        <div className="flex flex-col flex-wrap gap-4 justify-between max-w-prose">
          {data.tracks.map((track) => (
            <TrackInfo track={track} key={track?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
