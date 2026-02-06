import { useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../services/api";

export const Share = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [password, setPassword] = useState<string>("");
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
        maxRedirects: 0,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 302 || response.status === 200) {
        // Redirect to file URL
        if (response.data.url) {
          window.location.href = response.data.url;
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
    <section className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="container mx-auto px-4 text-center">
        <h1>Shared File</h1>

        {needsPassword ? (
          <form onSubmit={handleAccess}>
            <p>This file is password protected</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Access File"}
            </button>
          </form>
        ) : (
          <button onClick={() => handleAccess()} disabled={loading}>
            {loading ? "Loading..." : "Access File"}
          </button>
        )}

        {error && <div>{error}</div>}
      </div>
    </section>
  );
};
