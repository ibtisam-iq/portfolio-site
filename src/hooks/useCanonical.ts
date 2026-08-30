// Keeps the canonical link and the og:url meta in step with the current route.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://ibtisam-iq.com";

// index.html ships a single canonical pointing at the site root. Without this,
// every route would tell search engines the homepage is the real page.
export function useCanonical() {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE}${pathname === "/" ? "" : pathname}`;

    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", url);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.setAttribute("content", url);
  }, [pathname]);
}
