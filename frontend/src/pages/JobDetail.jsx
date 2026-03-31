import { Shield, Sparkles, MapPin, Target, RefreshCw, UploadCloud, Trash2, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CandidateDossier from "../components/CandidateDossier";

export default function JobDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [candidates, setCandidates] = useState(() => {
    const cached = sessionStorage.getItem(`job_cands_${id}`);
    return cached ? JSON.parse(cached) : [];
  });
  const [resumesPool, setResumesPool] = useState(() => {
    const cached = sessionStorage.getItem(`job_pool_${id}`);
    return cached ? JSON.parse(cached) : [];
  });
  const [job, setJob] = useState(() => {
    const cached = sessionStorage.getItem(`job_meta_${id}`);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!sessionStorage.getItem(`job_meta_${id}`));
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [expandedVector, setExpandedVector] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filterType, setFilterType] = useState("ALL");
  const fileInputRef = useRef(null);

  const fetchDetails = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // 1. Fetch Job Description details
      const jobRes = await axios.get(`http://localhost:8000/api/jobs/${id}`, { headers });
      setJob(jobRes.data);
      
      // 2. Fetch Base Candidate Pool
      const poolRes = await axios.get(`http://localhost:8000/api/resumes/${id}`, { headers });
      setResumesPool(poolRes.data);

      // 3. Fetch Match Rankings
      const matchesRes = await axios.get(`http://localhost:8000/api/matching/${id}/results`, { headers });
      
      const mappedCandidates = matchesRes.data.map(match => {
        const resume = poolRes.data.find(r => r.id === match.resume_id);
        const matchPercent = Math.round(match.similarity_score * 100);
        
        let status = "REVIEW_REQD";
        if (matchPercent > 80) status = "CLEAN_PASS";
        else if (matchPercent < 50) status = "LOW_MATCH";
        
        const missing = [];
        if (match.skill_matches) {
          for (const [skill, found] of Object.entries(match.skill_matches)) {
            if (!found) missing.push(skill);
          }
        }
        
        return {
          id: match.resume_id,
          match: matchPercent,
          rawScore: match.similarity_score,
          name: match.candidate_name || match.candidate_email || `CANDIDATE_${match.resume_id}`,
          status: status,
          missing: missing,
          rawSkills: match.skill_matches || {},
          decision_node: resume?.decision_node || "AWAITING_REVIEW",
          intel_notes: resume?.intel_notes || "",
          raw_text: resume?.raw_text || "",
          parsed_data: resume?.parsed_data || {}
        };
      });
      
      setCandidates(mappedCandidates);
      
      sessionStorage.setItem(`job_meta_${id}`, JSON.stringify(jobRes.data));
      sessionStorage.setItem(`job_pool_${id}`, JSON.stringify(poolRes.data));
      sessionStorage.setItem(`job_cands_${id}`, JSON.stringify(mappedCandidates));

      setLoading(false);
    } catch (err) {
      console.error("Job Detail fetch error:", err);
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (token && id) {
      fetchDetails();
    }
  }, [token, id, fetchDetails]);

  const handleUpdateCandidate = (resumeId, field, value) => {
    setCandidates(prev => prev.map(c => 
      c.id === resumeId ? { ...c, [field]: value } : c
    ));
    setResumesPool(prev => prev.map(r => 
      r.id === resumeId ? { ...r, [field]: value } : r
    ));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    setIsProcessing(true);
    try {
      const headers = { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data" 
      };
      
      // Only upload, do NOT execute automatic matching here!
      await axios.post(`http://localhost:8000/api/resumes/${id}/upload`, formData, { headers });
      
      // Reload mapping
      await fetchDetails();
    } catch (err) {
      console.error("Process error:", err);
      alert("Failed to process resumes: " + (err.response?.data?.detail || err.message));
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm("Remove this candidate from the pool?")) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:8000/api/resumes/${resumeId}`, { headers });
      await fetchDetails(); // Reload map and pools natively
    } catch (err) {
      alert("Failed to delete. " + (err.response?.data?.detail || err.message));
    }
  };

  const handleGenerateMatches = async () => {
    setIsMatching(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`http://localhost:8000/api/matching/${id}/run`, {}, { headers });
      await fetchDetails();
    } catch (err) {
      alert("Matching failed. " + (err.response?.data?.detail || err.message));
    } finally {
      setIsMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin text-[#00f0ff] w-10 h-10 mb-4" />
          <p className="text-gray-400 tracking-widest font-space text-lg">PROJECTING SPATIAL MAP...</p>
        </div>
      </div>
    );
  }

  const sortedCandidates = [...candidates].sort((a, b) => b.match - a.match);
  const displayedCandidates = sortedCandidates.slice(0, 
    filterType === "TOP_10" ? 10 : 
    filterType === "TOP_20" ? 20 : 
    sortedCandidates.length
  );

  return (
    <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <p className="text-emerald-400 text-sm font-bold tracking-widest uppercase">PIPELINE CORE</p>
            </div>
            <h1 className="text-4xl font-space font-bold text-white tracking-tight">{job?.title || "Unknown Job"}</h1>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <MapPin size={16}/> {job?.department || "General"} Department
            </p>
            <p className="text-gray-500 mt-4 text-sm max-w-2xl">{job?.description}</p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <input 
              type="file" 
              multiple 
              accept=".pdf,.docx,.txt"
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className={`bg-[#1e1e2d] text-white border border-[#2a2a3a] hover:bg-[#2a2a3a] px-6 py-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? <RefreshCw className="animate-spin text-[#00f0ff]" size={18} /> : <UploadCloud size={18} className="text-[#00f0ff]" />}
              {isProcessing ? "Ingesting Data..." : "Upload Candidates"}
            </button>
            <button
              onClick={handleGenerateMatches}
              disabled={isMatching || resumesPool.length === 0}
              className={`bg-[#00f0ff] text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all cursor-pointer ${isMatching || resumesPool.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isMatching ? <RefreshCw className="animate-spin" size={18}/> : <Sparkles size={18} />}
              {isMatching ? "Calculating Match Vectors..." : "Generate Neural Map"}
            </button>
          </div>
        </div>

        {/* Candidate Pool Section */}
        <div>
            <h2 className="text-2xl font-space font-bold text-white mb-6 flex items-center gap-2">
              <Users className="text-purple-400" /> Candidate Pool
            </h2>
            <div className="bg-[#14141e] border border-[#1e1e2d] rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left font-inter text-sm">
                    <thead className="bg-[#0a0a0f] text-gray-400 border-b border-[#1e1e2d]">
                        <tr>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Filename</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Email ID</th>
                            <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs w-24 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {resumesPool.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                                No base resumes mapped. Upload files to securely build the candidate pool.
                              </td>
                            </tr>
                        ) : (
                            resumesPool.map(res => (
                                <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-white font-mono break-all font-semibold">{res.file_name}</td>
                                    <td className="px-6 py-4 text-gray-400 break-all">{res.parsed_data?.email || "--"}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleDeleteResume(res.id)} className="text-red-400 hover:text-red-300 opacity-60 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg cursor-pointer">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Spatial Talent Map List */}
        <div>
          <div className="flex justify-between items-center mb-6 mt-10">
            <h2 className="text-2xl font-space font-bold text-white flex items-center gap-2">
              <Target className="text-[#00f0ff]" /> Spatial Talent Map
            </h2>
            
            {sortedCandidates.length > 0 && (
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#14141e] border border-[#1e1e2d] text-white px-4 py-2 rounded-lg outline-none focus:border-[#00f0ff] cursor-pointer"
              >
                <option value="ALL">All Resumes ({sortedCandidates.length})</option>
                <option value="TOP_10">Top 10 Matches</option>
                <option value="TOP_20">Top 20 Matches</option>
              </select>
            )}
          </div>
          <div className="space-y-4">
            {sortedCandidates.length === 0 ? (
              <div className="bg-[#14141e] border border-[#1e1e2d] rounded-2xl p-6 text-center text-gray-400">
                Awaiting map generation. Push 'Generate Neural Map' to crunch processing matrix.
              </div>
            ) : (
              displayedCandidates.map((cand, index) => (
                <motion.div key={cand.id} whileHover={{ x: 5 }} className="bg-[#14141e] border border-[#1e1e2d] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden group">
                  <div className="relative w-20 h-20 flex flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a0f] border-4" style={{ borderColor: cand.match > 90 ? '#00f0ff' : cand.match > 80 ? '#10b981' : '#f59e0b' }}>
                    <span className="text-xl font-space font-bold text-white">{cand.match}%</span>
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-space font-bold text-white font-mono flex items-center gap-3">
                          <span className="text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded-md text-lg">#{index + 1}</span> 
                          {cand.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                           Stage: <span className="bg-[#0a0a0f] border border-[#1e1e2d] px-2 py-0.5 rounded text-xs text-[#00f0ff] font-mono tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.2)]">{cand.decision_node ? cand.decision_node.replace(/_/g, " ") : "AWAITING REVIEW"}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => setSelectedCandidate(cand)}
                        className="text-sm font-semibold text-[#00f0ff] border border-[#00f0ff]/30 px-4 py-2 rounded-lg hover:bg-[#00f0ff]/10 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00f0ff]">
                         Open Neural Dossier
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Semantic Distance Match</span>
                        {cand.missing.length > 0 && <span className="text-amber-400">Missing: {cand.missing.slice(0, 3).join(", ")}{cand.missing.length > 3 ? "..." : ""}</span>}
                      </div>
                      <div className="w-full bg-[#0a0a0f] rounded-full h-1.5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${cand.match}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-purple-500 to-[#00f0ff]" />
                      </div>
                    </div>

                    {/* Vector Panel */}
                    <AnimatePresence>
                      {expandedVector === cand.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 pt-6 border-t border-[#1e1e2d] overflow-hidden"
                        >
                          <h4 className="text-[#00f0ff] text-xs font-bold uppercase tracking-widest mb-4">Target Proximity Matrix</h4>
                          <div className="flex flex-col md:flex-row gap-8">
                            <div>
                               <p className="text-gray-500 text-xs uppercase mb-2">Cosine Score</p>
                               <p className="text-white font-mono text-2xl">{cand.rawScore.toFixed(4)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-500 text-xs uppercase mb-2">Skill Activation Graph</p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(cand.rawSkills).map(([skill, found]) => (
                                    <span key={skill} className={`px-2 py-1 flex items-center gap-1 text-xs rounded font-mono ${found ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                      {found ? '+' : '-'}{skill}
                                    </span>
                                  ))}
                                  {Object.keys(cand.rawSkills).length === 0 && <span className="text-xs text-gray-500">No skill vectors mapped.</span>}
                                </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </motion.div>
      
      {selectedCandidate && (
        <CandidateDossier 
          candidate={selectedCandidate} 
          token={token} 
          onClose={() => setSelectedCandidate(null)} 
          onUpdateCandidate={handleUpdateCandidate}
        />
      )}
    </div>
  );
}
