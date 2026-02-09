import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center gap-4">
      <div className="container mx-auto flex flex-col items-center gap-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold">Join DropZone</h1>
          <p className="text-base font-normal text-slate-500">Create an account to get started.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-4">
          <div className="flex w-full flex-col items-start gap-2">
            <label htmlFor="email">Email</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label htmlFor="password">Password</label>
            <div className="flex w-full items-center justify-between rounded-lg border border-slate-300 px-4 py-2">
              <input
                className="focus:outline-none"
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {showPassword ? (
                <EyeIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 transition-colors hover:text-slate-600"
                  size={16}
                />
              ) : (
                <EyeOffIcon
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 transition-colors hover:text-slate-600"
                  size={16}
                />
              )}
            </div>
            <label htmlFor="name">Name</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:outline-none"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          {error && <div className="w-full text-sm text-red-500">{error}</div>}
          <button
            className="w-full rounded-lg bg-slate-950 px-4 py-2 text-slate-50"
            disabled={isRegistering}
            type="submit"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-sm font-normal text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-slate-950 underline transition-colors hover:text-slate-900"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};
