import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import styles from "~/global.css";
import darkMode from "~/dark.css";
export const meta: MetaFunction = () => {
  return {
    title: "Dev Mastery | Code Better.",
  };
};

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset/dist/reset.min.css",
    },
    { rel: "stylesheet", href: styles },
    {
      rel: "stylesheet",
      href: darkMode,
      media: "(prefers-color-scheme: dark)",
    },
  ];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
