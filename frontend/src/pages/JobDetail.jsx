import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
    api.get(`/matching/${id}/results`).then((res) => setResults(res.data)).catch(() => {});
  }, [id]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    await api.post(`/resumes/${id}/upload`, formData);
    setUploading(false);
    alert("Resumes uploaded successfully!");
  };

  const handleMatch = async () => {
    const res = await api.post(`/matching/${id}/run`);
    setResults(res.data);
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <Link to="/dashboard">Back to Dashboard</Link>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <p><strong>Skills:</strong> {job.required_skills.join(", ")}</p>
      <p><strong>Experience:</strong> {job.experience_level || "N/A"}</p>

      <hr />

      <h2>Upload Resumes</h2>
      <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}

      <h2>
        Ranked Candidates
        <button onClick={handleMatch} style={{ marginLeft: 10, fontSize: 14 }}>
          Run Matching
        </button>
      </h2>

      {results.length === 0 ? (
        <p>No results yet. Upload resumes and run matching.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={th}>Rank</th>
              <th style={th}>Candidate</th>
              <th style={th}>Score</th>
              <th style={th}>Matched Skills</th>
              <th style={th}>Missing Skills</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.id}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{r.candidate_name || `Resume #${r.resume_id}`}</td>
                <td style={td}>{(r.similarity_score * 100).toFixed(1)}%</td>
                <td style={td}>{r.skill_matches?.matched?.join(", ") || "-"}</td>
                <td style={td}>{r.skill_matches?.missing?.join(", ") || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = { borderBottom: "2px solid #333", padding: 8, textAlign: "left" };
const td = { borderBottom: "1px solid #ddd", padding: 8 };
