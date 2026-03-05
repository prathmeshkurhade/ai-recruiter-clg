import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/jobs").then((res) => setJobs(res.data)).catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Recruiter Dashboard</h1>
        <div>
          <Link to="/jobs/new" style={{ marginRight: 10 }}>+ New Job</Link>
          <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <p>No job descriptions yet. Create one to get started.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {jobs.map((job) => (
            <li key={job.id} style={{ border: "1px solid #ddd", padding: 15, marginBottom: 10, borderRadius: 5 }}>
              <Link to={`/jobs/${job.id}`}>
                <h3>{job.title}</h3>
              </Link>
              <p>{job.description.substring(0, 150)}...</p>
              <small>Skills: {job.required_skills.join(", ") || "None specified"}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
