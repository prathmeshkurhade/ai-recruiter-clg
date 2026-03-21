import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Fingerprint, AlertCircle } from "lucide-react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect immediately if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password
      });
      login(response.data.access_token);
    } catch (err) {
      setError(err.response?.data?.detail || "Authentication Failed. Invalid Passkey.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] pt-20 flex items-center justify-center bg-[#0a0a0f] p-6 relative overflow-hidden flex-1">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#14141e]/80 backdrop-blur-xl border border-[#1e1e2d] p-8 rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.05)] relative z-10"
      >
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-[#0a0a0f] border border-[#1e1e2d] rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Shield className="text-[#00f0ff] w-10 h-10" />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-space font-bold text-white tracking-tight">Access AIRecruiter Core</h2>
          <p className="text-gray-400 mt-2 text-sm">Authenticate into the AIRecruiter Matrix</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              placeholder="Enter your employer email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passkey</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className={`w-full bg-[#00f0ff] text-black font-space font-bold text-lg py-3 flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Fingerprint size={20} />
            {loading ? "Authenticating..." : "Authenticate"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an employer ID? <Link to="/register" className="text-[#00f0ff] hover:text-white transition-colors underline underline-offset-4 decoration-[#00f0ff]/30">Register Organization</Link>
        </div>
      </motion.div>
    </div>
  );
}
