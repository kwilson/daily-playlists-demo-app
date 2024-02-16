import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css';
import { Main } from './components/Main';
import { Anchor } from './components/Anchor';

export const meta: MetaFunction = () => [
  {
    title: 'Daily Playlists Demo App',
  },
];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export default function App() {
  return (
    <html className="bg-app-bg" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Main>
          <header className="text-center p-4">
            <h1 className="text-4xl md:text-6xl leading-normal text-electric-violet-200">
              <Anchor to="/">Song Searcher</Anchor>
            </h1>
          </header>
          <Outlet />

          <footer className="py-8 mt-8 border-t border-electric-violet-400 text-center">
            <p className="text-electric-violet-100">
              Code available on{' '}
              <Anchor to="https://github.com/kwilson/daily-playlists-demo-app">
                Github
              </Anchor>
            </p>
          </footer>
        </Main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html className="bg-app-bg" lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <Main>
          <header className=" text-center">
            <h1 className="text-6xl leading-none text-electric-violet-200">
              <Anchor to="/">Song Searcher</Anchor>
            </h1>
          </header>
          <div className="text-center flex flex-col gap-4">
            <p>Sorry, something has gone wrong loading this page.</p>

            <p>
              <Anchor to="/">Home</Anchor>
            </p>
          </div>
        </Main>
        <Scripts />
      </body>
    </html>
  );
}
