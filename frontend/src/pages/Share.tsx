import { useState, type FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../services/api";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const Share = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [needsPassword, setNeedsPassword] = useState<boolean>(false);

  const handleAccess = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params = password ? `?password=${encodeURIComponent(password)}` : "";
      const response = await axiosInstance.get(`/share/${shortCode}${params}`, {
        withCredentials: false, // Don't send credentials to avoid CORS issues if redirected to Cloudinary
        maxRedirects: 0,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 302 || response.status === 200) {
        // Handle both JSON response and followed redirects
        const finalUrl = response.data.url || (response.request && response.request.responseURL);
        
        if (finalUrl) {
          window.location.href = finalUrl;
        } else {
          setError("Error: Could not retrieve file URL");
        }
      } else if (response.status === 401) {
        setNeedsPassword(true);
        setError("Password required");
      } else if (response.status === 410) {
        setError("This link has expired");
      } else {
        setError("Error accessing file");
      }
    } catch (error) {
      console.error(error);
      setError("Error accessing file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center gap-4">
      <div className="container mx-auto flex flex-col items-center gap-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">Shared File</h1>
          <p className="text-base font-normal text-slate-500">
            {needsPassword
              ? "This file is password protected"
              : "Click below to access the shared file"}
          </p>
        </div>

        {needsPassword ? (
          <form onSubmit={handleAccess} className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-2">
              <label htmlFor="password">Password</label>
              <div className="flex w-full items-center justify-between rounded-lg border border-slate-300 px-4 py-2">
                <input
                  className="flex-1 focus:outline-none"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <EyeIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-slate-500 transition-colors hover:text-slate-600"
                    size={16}
                  />
                ) : (
                  <EyeOffIcon
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer text-slate-500 transition-colors hover:text-slate-600"
                    size={16}
                  />
                )}
              </div>
            </div>
            {error && error !== "Password required" && (
              <div className="w-full text-sm text-red-500">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 px-4 py-2 text-slate-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Access File"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            {error && <div className="text-sm text-red-500">{error}</div>}
            <button
              onClick={() => handleAccess()}
              disabled={loading}
              className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Access File"}
            </button>
          </div>
        )}

        <p className="text-sm font-normal text-slate-500">
          Want to share your own files?{" "}
          <Link
            to="/register"
            className="text-slate-950 underline transition-colors hover:text-slate-900"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
};
