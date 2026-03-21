import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Save, BrainCircuit, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function JobForm() {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !description.trim()) {
      setError("Title and Prototype parameters are required.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post("http://localhost:8000/api/jobs/", {
        title: jobTitle,
        description: description,
        required_skills: [],
        experience_level: null,
        qualifications: null
      }, { headers });
      
      // Redirect to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to initialize Job Vector. " + (err.response?.data?.detail || err.message));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-space font-bold text-white tracking-tight">Holographic Job Creator</h1>
          <p className="text-gray-400 mt-2 text-lg">Define the semantic embedding space for your next hire.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Title</label>
              <input 
                type="text" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-4 text-white font-space text-lg focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all shadow-inner"
                placeholder="e.g. Senior Machine Learning Engineer"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Semantic Prompt</label>
                <div className="flex items-center gap-1 text-[#00f0ff] text-xs font-bold bg-[#00f0ff]/10 px-2 py-1 rounded">
                  <Sparkles size={12} />
                  GEN-UI ASSIST
                </div>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2d] rounded-xl px-4 py-4 text-gray-300 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all resize-none font-inter"
                placeholder="Describe the role, responsibilities, and ideal candidate persona. The AI will extract embedded skills automatically..."
              />
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-[#1e1e2d]">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <BrainCircuit size={16} />
                <span>Auto-Extraction engine active</span>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className={`bg-[#00f0ff] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                {loading ? "Initializing..." : "Initialize Job Vector"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
