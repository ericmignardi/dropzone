import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Home = () => {
  const { user } = useAuth();

  return (
    <section className="flex min-h-screen items-center justify-center gap-4">
      <div className="container mx-auto flex flex-col items-center gap-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">Welcome to DropZone</h1>
          <p className="text-base font-normal text-slate-500">
            Share files securely with password protection and expiring links.
          </p>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50 transition-colors hover:bg-slate-900"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50 transition-colors hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-950 transition-colors hover:bg-slate-50"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
