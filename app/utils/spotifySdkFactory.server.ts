import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { environment } from '~/environment.server';

export function create() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = environment();
  const sdk = SpotifyApi.withClientCredentials(
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
  );

  return sdk;
}
