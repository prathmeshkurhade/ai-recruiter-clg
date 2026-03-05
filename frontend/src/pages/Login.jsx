import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "", company: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) {
        await api.post("/auth/signup", form);
      }
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      login(res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h1>{isSignup ? "Sign Up" : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              placeholder="Full Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              required
              style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
              placeholder="Company (optional)"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ width: "100%", padding: 10, marginBottom: 10 }}>
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}
