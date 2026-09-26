// Keeps the canonical link and the og:url meta in step with the current route.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://ibtisam-iq.com";

// index.html ships a single canonical pointing at the site root. Without this,
// every route would tell search engines the homepage is the real page.
export function useCanonical() {
  const { pathname } = useLocation();

  useEffect(() => {
    // One trailing slash, always: that is the form the host serves with 200 and the form
    // scripts/prerender-meta.js writes into the shell, so the tag never changes value
    // between the HTML and the running app.
    const url = `${SITE}${pathname.replace(/\/*$/, "/")}`;

    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", url);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.setAttribute("content", url);
  }, [pathname]);
}
