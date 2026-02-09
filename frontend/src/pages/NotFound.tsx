import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <section className="flex min-h-screen items-center justify-center gap-4">
      <div className="container mx-auto flex flex-col items-center gap-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">Page Not Found</h1>
          <p className="text-base font-normal text-slate-500">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50 transition-colors hover:bg-slate-900"
        >
          Go Home
        </Link>
      </div>
    </section>
  );
};
