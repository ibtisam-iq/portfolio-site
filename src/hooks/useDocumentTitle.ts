import { useEffect } from "react";

const BASE = "Muhammad Ibtisam Iqbal | DevOps & Cloud Engineer";

export function useDocumentTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${page} | Muhammad Ibtisam Iqbal` : BASE;
    return () => { document.title = BASE; };
  }, [page]);
}
