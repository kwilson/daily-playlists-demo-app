import { useMemo } from 'react';
import { TrackDetails } from '~/utils/parseResults';
import { millisToMinutesAndSeconds } from '../../utils/millisToMinutesAndSeconds';

type TrackInfoProps = {
  track: TrackDetails;
};

export function TrackInfo({ track }: TrackInfoProps) {
  const artists = useMemo(
    () => track.artists.map((artist) => artist.name).join(', '),
    [],
  );
  const imageData = useMemo(
    () => track.album.images.find((image) => image.width === 300),
    [],
  );
  const duration = useMemo(
    () => millisToMinutesAndSeconds(track.durationMs),
    [],
  );

  return (
    <a
      href={`/tracks/${track.id}`}
      className="cursor-pointer flex flex-col md:flex-row gap-4 items-center bg-electric-violet-200 hover:bg-electric-violet-300 text-black rounded-xl overflow-hidden p-4"
    >
      <div>
        {imageData && (
          <img
            className="max-w-32 h-auto"
            src={imageData.url}
            height={imageData.height}
            width={imageData.width}
          />
        )}
      </div>

      <div className="text-center md:text-left">
        <div className="font-extrabold">{track.name}</div>
        <div className="text-sm">
          {artists} / {track.album.name} ({track.album.releaseYear})
        </div>
        <div className="text-sm">{duration}</div>
      </div>
    </a>
  );
}
