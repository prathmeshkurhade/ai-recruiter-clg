import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, UserPlus, AlertCircle } from "lucide-react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    company: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed. Please Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[100vh] pt-20 flex items-center justify-center bg-[#0a0a0f] p-6 relative overflow-hidden flex-1">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-[#14141e]/80 backdrop-blur-xl border border-[#1e1e2d] p-8 rounded-3xl shadow-[0_0_40px_rgba(0,240,255,0.05)] relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#0a0a0f] border border-[#1e1e2d] rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <Shield className="text-[#00f0ff] w-10 h-10" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-space font-bold text-white tracking-tight">Initialize Organization</h2>
          <p className="text-gray-400 mt-2 text-sm">Join the HireForge AI Matrix</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input 
                type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
                placeholder="Jane Doe" required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company</label>
              <input 
                type="text" name="company" value={formData.company} onChange={handleChange}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
                placeholder="Tech Corp" required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              placeholder="jane@techcorp.com" required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Passkey</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange}
              className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all"
              placeholder="••••••••" required
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className={`w-full bg-[#00f0ff] text-black font-space font-bold text-lg py-3 flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <UserPlus size={20} />
            {loading ? "Registering..." : "Initialize"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an employer ID? <Link to="/login" className="text-[#00f0ff] hover:text-white transition-colors underline underline-offset-4 decoration-[#00f0ff]/30">Authenticate Interface</Link>
        </div>
      </motion.div>
    </div>
  );
}
