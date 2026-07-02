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
          <p className="mb-2 font-mono text-sm uppercase tracking-[0.2em] text-light-muted dark:text-text-faint">
            Error
          </p>
          <p className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Oops
          </p>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-light-muted dark:text-text-muted mb-8 text-center max-w-md">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            Back to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
