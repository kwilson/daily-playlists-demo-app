import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useMemo } from 'react';
import { Anchor } from '~/components/Anchor';
import { millisToMinutesAndSeconds } from '~/utils/millisToMinutesAndSeconds';
import { parseResult } from '~/utils/parseResults';
import { create as createSpotifySdk } from '~/utils/spotifySdkFactory.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const trackId = params['trackId'];

  if (!trackId) {
    return redirect('/');
  }

  const sdk = createSpotifySdk();
  const track = await sdk.tracks.get(trackId);

  if (!track) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return parseResult(track);
};

export default function TrackDetails() {
  const track = useLoaderData<typeof loader>();

  const artists = useMemo(
    () => track.artists.map((artist) => artist.name).join(', '),
    [],
  );
  const imageData = useMemo(
    () => track.album.images.find((image) => image.width === 640),
    [],
  );
  const duration = useMemo(
    () => millisToMinutesAndSeconds(track.durationMs),
    [],
  );

  console.log({ track });

  return (
    <div className="cursor-pointer flex flex-col gap-4 items-center p-4">
      <div>
        {imageData && (
          <img
            className="h-auto max-w-96 border border-black"
            src={imageData.url}
            height={imageData.height}
            width={imageData.width}
          />
        )}
      </div>

      <div className="text-center mb-4">
        <h2 className="font-extrabold text-2xl">{track.name}</h2>
        <div>{artists}</div>
        <div>
          {track.album.name} ({track.album.releaseYear})
        </div>
        <div>{duration}</div>
      </div>

      <p>
        <Anchor to="/">Home</Anchor>
      </p>
    </div>
  );
}
