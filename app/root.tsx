import type { LinksFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css';
import { Main } from './components/Main';

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'Daily Playlists Demo App',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
];

export default function App() {
  return (
    <html className="bg-app-bg" lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Main>
          <header className=" text-center">
            <h1 className="text-6xl leading-normal text-electric-violet-200">
              <a href="/">Song Searcher</a>
            </h1>
          </header>
          <Outlet />
        </Main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
