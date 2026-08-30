// Sets the browser tab title for a routed page, and restores the site title on unmount.
// The site is a single page application, so nothing else updates the title on navigation.

import { useEffect } from "react";

const BASE = "Muhammad Ibtisam Iqbal | DevOps & Cloud Engineer";

export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | Muhammad Ibtisam Iqbal` : BASE;
    return () => { document.title = BASE; };
  }, [page]);
}
