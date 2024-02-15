import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { TrackDetails, parseResults } from '../utils/parseResults';
import { SearchField } from '~/components/SearchField';
import { Button } from '~/components/Button';
import { TrackInfo } from '~/components/TrackInfo';
import { create as createSpotifySdk } from '~/utils/spotifySdkFactory.server';
import { PrismaClient } from '@prisma/client';

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
    const searchTerms = await prisma.searchTerms.findMany({
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

    return searchTerms;
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
  const previousSearches = useLoaderData<typeof loader>();
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

      {!data?.ok && previousSearches.length && (
        <div className="text-center mt-4">
          <h2 className="text-xl mb-2">Recent Searches</h2>
          <ul className="flex flex-wrap gap-2">
            {previousSearches.map((previousSearch) => (
              <li key={previousSearch.id}>
                <fetcher.Form method="post">
                  <input
                    type="hidden"
                    name={searchTermFieldName}
                    value={previousSearch.value}
                  />
                  <Button type="submit">{previousSearch.value}</Button>
                </fetcher.Form>
              </li>
            ))}
          </ul>
        </div>
      )}

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
