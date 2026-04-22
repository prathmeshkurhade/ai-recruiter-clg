import { ShieldAlert, Users, Layers, Activity, FastForward, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Solutions() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0f] text-gray-200 font-inter">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-24"
        >
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-400 mb-6 w-auto uppercase tracking-widest">Enterprise Class Deployments</div>
          <h1 className="text-5xl md:text-7xl font-space font-bold text-white mb-6 tracking-tight">
            Stop Tracking. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#00f0ff]">Start Routing.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Standard HRIS platforms force you into rigid Kanban lists. HireForge introduces the Decision Node Matrix, designed specifically for rapid, high-velocity hiring environments where speed and ethical compliance matter above all.
          </p>
        </motion.div>
        
        {/* Core Solutions Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 group">
            <FastForward className="text-[#00f0ff] w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Fast-Track Engine</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
               When the AI Neural Vector triggers a >90% similarity map, skip the manual review. Pluck them from the stack and instantly dump them into the Fast-Track Node in the PostgreSQL backend via a single click inside the Neural Dossier.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 group">
            <ShieldAlert className="text-amber-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Bulletproof DEI Compliance</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
               Protect your sourcing layer against unconscious bias lawsuits. By hard-locking Identity Masking on your API endpoint queries, recruiters physically cannot see age, gender, race, or geographic origin until they decide to advance the candidate based purely on merit.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 group">
            <Activity className="text-purple-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Real-Time Synaptic Logging</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
               Don't drop your workflow out to Excel. Type your technical assessment notes directly into the `CandidateDossier.jsx` Synaptic Log. The OS automatically intercepts `onBlur` events, tunneling a seamless REST `PATCH` update directly to the Postgres instances.
            </p>
          </motion.div>
        </div>

        {/* Feature Checkmarks */}
        <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-[#00f0ff]/5 to-purple-500/5 blur-[100px] pointer-events-none" />
          <h2 className="text-3xl font-space font-bold text-white mb-10 text-center relative z-10">Production-Ready Architecture Promises</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 relative z-10">
             {[
               "Alembic Database State Migrations",
               "Framer Motion Physics Ecosystem",
               "Pydantic V2 Request Validation",
               "Python AST Security & Safe Logging",
               "Zero-Knowledge JWT Token Architectures",
               "Sub-Millisecond Cosine Similarity Maths",
               "Glassmorphic UX Layer Interfaces",
               "Live Vector Matching UI Generation"
             ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#00f0ff]/50 group-hover:bg-[#00f0ff]/10 transition-colors">
                      <CheckSquare size={14} className="text-[#00f0ff]" />
                   </div>
                   <span className="text-gray-300 font-mono text-sm tracking-wide">{feature}</span>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
}