import { motion, AnimatePresence } from "framer-motion";
import { X, BrainCircuit, Activity, FileText, Hexagon, Terminal, Mail, MessageSquare, Send, Check } from "lucide-react";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

export default function CandidateDossier({ candidate, onClose, token, onUpdateCandidate }) {
  const [decision, setDecision] = useState(candidate?.decision_node || 'AWAITING_REVIEW');
  const [intel, setIntel] = useState(candidate?.intel_notes || "");
  const [isSaving, setIsSaving] = useState(false);

  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [draftedEmail, setDraftedEmail] = useState(null);
  const [isDraftingEmail, setIsDraftingEmail] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("vector"); // 'vector', 'chat'

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

  const handleChatSubmit = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatting(true);
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`http://localhost:8000/api/resumes/${candidate.id}/chat`, {
        prompt: userMsg
      }, { headers });
      setChatHistory(prev => [...prev, { role: "ai", content: res.data.response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "ai", content: "Error generating response. Check API connectivity." }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleDraftEmail = async () => {
    setIsDraftingEmail(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.post(`http://localhost:8000/api/resumes/${candidate.id}/draft_email`, {}, { headers });
      setDraftedEmail(res.data);
      setEmailCopied(false);
    } catch (err) {
      console.error("Draft email error", err);
    } finally {
      setIsDraftingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    if (draftedEmail) {
      navigator.clipboard.writeText(`Subject: ${draftedEmail.subject}\n\n${draftedEmail.body}`);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const radarData = candidate.rawSkills ? Object.entries(candidate.rawSkills).map(([skill, found]) => ({
    subject: skill,
    A: found ? 100 : 10,
    fullMark: 100,
  })) : [];

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
                    {candidate.name.includes('VECTOR') ? 'Identity Hidden (Unbiased Screening)' : 'Profile Access Granted'}
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
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest flex items-center gap-2">
                  <Activity size={14}/> Decision Board
                </h3>
                <button
                  onClick={handleDraftEmail}
                  disabled={isDraftingEmail}
                  className="bg-[#1e1e2d] hover:bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-2"
                >
                  {isDraftingEmail ? "Drafting..." : <><Mail size={14} /> Draft AI Email</>}
                </button>
              </div>
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
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest text-center mt-2">Match Score</span>
              </div>
              
              <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] p-6 flex-1 flex flex-col">
                 <div className="flex gap-4 border-b border-[#1e1e2d] pb-2 mb-4">
                   <button onClick={() => setActiveTab("vector")} className={`text-xs uppercase font-bold tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'vector' ? 'text-[#00f0ff]' : 'text-gray-500 hover:text-gray-300'}`}>
                     <BrainCircuit size={14}/> Skill Match
                   </button>
                   <button onClick={() => setActiveTab("chat")} className={`text-xs uppercase font-bold tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'chat' ? 'text-[#00f0ff]' : 'text-gray-500 hover:text-gray-300'}`}>
                     <MessageSquare size={14}/> Chat with Resume
                   </button>
                 </div>
                 
                 {activeTab === 'vector' ? (
                   <div className="flex-1 flex flex-col md:flex-row gap-6">
                     <div className="flex-1 min-h-[200px]">
                       {radarData.length > 0 ? (
                         <ResponsiveContainer width="100%" height="100%">
                           <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                             <PolarGrid stroke="#1e1e2d" />
                             <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} />
                             <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                             <Radar name="Candidate" dataKey="A" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.2} />
                           </RadarChart>
                         </ResponsiveContainer>
                       ) : (
                         <div className="flex h-full items-center justify-center text-xs text-gray-500 font-mono">No skills map available.</div>
                       )}
                     </div>
                     <div className="flex-1 flex flex-wrap gap-2 content-start">
                        {Object.entries(candidate.rawSkills || {}).map(([skill, found]) => (
                          <span key={skill} className={`px-2 py-1 flex items-center gap-1 text-xs rounded font-mono ${found ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                            {found ? '+' : '-'}{skill}
                          </span>
                        ))}
                     </div>
                   </div>
                 ) : (
                   <div className="flex-1 flex flex-col min-h-[200px]">
                     <div className="flex-1 overflow-y-auto mb-4 space-y-3 custom-scrollbar pr-2 max-h-[200px]">
                       {chatHistory.length === 0 && (
                         <p className="text-xs text-gray-500 font-mono text-center mt-4">Ask a question about this candidate's resume...</p>
                       )}
                       {chatHistory.map((msg, i) => (
                         <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] rounded-lg p-3 text-sm font-mono ${msg.role === 'user' ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20' : 'bg-[#1e1e2d] text-gray-300'}`}>
                             {msg.content}
                           </div>
                         </div>
                       ))}
                       {isChatting && (
                         <div className="flex justify-start">
                           <div className="bg-[#1e1e2d] text-gray-400 rounded-lg p-3 text-xs animate-pulse font-mono">Analyzing resume...</div>
                         </div>
                       )}
                     </div>
                     <form onSubmit={handleChatSubmit} className="flex gap-2">
                       <input 
                         type="text" 
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         placeholder="e.g. Did they use Docker?" 
                         className="flex-1 bg-[#0a0a0f] border border-[#1e1e2d] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#00f0ff]"
                       />
                       <button type="submit" disabled={isChatting || !chatInput.trim()} className="bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg px-3 py-2 hover:bg-[#00f0ff]/20 disabled:opacity-50">
                         <Send size={16} />
                       </button>
                     </form>
                   </div>
                 )}
              </div>
            </div>

            {/* Recruiter Intel */}
            <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] p-6 relative group">
                <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-4 flex items-center gap-2">
                   <Terminal size={14}/> Recruiter Notes
                </h3>
                <textarea 
                  value={intel}
                  onChange={(e) => setIntel(e.target.value)}
                  onBlur={handleIntelSave}
                  className="w-full bg-[#0a0a0f] border border-[#1e1e2d] text-emerald-400 font-mono text-sm p-4 rounded-xl focus:border-[#00f0ff] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] min-h-[120px] resize-y placeholder-emerald-900/50 transition-all custom-scrollbar"
                  placeholder="Add notes about the candidate..."
                />
                <AnimatePresence>
                  {isSaving && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-6 right-6 text-[10px] text-[#00f0ff] uppercase font-mono tracking-widest animate-pulse border border-[#00f0ff]/30 px-2 rounded">
                      Saving...
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>

            {/* Raw Extracted Data */}
            <div className="bg-[#14141e] rounded-2xl border border-[#1e1e2d] overflow-hidden">
                <div className="p-4 border-b border-[#1e1e2d] bg-[#0a0a0f]">
                  <h3 className="text-xs uppercase text-gray-500 font-bold tracking-widest flex items-center gap-2">
                    <FileText size={14}/> Resume Text
                  </h3>
                </div>
                <div className="p-6 bg-[#0a0a0f]/50 h-[300px] overflow-y-auto custom-scrollbar">
                  <div className="prose prose-invert prose-p:text-sm prose-p:font-inter prose-p:text-gray-400 max-w-none prose-h2:text-white prose-h2:font-space">
                     <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-500">{candidate.raw_text || "NO_DATA_MATRIX_FOUND"}</p>
                  </div>
                </div>
            </div>

          </div>

            {/* Email Draft Modal Overlay inside the dossier */}
            <AnimatePresence>
              {draftedEmail && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md p-8 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-space font-bold text-white flex items-center gap-2"><Mail className="text-[#00f0ff]" /> AI Drafted Response</h3>
                    <button onClick={() => setDraftedEmail(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="bg-[#14141e] border border-[#1e1e2d] rounded-xl p-6 mb-4 flex-1">
                    <p className="text-sm text-gray-400 font-mono mb-4 border-b border-[#1e1e2d] pb-4">Subject: <span className="text-white">{draftedEmail.subject}</span></p>
                    <p className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{draftedEmail.body}</p>
                  </div>
                  <button onClick={handleCopyEmail} className="mt-4 bg-[#00f0ff] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    {emailCopied ? <Check size={18} /> : <FileText size={18} />}
                    {emailCopied ? "Copied to Clipboard!" : "Copy to Clipboard"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
