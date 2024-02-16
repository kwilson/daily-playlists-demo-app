# Song Searcher

Basic app to allow searching of tracks via the Spotify API, then selecting a track for a (limited) details view.

Live demo app: https://daily-playlists-demo-app.netlify.app/

## Development

Set prerequisite values in a `.env` file:

```text
SPOTIFY_CLIENT_ID = <value>
SPOTIFY_CLIENT_SECRET = <value>
DATABASE_URL = <value>
```

Note: The database is using [Planetscale](https://planetscale.com/) and the Prisma MySQL adapater, so you may need to adjust that for your needs.

Ensure all packages are installed by running:

```sh
npm install
```

Run

```sh
npm run dev
```

Open up [http://localhost:8888](http://localhost:8888), and you're ready to go!

### Serve your site locally

To serve your site locally in a production-like environment, run

```sh
npm run start
```

Your site will be available at [http://localhost:8888](http://localhost:8888). Note that it will not auto-reload when you make changes.

## Built using Remix

- [Remix Docs](https://remix.run/docs)
- [Netlify Edge Functions Overview](https://docs.netlify.com/edge-functions/overview/)
