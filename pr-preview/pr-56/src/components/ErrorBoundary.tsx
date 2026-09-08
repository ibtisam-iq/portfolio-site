// The last resort when a render throws: a full-page message instead of a blank document.
//
// It wraps the router rather than sitting inside it, so a route that fails to render still
// leaves the reader somewhere to go. Returning to the home link clears the error state,
// because the boundary would otherwise stay tripped for the rest of the visit.

import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-light-text dark:text-text-primary">
          <p className="eyebrow mb-2">
            Error
          </p>
          <p className="text-6xl font-bold text-teal-accent mb-4">
            Oops
          </p>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-light-muted dark:text-text-muted mb-8 text-center max-w-md">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-lg font-semibold bg-light-text text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-surface-0"
          >
            Back to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
