// The 404 page. Also what a static host serves for an unknown path, through the 404.html
// that scripts/prerender-meta.js writes.

import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page Not Found");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-light-text dark:text-text-primary">
      <p className="eyebrow mb-2">
        Error
      </p>
      <p className="mb-4 text-8xl font-bold text-teal-accent">
        404
      </p>
      <h1 className="mb-4 text-3xl font-bold tracking-tight">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-center text-light-muted dark:text-text-muted">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="rounded-lg px-6 py-3 font-semibold bg-light-text text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-surface-0"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
