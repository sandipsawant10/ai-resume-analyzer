import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { loginUser } from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError("All fields are required");
    } else {
      setError(null);
      setLoading(true);
      try {
        const res = await loginUser(email, password);
        if (!res.token) {
          throw new Error("Login failed. Please check your credentials.");
        }
        navigate("/");
      } catch (error) {
        setError(
          "Login failed. Please check your credentials. " + error.message,
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-semibold">AI Resume Analyzer</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to unlock premium resume intelligence.
          </p>
        </div>

        <Card className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-10 text-slate-500">
                <Mail size={16} />
              </span>
              <Input
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="pl-10"
              />
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-10 text-slate-500">
                <Lock size={16} />
              </span>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-10 text-slate-400 transition hover:text-slate-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                  Signing in
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-slate-400">
          New here?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
