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
    <section className="flex min-h-screen flex-col justify-center gap-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Upload */}
        <div>
          <form onSubmit={handleSubmit}>
            <input type="file" name="file" accept="audio/*" />
            <button disabled={uploading} type="submit">
              {uploading ? "Uploading..." : "Upload"}
            </button>
            {uploadError && <div>{uploadError}</div>}
          </form>
        </div>

        {/* Files */}
        <div>
          {loading && <div>Loading files...</div>}
          {!loading && files.length === 0 && <div>No files</div>}
          {files.map((file) => (
            <div key={file.id}>
              <span>{file.name}</span>
              <button onClick={() => handleDelete(file.id)} disabled={deletingId === file.id}>
                {deletingId === file.id ? "Deleting..." : "Delete"}
              </button>
              <button onClick={() => handleShare(file.id)} disabled={sharingId === file.id}>
                {sharingId === file.id ? "Creating..." : "Share"}
              </button>
            </div>
          ))}
          {error && <div>{error}</div>}
          {deleteError && <div>{deleteError}</div>}
        </div>

        {/* Share Options */}
        <div>
          <h3>Share Options</h3>
          <input
            type="password"
            placeholder="Password (optional)"
            value={sharePassword}
            onChange={(e) => setSharePassword(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="Expiry (optional)"
            value={shareExpiry}
            onChange={(e) => setShareExpiry(e.target.value)}
          />
        </div>

        {/* Share Link Result */}
        {shareLink && (
          <div>
            <p>Share Link:</p>
            <input type="text" value={shareLink} readOnly />
            <button onClick={copyToClipboard}>Copy</button>
          </div>
        )}
        {shareError && <div>{shareError}</div>}
      </div>
    </section>
  );
};
