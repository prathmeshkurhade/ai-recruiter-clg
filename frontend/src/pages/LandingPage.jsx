import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, ShieldAlert, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0a0a0f] text-gray-200 overflow-hidden font-inter">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00f0ff]/5 blur-[120px] rounded-full pointer-events-none" />
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e1e2d] border border-[#2a2a3a] text-sm text-[#00f0ff] mb-6 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
            Introducing the Ethical Kinetic OS
          </div>
          <h1 className="text-5xl md:text-7xl font-space font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Hire Talent with <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-purple-400">Semantic Intelligence.</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
            Stop filtering by keywords. AIRecruiter uses explainable AI vectors to instantly parse, match, and rank thousands of resumes against your job descriptions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/login" className="group bg-[#00f0ff] text-black px-8 py-3 rounded-xl font-bold text-lg hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              Start Screening 
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/platform" className="bg-[#1e1e2d] text-white border border-[#2a2a3a] px-8 py-3 rounded-xl font-bold text-lg hover:bg-[#2a2a3a] transition-colors">
              Explore Platform
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="col-span-1 md:col-span-2 bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
            <BrainCircuit className="text-purple-400 w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Generative Matching Engine</h3>
            <p className="text-gray-400 text-lg max-w-md">Our semantic embeddings analyze context, intent, and tangential skills, surfacing candidates that legacy ATS systems miss.</p>
          </motion.div>

          <motion.div 
             whileHover={{ y: -5 }}
             className="col-span-1 bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 relative group"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/10 blur-[60px] rounded-full group-hover:bg-[#00f0ff]/20 transition-colors" />
             <ShieldAlert className="text-[#00f0ff] w-12 h-12 mb-6" />
             <h3 className="text-2xl font-space font-bold text-white mb-4">Ethical AI Bounds</h3>
             <p className="text-gray-400">Configurable privacy rules and bias suppression limits put the recruiter in full control.</p>
          </motion.div>

          <motion.div 
             whileHover={{ y: -5 }}
             className="col-span-1 md:col-span-3 bg-gradient-to-r from-[#14141e] to-[#0a0a0f] border border-[#1e1e2d] rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10"
          >
             <div className="flex-1">
                <Cpu className="text-emerald-400 w-12 h-12 mb-6" />
                <h3 className="text-3xl font-space font-bold text-white mb-4">Automated Extraction Pipeline</h3>
                <p className="text-gray-400 text-lg">Instantly parse PDF/DOCX resumes into pristine structured data with ZERO manual data entry. Upload 1000 resumes, get ranked results in milliseconds.</p>
             </div>
             <div className="flex-1 bg-black/50 border border-[#1e1e2d] rounded-2xl p-6 font-mono text-xs text-gray-500 w-full">
                <div className="flex gap-2 mb-4 border-b border-[#1e1e2d] pb-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                   <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <div className="space-y-2 text-emerald-400/70">
                   <p>&gt; Ingesting candidate_batch_01.pdf...</p>
                   <p>&gt; Extracted 12 core skills...</p>
                   <p>&gt; Computing Cosine Similarity vs Job_XYZ...</p>
                   <p className="text-[#00f0ff] font-bold">&gt; Match Score Calculated: 94.2% Relevance</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}