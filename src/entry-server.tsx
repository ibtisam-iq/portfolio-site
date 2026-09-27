// The server half of the build: renders one route to HTML so the shell arrives with the
// page already in it. scripts/prerender-meta.js calls this once per route and injects
// what it returns; src/main.tsx hydrates the result in the browser.

// The tree here mirrors src/main.tsx exactly, down to StrictMode. A structural difference
// between the two is a hydration mismatch waiting to happen.

import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

export function render(path: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={path}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );
}
