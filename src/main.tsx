// The entry point: attaches the application to the shell in index.html and puts the
// router around it.

import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Vite sets BASE_URL from its `base` config: "/" in production, and the preview sub-path
// on a pull request, so the router's paths follow the deployment rather than assuming the
// site is served from a domain root.
const tree = (
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

const root = document.getElementById("root")!;

// The build writes each route's HTML into the shell, so there is almost always markup
// here to adopt rather than replace. The empty branch is the dev server, where Vite
// serves index.html untouched. See src/entry-server.tsx.
if (root.firstChild) hydrateRoot(root, tree);
else createRoot(root).render(tree);
