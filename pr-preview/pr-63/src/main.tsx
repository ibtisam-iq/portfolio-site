// The entry point: mounts the application into the shell in index.html and puts the
// router around it.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Vite sets BASE_URL from its `base` config: "/" in production, and the preview sub-path
// on a pull request, so the router's paths follow the deployment rather than assuming the
// site is served from a domain root.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
