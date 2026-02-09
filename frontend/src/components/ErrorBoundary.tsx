import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex min-h-screen items-center justify-center gap-4">
          <div className="container mx-auto flex flex-col items-center gap-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-semibold">Something Went Wrong</h1>
              <p className="text-base font-normal text-slate-500">
                An unexpected error occurred. Please try again.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50"
              >
                Try Again
              </button>
              <Link
                to="/"
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-950 transition-colors hover:bg-slate-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
