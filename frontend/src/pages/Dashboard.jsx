import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Eye,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Sparkles,
  Trash2,
  UploadCloud,
  UserCircle2,
  X,
} from "lucide-react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const historyRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setError("Please select a file first.");
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/resume/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const resumeHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/resume/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch history");
      }
      const data = await res.json();
      setHistory(data.resumes || []);
    } catch (error) {
      setError(error.message);
    }
  };

  const scrollToHistory = () => {
    historyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    resumeHistory();
  }, []);

  useEffect(() => {
    if (result?.resume) {
      resumeHistory();
    }
  }, [result?.resume]);

  const deleteResume = async (resumeId) => {
    try {
      const res = await fetch(`${API_URL}/resume/my/${resumeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete resume");
      }

      setHistory((prev) => prev.filter((resume) => resume._id !== resumeId));
    } catch (error) {
      setError(error.message);
    }
  };

  const viewResumeAnalysis = (resume) => {
    setError(null);
    setResult({
      message: "Loaded from history",
      aiAnalysis: resume.analysis,
      resume,
    });
  };

  const updateResume = async (resumeId, updatedFile) => {
    try {
      if (!updatedFile) {
        setError("Please select a file to update.");
        return;
      }

      setUpdatingId(resumeId);
      setError(null);

      const formData = new FormData();
      formData.append("resume", updatedFile);

      const res = await fetch(`${API_URL}/resume/my/${resumeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update resume");
      }

      const data = await res.json();
      setResult(data);
      if (data?.resume) {
        setHistory((prev) =>
          prev.map((resume) =>
            resume._id === resumeId ? data.resume : resume,
          ),
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const parseAiAnalysis = (text) => {
    if (!text) {
      return {
        score: "",
        atsScore: "",
        skills: "",
        strengths: "",
        weaknesses: "",
        suggestions: "",
        improvements: "",
      };
    }

    const scoreMatch = text.match(
      /(?:resume\s*score|score)\s*[:\-]\s*([^\n]+)/i,
    );
    const atsMatch = text.match(/ats\s*score\s*[:\-]\s*([^\n]+)/i);
    const skillsMatch = text.match(
      /skills?\s*[:\-]\s*([\s\S]*?)(?=\n\s*(strengths?|weaknesses?|improvements?|areas?\s*to\s*improve|suggestions?|recommendations?)\s*[:\-]|$)/i,
    );
    const strengthsMatch = text.match(
      /strengths?\s*[:\-]\s*([\s\S]*?)(?=\n\s*(weaknesses?|improvements?|areas?\s*to\s*improve|suggestions?|recommendations?)\s*[:\-]|$)/i,
    );
    const weaknessesMatch = text.match(
      /weaknesses?\s*[:\-]\s*([\s\S]*?)(?=\n\s*(improvements?|areas?\s*to\s*improve|suggestions?|recommendations?)\s*[:\-]|$)/i,
    );
    const suggestionsMatch = text.match(
      /(suggestions?|recommendations?)\s*[:\-]\s*([\s\S]*?)(?=\n\s*(improvements?|areas?\s*to\s*improve)\s*[:\-]|$)/i,
    );
    const improvementsMatch = text.match(
      /(improvements?|areas?\s*to\s*improve)\s*[:\-]\s*([\s\S]*)/i,
    );

    return {
      score: scoreMatch?.[1]?.trim() || "",
      atsScore: atsMatch?.[1]?.trim() || "",
      skills: skillsMatch?.[1]?.trim() || "",
      strengths: strengthsMatch?.[1]?.trim() || "",
      weaknesses: weaknessesMatch?.[1]?.trim() || "",
      suggestions: suggestionsMatch?.[2]?.trim() || "",
      improvements: improvementsMatch?.[2]?.trim() || "",
    };
  };

  const toPercent = (value) => {
    const cleaned = String(value || "").replace(/[^0-9.]/g, "");
    const number = Number(cleaned);
    if (Number.isNaN(number)) {
      return null;
    }
    return Math.min(100, Math.max(0, number));
  };

  const analysisText = result?.aiAnalysis || "";
  const {
    score,
    atsScore: parsedAts,
    skills,
    strengths: parsedStrengths,
    weaknesses: parsedWeaknesses,
    suggestions: parsedSuggestions,
    improvements,
  } = parseAiAnalysis(analysisText);
  const resumeScore = result?.resumeScore || score || "N/A";
  const atsScore =
    result?.atsScore || result?.ats || parsedAts || score || "N/A";
  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  let strengths = result?.strengths || parsedStrengths || skills || "N/A";
  let weaknesses =
    result?.weaknesses || parsedWeaknesses || improvements || "N/A";
  let suggestions = result?.suggestions || parsedSuggestions || "N/A";

  if (normalizeText(strengths) === normalizeText(weaknesses)) {
    weaknesses = parsedWeaknesses || "N/A";
  }

  if (normalizeText(strengths) === normalizeText(suggestions)) {
    suggestions = parsedSuggestions || "N/A";
  }

  if (normalizeText(weaknesses) === normalizeText(suggestions)) {
    suggestions = "N/A";
  }
  const resumePercent = toPercent(resumeScore);
  const atsPercent = toPercent(atsScore);

  const normalizeWhitespace = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const splitItems = (content) => {
    if (!content) {
      return [];
    }
    if (/\d+\./.test(content)) {
      return content
        .split(/\s(?=\d+\.)/)
        .map((item) => item.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean);
    }
    if (content.includes(" - ")) {
      return content
        .split(/\s-\s/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [content.trim()];
  };

  const buildSections = (text) => {
    if (!text) {
      return [];
    }
    const normalized = normalizeWhitespace(text).replace(
      /###\s*([^#]+)/g,
      "**$1**",
    );
    const sections = [];
    const headerRegex = /\*\*([^*]+)\*\*:?/g;
    let lastIndex = 0;
    let lastTitle = "Overview";
    let match = null;

    while ((match = headerRegex.exec(normalized)) !== null) {
      if (match.index > lastIndex) {
        const content = normalized.slice(lastIndex, match.index).trim();
        if (content) {
          sections.push({ title: lastTitle, content });
        }
      }
      lastTitle = match[1].trim().replace(/:$/, "");
      lastIndex = headerRegex.lastIndex;
    }

    const tail = normalized.slice(lastIndex).trim();
    if (tail) {
      sections.push({ title: lastTitle, content: tail });
    }

    return sections.length
      ? sections
      : [{ title: "Overview", content: normalized }];
  };

  const renderReadableText = (text) => {
    const cleaned = normalizeWhitespace(text);
    if (!cleaned || cleaned.toLowerCase() === "n/a") {
      return <p className="text-sm text-slate-500">N/A</p>;
    }
    const sections = buildSections(cleaned);

    return (
      <div className="space-y-4">
        {sections.map((section, sectionIndex) => (
          <div key={`${section.title}-${sectionIndex}`} className="space-y-2">
            <p className="text-sm font-medium text-slate-200">
              {section.title}
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              {splitItems(section.content).map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const getUserProfile = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return { email: "", name: "User" };
      }
      const payload = token.split(".")[1];
      if (!payload) {
        return { email: "", name: "User" };
      }
      const decoded = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
      );
      const email = decoded?.email || "";
      const nameSeed = email.split("@")[0] || "User";
      const name = nameSeed
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
      return { email, name: name || "User" };
    } catch {
      return { email: "", name: "User" };
    }
  };

  const { email: userEmail, name: userName } = getUserProfile();

  return (
    <div className="min-h-screen bg-app-bg text-white">
      <div className="relative flex">
        <button
          type="button"
          className="absolute left-4 top-4 z-30 rounded-xl border border-slate-800/70 bg-slate-900/70 p-2 text-slate-200 shadow-soft transition hover:bg-slate-800 md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 md:hidden"
          />
        ) : null}

        <aside
          className={`fixed left-0 top-0 z-30 h-full w-72 border-r border-slate-800/60 bg-slate-950/80 px-6 py-8 backdrop-blur transition duration-300 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-base font-semibold">AI Resume Analyzer</p>
                <p className="text-xs text-slate-400">Premium SaaS</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-xl border border-slate-800/70 bg-slate-900/70 p-2 text-slate-200 md:hidden"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            <button
              type="button"
              onClick={() => setActiveNav("dashboard")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                activeNav === "dashboard"
                  ? "bg-indigo-500/20 text-white shadow-inner shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav("history");
                resumeHistory();
                scrollToHistory();
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                activeNav === "history"
                  ? "bg-indigo-500/20 text-white shadow-inner shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <History size={18} />
              Resume History
            </button>
          </nav>

          <div className="mt-auto pt-10">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-800/70 px-4 py-3 text-sm font-medium text-slate-200 transition-all duration-300 hover:bg-slate-800"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-h-screen flex-1 px-6 pb-20 pt-20 md:px-12 md:pt-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
            <header className="flex flex-col gap-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Dashboard
              </p>
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-semibold">
                    Resume Intelligence
                  </h1>
                  <p className="mt-2 text-sm text-slate-400">
                    Upload a resume and receive ATS-optimized insights in
                    seconds.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-xs text-indigo-200">
                    <Sparkles size={14} className="text-indigo-300" />
                    AI powered analysis
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-xs text-purple-200">
                    <Crown size={14} className="text-purple-300" />
                    Pro
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 backdrop-blur-lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40">
                    <UserCircle2 className="text-indigo-200" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-slate-400">
                      {userEmail || "Signed in"}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-700/70 bg-slate-950/50 px-3 py-1 text-xs text-slate-300">
                  Active
                </span>
              </div>
            </header>

            {error ? (
              <div className="flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                <AlertTriangle size={18} />
                {error}
              </div>
            ) : null}

            {result && !loading ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <CheckCircle2 size={18} />
                Analysis complete. Review the insights below.
              </div>
            ) : null}

            <Card className="p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Upload Resume</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Drag and drop your latest resume or choose a file to
                    analyze.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800"
                  >
                    Choose file
                  </label>
                  <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className="min-w-[140px]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                        Analyzing
                      </span>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </div>
              </div>

              <label
                htmlFor="resume-upload"
                className="group mt-8 flex cursor-pointer flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-slate-700/80 bg-slate-950/40 px-8 py-14 text-center transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 transition-all duration-300 group-hover:scale-105">
                  <UploadCloud className="text-indigo-300" size={28} />
                </div>
                <div>
                  <p className="text-base font-medium">Drag & drop resume</p>
                  <p className="mt-2 text-sm text-slate-500">
                    PDF, DOC, or DOCX supported. Max 10MB.
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {file ? `Selected: ${file.name}` : "No file selected"}
                </span>
              </label>

              {file ? (
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                      <FileText className="text-indigo-300" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        Ready for analysis
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                    {loading ? "Analyzing" : "Queued"}
                  </span>
                </div>
              ) : null}

              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
            </Card>

            <section className="grid gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Resume Insights</h2>
                <span className="text-xs text-slate-500">Updated just now</span>
              </div>

              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="animate-pulse p-5">
                      <div className="h-4 w-24 rounded-full bg-slate-800" />
                      <div className="mt-4 h-8 w-20 rounded-full bg-slate-800" />
                      <div className="mt-6 h-2 w-full rounded-full bg-slate-800" />
                    </Card>
                  ))}
                </div>
              ) : result ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="relative overflow-hidden p-6 lg:col-span-2">
                    <div className="absolute right-6 top-6 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                      Premium score
                    </div>
                    <p className="text-sm text-slate-400">Resume Score</p>
                    <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-4xl font-semibold">
                          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            {resumeScore || "N/A"}
                          </span>
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          AI-evaluated resume strength
                        </p>
                      </div>
                      <div className="relative flex h-32 w-32 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-slate-900" />
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `conic-gradient(#6366f1 ${
                              (resumePercent ?? 0) * 3.6
                            }deg, #1e293b 0deg)`,
                          }}
                        />
                        <div className="absolute inset-2 rounded-full bg-slate-950" />
                        <span className="relative text-lg font-semibold text-slate-100">
                          {resumePercent ?? 0}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 h-2 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{ width: `${resumePercent ?? 0}%` }}
                      />
                    </div>
                  </Card>
                  <Card className="p-5">
                    <p className="text-sm text-slate-400">ATS Score</p>
                    <p className="mt-3 text-3xl font-semibold">
                      <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                        {atsScore || "N/A"}
                      </span>
                    </p>
                    <div className="mt-4 h-2 w-full rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                        style={{ width: `${atsPercent ?? 0}%` }}
                      />
                    </div>
                  </Card>
                  <Card className="p-5">
                    <p className="text-sm text-slate-400">Strengths</p>
                    <div className="mt-3">{renderReadableText(strengths)}</div>
                  </Card>
                  <Card className="p-5">
                    <p className="text-sm text-slate-400">Weaknesses</p>
                    <div className="mt-3">{renderReadableText(weaknesses)}</div>
                  </Card>
                  <Card className="p-5 md:col-span-2 xl:col-span-1">
                    <p className="text-sm text-slate-400">Suggestions</p>
                    <div className="mt-3">
                      {renderReadableText(suggestions)}
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="flex flex-col items-center gap-4 p-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800/60">
                    <FileText className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      Upload resume to analyze
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Your AI insights will appear here once the analysis is
                      complete.
                    </p>
                  </div>
                </Card>
              )}
            </section>

            <section
              ref={historyRef}
              className="grid gap-6 lg:grid-cols-[1.6fr_0.6fr]"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Resume History</h3>
                  <Button variant="secondary" size="sm" onClick={resumeHistory}>
                    Refresh
                  </Button>
                </div>
                <div className="mt-4 space-y-3">
                  {history.length > 0 ? (
                    history.map((resume) => (
                      <div
                        key={resume._id}
                        className="flex flex-col gap-3 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-4 transition-all duration-300 hover:bg-slate-800/40 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                            <FileText className="text-indigo-300" size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {resume.originalName || "Untitled"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {resume.createdAt
                                ? new Date(
                                    resume.createdAt,
                                  ).toLocaleDateString()
                                : "Unknown date"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => viewResumeAnalysis(resume)}
                            className="border-indigo-500/30 bg-indigo-500/10 text-indigo-100 hover:bg-indigo-500/20"
                          >
                            <Eye size={14} />
                            View
                          </Button>
                          <input
                            id={`update-${resume._id}`}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(event) =>
                              updateResume(resume._id, event.target.files?.[0])
                            }
                          />
                          <label
                            htmlFor={`update-${resume._id}`}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-800"
                          >
                            <RefreshCw size={14} />
                            {updatingId === resume._id ? "Updating" : "Update"}
                          </label>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => deleteResume(resume._id)}
                            className="border-rose-500/30 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20"
                          >
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      No resumes yet. Upload your first one to get started.
                    </p>
                  )}
                </div>
              </Card>

              <Card className="flex flex-col gap-4 p-6">
                <h3 className="text-lg font-medium">Quick Actions</h3>
                <p className="text-sm text-slate-400">
                  Manage your workspace or review past uploads.
                </p>
                <div className="mt-2 flex flex-col gap-3">
                  <Button onClick={resumeHistory} className="w-full">
                    <History size={16} />
                    View Resume History
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={logout}
                    className="w-full"
                  >
                    <LogOut size={16} />
                    Logout
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
