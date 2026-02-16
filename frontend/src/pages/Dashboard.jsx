import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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

      const res = await fetch("http://localhost:5000/resume/upload", {
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
      const res = await fetch("http://localhost:5000/resume/my", {
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

  const parseAiAnalysis = (text) => {
    if (!text) {
      return { score: "", skills: "", improvements: "" };
    }

    const scoreMatch = text.match(
      /(?:resume\s*score|score)\s*[:\-]\s*([^\n]+)/i,
    );
    const skillsMatch = text.match(
      /skills?\s*[:\-]\s*([\s\S]*?)(?=\n\s*(improvements?|areas?\s*to\s*improve)\s*[:\-]|$)/i,
    );
    const improvementsMatch = text.match(
      /(improvements?|areas?\s*to\s*improve)\s*[:\-]\s*([\s\S]*)/i,
    );

    return {
      score: scoreMatch?.[1]?.trim() || "",
      skills: skillsMatch?.[1]?.trim() || "",
      improvements: improvementsMatch?.[2]?.trim() || "",
    };
  };

  const analysisText = result?.aiAnalysis || "";
  const { score, skills, improvements } = parseAiAnalysis(analysisText);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing resume..." : "Upload"}
      </button>
      <p>{file ? `Selected file: ${file.name}` : "No file selected"}</p>
      <p>{error && `Error: ${error}`}</p>
      {result?.aiAnalysis ? (
        <div>
          <p>Resume Score: {score || "N/A"}</p>
          <p>Skills: {skills || "N/A"}</p>
          <p>Improvements: {improvements || "N/A"}</p>
        </div>
      ) : result ? (
        <p>{`Result: ${JSON.stringify(result)}`}</p>
      ) : null}
      {history.length > 0 ? (
        <div>
          <h3>Resume History</h3>
          <ul>
            {history.map((resume) => (
              <li key={resume._id}>
                <span>{resume.originalName || "Untitled"}</span>
                {" - "}
                <span>
                  {resume.createdAt
                    ? new Date(resume.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <button onClick={resumeHistory}>View Resume History</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
