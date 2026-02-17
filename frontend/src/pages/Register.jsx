import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { registerUser } from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const passwordScore = () => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  const strength = passwordScore();
  const strengthLabel =
    strength <= 1
      ? "Weak"
      : strength === 2
        ? "Fair"
        : strength === 3
          ? "Good"
          : "Strong";
  const strengthWidth = `${(strength / 4) * 100}%`;
  const strengthColor =
    strength <= 1
      ? "bg-rose-500"
      : strength === 2
        ? "bg-amber-500"
        : strength === 3
          ? "bg-indigo-500"
          : "bg-emerald-500";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      name === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("password and confirmPassword should same");
      return;
    }

    try {
      const res = await registerUser(name, email, password, confirmPassword);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-app-bg px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute -top-16 left-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Get started
          </p>
          <h1 className="mt-3 text-3xl font-semibold">AI Resume Analyzer</h1>
          <p className="mt-2 text-sm text-slate-400">
            Create your account to access AI-powered insights.
          </p>
        </div>

        <Card className="glass p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-10 text-slate-500">
                <User size={16} />
              </span>
              <Input
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Lee"
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-10 text-slate-500">
                <Mail size={16} />
              </span>
              <Input
                label="Email"
                type="email"
                value={email}
                required
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
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Password strength</span>
                  <span className="text-slate-300">{strengthLabel}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full ${strengthColor}`}
                    style={{ width: strengthWidth }}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-10 text-slate-500">
                <Lock size={16} />
              </span>
              <Input
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="pl-10 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-3 top-10 text-slate-400 transition hover:text-slate-200"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
