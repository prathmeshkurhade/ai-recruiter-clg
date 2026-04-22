import { motion, AnimatePresence } from "framer-motion";
import { X, BrainCircuit, Activity, FileText, Hexagon, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CandidateDossier({ candidate, onClose, token, onUpdateCandidate }) {
  const [decision, setDecision] = useState(candidate?.decision_node || 'AWAITING_REVIEW');
  const [intel, setIntel] = useState(candidate?.intel_notes || "");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if candidate prop changes
  useEffect(() => {
    setDecision(candidate?.decision_node || 'AWAITING_REVIEW');
    setIntel(candidate?.intel_notes || "");
  }, [candidate]);

  if (!candidate) return null;

  const handleDecisionChange = async (newNode) => {
    setDecision(newNode);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.patch(`http://localhost:8000/api/resumes/${candidate.id}/decision`, {
        decision_node: newNode
      }, { headers });
      onUpdateCandidate(candidate.id, 'decision_node', newNode);
      
      if (newNode === 'ENGAGE_FAST_TRACK') {
          onUpdateCandidate(candidate.id, 'name', res.data.parsed_data?.name || candidate.name);
          onUpdateCandidate(candidate.id, 'raw_text', res.data.raw_text);
          if (res.data.parsed_data?.email) {
            onUpdateCandidate(candidate.id, 'parsed_data', { ...candidate.parsed_data, email: res.data.parsed_data.email });
          }
      }
    } catch (err) {
      console.error("Decision Update Error", err);
    }
  };

  const handleIntelSave = async () => {
    setIsSaving(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.patch(`http://localhost:8000/api/resumes/${candidate.id}/intel`, {
        intel_notes: intel
      }, { headers });
      onUpdateCandidate(candidate.id, 'intel_notes', intel);
    } catch (err) {
      console.error("Intel Save Error", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getNodeColor = (node) => {
    switch(node) {
      case 'ENGAGE_FAST_TRACK': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
      case 'TECHNICAL_ASSESS': return 'bg-amber-500/20 text-amber-500 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'ARCHIVE_VECTOR': return 'bg-red-500/10 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
      case 'AWAITING_REVIEW': return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
      default: return 'bg-[#1e1e2d] text-gray-400 border-gray-600';
    }
  };

  const getNodeText = (node) => {
    switch(node) {
      case 'ENGAGE_FAST_TRACK': return 'FAST TRACK (PASS)';
      case 'TECHNICAL_ASSESS': return 'TECH ASSESSMENT';
      case 'ARCHIVE_VECTOR': return 'ARCHIVE (FAIL)';
      case 'AWAITING_REVIEW': return 'NEEDS REVIEW';
      default: return node.replace(/_/g, " ");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ x: '100%' }} 
          animate={{ x: 0 }} 
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full md:w-[700px] h-full bg-[#0a0a0f] border-l border-[#1e1e2d] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
        >
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Core Header Bar */}
          <div className="p-6 border-b border-[#1e1e2d] flex justify-between items-start relative z-10 bg-[#0a0a0f]/80 backdrop-blur">
            <div className="flex justify-between w-full items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hexagon size={16} className={`text-${candidate.name.includes('VECTOR') ? 'amber-500' : '[#00f0ff]'}`} />
                  <span className={`text-${candidate.name.includes('VECTOR') ? 'amber-500' : '[#00f0ff]'} uppercase tracking-widest text-xs font-bold`}>
                    {candidate.name.includes('VECTOR') ? 'Identity Masked (Zero-Bias Active)' : 'Neural Dossier Authorized'}
                  </span>
                </div>
                <h2 className="text-3xl font-space font-bold text-white flex items-center gap-3">
                    {candidate.name}
                    {candidate.name.includes('VECTOR') && <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] tracking-widest uppercase">Blind Mode</span>}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-400 font-mono text-sm">{candidate.parsed_data?.email || "UNKNOWN_ADDRESS"}</p>
                  <span className="bg-[#14141e] border border-[#1e1e2d] px-2 py-0.5 rounded text-xs text-gray-400 font-mono tracking-wider">
                    ID: {candidate.id}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-[#14141e] hover:bg-white/10 rounded-xl transition-colors cursor-pointer border border-[#1e1e2d]">
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
            
            {/* Action Nodes */}
            <div className="bg-[#14141e] rounded-2xl p-6 border border-[#1e1e2d]">
              <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-2">
                <Activity size={14}/> Routing Node Matrix (Decision)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['AWAITING_REVIEW', 'ENGAGE_FAST_TRACK', 'TECHNICAL_ASSESS', 'ARCHIVE_VECTOR'].map(node => (
                  <button 
                    key={node}
                    onClick={() => handleDecisionChange(node)}
                    className={`px-4 py-3 rounded-lg font-mono text-xs text-center uppercase tracking-wider font-bold border transition-all cursor-pointer ${decision === node ? getNodeColor(node) : 'bg-[#0a0a0f] border-[#1e1e2d] text-gray-500 hover:border-gray-500'}`}
                  >
                    {getNodeText(node)}
                  </button>
                ))}
              </div>
            </div>

            {/* Neural Match Block */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] p-6 flex flex-col items-center justify-center min-w-[150px]">
                <div className="relative w-24 h-24 flex flex-shrink-0 items-center justify-center rounded-full bg-[#0a0a0f] border-4 mb-2" style={{ borderColor: candidate.match > 90 ? '#00f0ff' : candidate.match > 70 ? '#10b981' : '#f59e0b' }}>
                    <span className="text-2xl font-space font-bold text-white">{candidate.match}%</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-center mt-2">Semantic Rank</span>
              </div>
              
              <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] p-6 flex-1">
                 <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-2">
                   <BrainCircuit size={14}/> Vector Activation (Missing Skills)
                 </h3>
                 <div className="flex flex-wrap gap-2">
                    {Object.entries(candidate.rawSkills || {}).map(([skill, found]) => (
                      <span key={skill} className={`px-2 py-1 flex items-center gap-1 text-xs rounded font-mono ${found ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                        {found ? '+' : '-'}{skill}
                      </span>
                    ))}
                    {Object.keys(candidate.rawSkills || {}).length === 0 && <span className="text-xs text-gray-500 font-mono">No skill vectors explicitly defined in job core.</span>}
                 </div>
              </div>
            </div>

            {/* Recruiter Intel */}
            <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] p-6 relative group">
                <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-2">
                   <Terminal size={14}/> Synaptic Log (Recruiter Notes)
                </h3>
                <textarea 
                  value={intel}
                  onChange={(e) => setIntel(e.target.value)}
                  onBlur={handleIntelSave}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2d] text-emerald-400 font-mono text-sm p-4 rounded-xl focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] min-h-[120px] resize-y placeholder-emerald-900/50 transition-all custom-scrollbar"
                  placeholder="> Initialize secure logging sequence (Auto-saves on exit)..."
                />
                <AnimatePresence>
                  {isSaving && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-6 right-6 text-[10px] text-[#00f0ff] uppercase font-mono tracking-widest animate-pulse border border-[#00f0ff]/30 px-2 rounded">
                      Saving Sequence...
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            {/* Raw Extracted Data */}
            <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] overflow-hidden">
                <div className="p-4 border-b border-[#1e1e2d] bg-[#0a0a0f]">
                  <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest flex items-center gap-2">
                    <FileText size={14}/> Raw Extracted Substrate (Resume Text)
                  </h3>
                </div>
                <div className="p-6 bg-[#0a0a0f]/50 h-[300px] overflow-y-auto custom-scrollbar">
                  <div className="prose prose-invert prose-p:text-sm prose-p:font-inter prose-p:text-gray-400 max-w-none prose-h2:text-white prose-h2:font-space">
                     <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-500">{candidate.raw_text || "NO_DATA_MATRIX_FOUND"}</p>
                  </div>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
