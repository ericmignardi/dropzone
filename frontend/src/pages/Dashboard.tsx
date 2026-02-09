import { useEffect, useState, type FormEvent } from "react";
import type { UserFile } from "../types/auth";
import { axiosInstance } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { socket } from "../hooks/useSocket";

export const Dashboard = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [sharePassword, setSharePassword] = useState<string>("");
  const [shareExpiry, setShareExpiry] = useState<string>("");

  const { logout, isLoggingOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/upload/files");
        if (response.status === 200) {
          setFiles(response.data.files);
        } else {
          setFiles([]);
          setError("Error fetching files");
        }
      } catch (error) {
        console.error(error);
        setFiles([]);
        setError("Error fetching files");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  useEffect(() => {
    if (!user) return;

    socket.on(`file:uploaded:${user.id}`, (data) => {
      setFiles((prev) => [...prev, data.file]);
    });

    socket.on(`file:deleted:${user.id}`, (data) => {
      setFiles((prev) => prev.filter((file) => file.id !== data.fileId));
    });

    return () => {
      socket.off(`file:uploaded:${user.id}`);
      socket.off(`file:deleted:${user.id}`);
    };
  }, [user?.id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData(e.currentTarget);

      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setFiles((prev) => [...prev, response.data.file]);
        e.currentTarget.reset();
      }
    } catch (error) {
      console.error(error);
      setUploadError("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDelete = async (fileId: string) => {
    setDeletingId(fileId);
    setDeleteError(null);
    try {
      const response = await axiosInstance.delete(`/upload/files/${fileId}`);
      if (response.status === 204) {
        setFiles(files.filter((file) => file.id !== fileId));
      } else {
        setDeleteError("Error deleting file");
      }
    } catch (error) {
      console.error(error);
      setDeleteError("Error deleting file");
    } finally {
      setDeletingId(null);
    }
  };

  const handleShare = async (fileId: string) => {
    setSharingId(fileId);
    setShareError(null);
    setShareLink(null);

    try {
      const body: { password?: string; expiresAt?: string } = {};
      if (sharePassword) body.password = sharePassword;
      if (shareExpiry) body.expiresAt = new Date(shareExpiry).toISOString();

      const response = await axiosInstance.post(`/share/${fileId}`, body);

      if (response.status === 201) {
        const baseUrl = window.location.origin;
        setShareLink(`${baseUrl}/share/${response.data.link.shortCode}`);
        setSharePassword("");
        setShareExpiry("");
      } else {
        setShareError("Error creating share link");
      }
    } catch (error) {
      console.error(error);
      setShareError("Error creating share link");
    } finally {
      setSharingId(null);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center gap-4">
      <div className="container mx-auto flex flex-col gap-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-base font-normal text-slate-500">Manage your files</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-950 transition-colors hover:bg-slate-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-6">
          <h2 className="text-lg font-semibold">Upload File</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="file"
              name="file"
              accept="audio/*"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-slate-50"
            />
            <button
              disabled={uploading}
              type="submit"
              className="w-full rounded-lg bg-slate-950 px-4 py-2 text-slate-50 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {uploadError && <div className="text-sm text-red-500">{uploadError}</div>}
          </form>
        </div>

        {/* Files */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Your Files</h2>
          {loading && <div className="text-slate-500">Loading files...</div>}
          {!loading && files.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-slate-500">
              No files uploaded yet
            </div>
          )}
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-slate-300 p-4"
              >
                <span className="font-medium">{file.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare(file.id)}
                    disabled={sharingId === file.id}
                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm text-slate-50 disabled:opacity-50"
                  >
                    {sharingId === file.id ? "Creating..." : "Share"}
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingId === file.id}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-950 transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    {deletingId === file.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          {deleteError && <div className="text-sm text-red-500">{deleteError}</div>}
        </div>

        {/* Share Options */}
        <div className="flex flex-col gap-4 rounded-lg border border-dashed border-slate-300 p-6">
          <h2 className="text-lg font-semibold">Share Options</h2>
          <p className="text-sm text-slate-500">
            Configure options before clicking Share on a file
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="sharePassword" className="text-sm">
                Password (optional)
              </label>
              <input
                id="sharePassword"
                type="password"
                placeholder="Enter password"
                value={sharePassword}
                onChange={(e) => setSharePassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="shareExpiry" className="text-sm">
                Expiry (optional)
              </label>
              <input
                id="shareExpiry"
                type="datetime-local"
                value={shareExpiry}
                onChange={(e) => setShareExpiry(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Share Link Result */}
        {shareLink && (
          <div className="flex flex-col gap-4 rounded-lg border border-green-300 bg-green-50 p-6">
            <h2 className="text-lg font-semibold text-green-800">Share Link Created</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-slate-950 px-4 py-2 text-slate-50"
              >
                Copy
              </button>
            </div>
          </div>
        )}
        {shareError && <div className="text-sm text-red-500">{shareError}</div>}
      </div>
    </section>
  );
};
