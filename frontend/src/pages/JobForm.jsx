import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function JobForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    experience_level: "",
    qualifications: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      required_skills: form.required_skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    await api.post("/jobs", payload);
    navigate("/dashboard");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1>Create Job Description</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={5}
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          placeholder="Required Skills (comma-separated)"
          value={form.required_skills}
          onChange={(e) => setForm({ ...form, required_skills: e.target.value })}
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          placeholder="Experience Level (e.g. 2-5 years)"
          value={form.experience_level}
          onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <textarea
          placeholder="Qualifications"
          value={form.qualifications}
          onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
          rows={3}
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" style={{ padding: 10, marginRight: 10 }}>Create Job</button>
        <button type="button" onClick={() => navigate("/dashboard")}>Cancel</button>
      </form>
    </div>
  );
}
