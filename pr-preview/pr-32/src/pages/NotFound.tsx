import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const NotFound = () => {
  useDocumentTitle("Page Not Found");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-light-text dark:text-text-primary">
      <p className="mb-2 font-mono text-sm uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
        Error
      </p>
      <p className="mb-4 text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
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
        className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
