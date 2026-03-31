import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BrainCircuit, ShieldAlert, Cpu, Fingerprint, Activity, Network, Layers, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const faqs = [
  {
    question: "Does the AI simply scan for keywords like standard ATS software?",
    answer: "No. Standard ATS systems use boolean keyword matching, which misses great candidates who use different terminology. HireForge AI converts resumes and job descriptions into semantic vectors, understanding the *context* and *intent* behind the text, accurately matching tangential skills."
  },
  {
    question: "How does the Zero-Bias Engine prevent discrimination?",
    answer: "Our engine physically intercepts the extracted candidate data before it reaches the recruiter's browser. If Zero-Bias is enabled, it uses NLP algorithms to actively redact names, geographic locations, and gendered pronouns, replacing them with generic tags so recruiters are forced to evaluate purely on merit."
  },
  {
    question: "Is candidate PII (Personal Data) safe?",
    answer: "Yes. Resume embeddings and extracted texts are securely stored in PostgreSQL (NeonDB). When Identity Masking is toggled, identifiers are mechanically hidden. Real names are only revealed upon explicitly moving a candidate to the 'Fast Track' node."
  },
  {
    question: "Can I connect this to my existing HRIS?",
    answer: "HireForge AI is designed with an API-first GraphQL mesh layer, allowing it to seamlessly pipe Fast-Tracked candidates directly into Workday, Greenhouse, or Lever."
  }
];

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
            Stop filtering by keywords. HireForge AI uses explainable AI vectors to instantly parse, match, and rank thousands of resumes against your job descriptions.
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

      {/* Product Highlight / Mockup Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-space font-bold text-white mb-4">The Holographic Candidate Dossier</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Ditch the slow PDF viewers and standard Kanban boards. Our dynamic, sliding Neural Dossier extracts candidates into clean data layers, analyzes missing vector skills, and provides instant Decision Routing with auto-saving Synaptic Logs.
            </p>
         </div>

         <div className="relative w-full max-w-5xl mx-auto bg-[#14141e] border border-[#1e1e2d] rounded-2xl shadow-2xl overflow-hidden">
             {/* Fake browser top */}
             <div className="bg-[#0a0a0f] px-4 py-3 flex border-b border-[#1e1e2d] items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                 <div className="ml-4 flex-1 h-6 bg-[#14141e] rounded-md border border-[#1e1e2d]"></div>
             </div>
             {/* Fake layout */}
             <div className="flex h-[400px]">
                 <div className="w-1/3 border-r border-[#1e1e2d] p-6 space-y-4 hidden md:block">
                     <div className="h-10 bg-white/5 rounded-lg w-full mb-8"></div>
                     <div className="h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-lg w-full flex items-center px-4">
                        <span className="text-emerald-400 font-bold">98% Match</span>
                     </div>
                     <div className="h-16 bg-[#0a0a0f] border border-[#1e1e2d] rounded-lg w-full"></div>
                     <div className="h-16 bg-[#0a0a0f] border border-[#1e1e2d] rounded-lg w-full"></div>
                 </div>
                 <div className="flex-1 bg-black/40 p-8 relative overflow-hidden">
                     {/* Floating Dossier Simulation */}
                     <motion.div 
                        initial={{ x: 200, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        viewport={{ once: true }}
                        className="absolute right-0 top-0 bottom-0 w-3/4 bg-[#0a0a0f] border-l border-[#1e1e2d] shadow-[-20px_0_50px_rgba(0,240,255,0.05)] p-6 flex flex-col gap-6"
                     >
                        <div className="flex items-center gap-2">
                           <ShieldAlert size={16} className="text-amber-500" />
                           <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Zero-Bias Active</span>
                        </div>
                        <h3 className="text-2xl font-space font-bold text-white">CANDIDATE_VECTOR_8241</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                           <div className="bg-[#14141e] p-4 rounded-xl border border-[#1e1e2d]">
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Missing Skills</p>
                              <div className="flex gap-2"><span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20">- GraphQL</span></div>
                           </div>
                           <div className="bg-[#14141e] p-4 rounded-xl border border-[#1e1e2d]">
                              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Engage Pipeline</p>
                              <button className="w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-xs py-2 rounded uppercase font-bold text-center">Fast Track</button>
                           </div>
                        </div>
                     </motion.div>
                 </div>
             </div>
         </div>
      </section>

      {/* Feature Step-by-Step */}
      <section className="py-24 bg-[#0a0a0f] border-t border-b border-[#1e1e2d] relative">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-space font-bold text-center text-white mb-16">The 4-Step Neural Pipeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] p-8 border border-[#1e1e2d] rounded-2xl relative">
                  <div className="text-[#00f0ff] font-mono text-5xl font-bold opacity-20 absolute top-4 right-4">01</div>
                  <Layers className="text-[#00f0ff] w-10 h-10 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Chaos Ingestion</h3>
                  <p className="text-gray-400 text-sm">Upload hundreds of unstructured PDF or DOCX files. Our model ignores formatting and extracts pure, unadulterated schema data natively.</p>
               </motion.div>
               <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] p-8 border border-[#1e1e2d] rounded-2xl relative">
                  <div className="text-amber-500 font-mono text-5xl font-bold opacity-20 absolute top-4 right-4">02</div>
                  <Fingerprint className="text-amber-500 w-10 h-10 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Zero-Bias Deep Scrub</h3>
                  <p className="text-gray-400 text-sm">Activate Identity Masking to force the AI to execute an NLP pass over the candidates raw text, permanently redacting names, phone numbers, and pronouns.</p>
               </motion.div>
               <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] p-8 border border-[#1e1e2d] rounded-2xl relative">
                  <div className="text-purple-400 font-mono text-5xl font-bold opacity-20 absolute top-4 right-4">03</div>
                  <Activity className="text-purple-400 w-10 h-10 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Spatial Matching</h3>
                  <p className="text-gray-400 text-sm">We convert candidate skills and experience into 384-dimensional arrays, locating the exact semantic distance between them and your requested Job Description.</p>
               </motion.div>
               <motion.div whileHover={{ y: -5 }} className="bg-[#14141e] p-8 border border-[#1e1e2d] rounded-2xl relative">
                  <div className="text-emerald-400 font-mono text-5xl font-bold opacity-20 absolute top-4 right-4">04</div>
                  <Network className="text-emerald-400 w-10 h-10 mb-6" />
                  <h3 className="text-xl font-bold text-white mb-3">Decision Routing</h3>
                  <p className="text-gray-400 text-sm">Stop dragging candidates through boring lists. One-click routing to "Technical Assess", "Fast Track", or "Archive" updates Postgres instantly.</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Bento Grid Legacy Features */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-space font-bold text-white mb-4">Enterprise Architecture</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Designed for scale and speed, prioritizing security parameters.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="col-span-1 md:col-span-2 bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
            <BrainCircuit className="text-purple-400 w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Generative Matching Engine</h3>
            <p className="text-gray-400 text-lg max-w-md">Our semantic embeddings analyze context, intent, and tangential skills, surfacing high-potential candidates that legacy ATS keyword-scanners completely miss.</p>
          </motion.div>

          <motion.div 
             className="col-span-1 bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 relative group border-hover transition-colors"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f0ff]/10 blur-[60px] rounded-full group-hover:bg-[#00f0ff]/20 transition-colors" />
             <ShieldAlert className="text-[#00f0ff] w-12 h-12 mb-6" />
             <h3 className="text-2xl font-space font-bold text-white mb-4">Ethical AI Bounds</h3>
             <p className="text-gray-400">Configurable privacy rules and bias suppression limits put the recruiter in ultimate control of inference logic.</p>
          </motion.div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-24 bg-[#0a0a0f] border-t border-[#1e1e2d] relative z-10">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-space font-bold text-center text-white mb-16">Frequently Asked Questions</h2>
            <div className="space-y-4">
               {faqs.map((faq, index) => {
                 const [isOpen, setIsOpen] = useState(false);
                 return (
                   <motion.div 
                     key={index} 
                     className="bg-[#14141e] border border-[#1e1e2d] rounded-2xl overflow-hidden"
                   >
                     <button
                       onClick={() => setIsOpen(!isOpen)}
                       className="w-full px-6 py-5 flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors text-left"
                     >
                        <span className="font-space font-bold text-lg text-white pr-8">{faq.question}</span>
                        <ChevronDown className={`text-[#00f0ff] transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                     </button>
                     <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-[#0a0a0f]/50 border-t border-[#1e1e2d]"
                          >
                             <p className="p-6 text-gray-400 font-inter leading-relaxed">{faq.answer}</p>
                          </motion.div>
                        )}
                     </AnimatePresence>
                   </motion.div>
                 );
               })}
            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 text-center">
         <h2 className="text-4xl md:text-5xl font-space font-bold text-white mb-8">Ready to evolve your hiring stack?</h2>
         <Link to="/register" className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Create Free Account <ChevronRight />
         </Link>
      </section>
    </div>
  );
}