import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { TrackDetails, parseResults } from '../utils/parseResults';
import { SearchField } from '~/components/SearchField';
import { Button } from '~/components/Button';
import { TrackInfo } from '~/components/TrackInfo';
import { create as createSpotifySdk } from '~/utils/spotifySdkFactory.server';
import { PrismaClient } from '@prisma/client';
import { Anchor } from '~/components/Anchor';

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

export const loader = async () => {
  const prisma = new PrismaClient();

  try {
    const recentSearches = await prisma.searchTerms.findMany({
      where: {},
      distinct: ['value'],
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        value: true,
      },
      take: 20,
    });

    const recentTracks = await prisma.viewedTracks.findMany({
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
      take: 20,
    });

    return { recentSearches, recentTracks };
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const searchTerm = formData.get(searchTermFieldName);

  const sdk = createSpotifySdk();

  if (!searchTerm || typeof searchTerm !== 'string') {
    const failureResult: FailureResult = { ok: false };
    return failureResult;
  }

  const prisma = new PrismaClient();

  try {
    await prisma.searchTerms.create({
      data: {
        value: searchTerm,
      },
    });

    const result = await sdk.search(searchTerm, ['track']);
    const response: SuccessResult = { ok: true, tracks: parseResults(result) };
    return response;
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    return null;
  }
};

export default function Index() {
  const fetcher = useFetcher<typeof action>();
  const { recentSearches, recentTracks } = useLoaderData<typeof loader>();
  const isSearching = fetcher.state !== 'idle';

  const data = fetcher.data;

  return (
    <div className="flex flex-col items-center p-4 gap-8 w-full">
      <fetcher.Form
        className="flex justify-center gap-2 group w-full"
        method="post"
      >
        <fieldset className="contents" disabled={isSearching}>
          <SearchField label="Track Name" name={searchTermFieldName} />
          <Button type="submit">Search</Button>
        </fieldset>
      </fetcher.Form>

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
                <fetcher.Form method="post">
                  <input
                    type="hidden"
                    name={searchTermFieldName}
                    value={search.value}
                  />
                  <Button type="submit">
                    <span className="lowercase">{search.value}</span>
                  </Button>
                </fetcher.Form>
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
