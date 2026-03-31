import { Server, Cpu, Database, Network, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Platform() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0f] text-gray-200 font-inter overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center mb-24"
        >
           <h1 className="text-5xl md:text-7xl font-space font-bold text-white mb-6 tracking-tight">
             How The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-purple-400">Core Engine</span> Works.
           </h1>
           <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
             HireForge is not a keyword scanner. It is a highly robust Natural Language Processing (NLP) ecosystem built upon multi-modal extraction frameworks, Python-based SentenceTransformers, and PostGIS/NeonDB indexing arrays.
           </p>
        </motion.div>

        {/* Deep Tech Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 hover:border-purple-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full group-hover:bg-purple-500/10 transition-colors pointer-events-none" />
            <Cpu className="text-purple-400 w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Semantic Vector Transformation</h3>
            <p className="text-gray-400 text-lg mb-6 line-clamp-4">
               Every resume passing through our mesh is translated into a highly dense 384-dimensional mathematical array using HuggingFace `all-MiniLM-L6-v2`. We map candidate context onto a spatial grid, calculating `cosine_similarity` to discover candidates whose experience conceptually matches the job, even if they used dramatically different terminology.
            </p>
            <ul className="space-y-3 text-sm font-mono text-purple-400/80">
              <li className="flex items-center gap-2"><Zap size={14}/> Non-Linear Score Normalization</li>
              <li className="flex items-center gap-2"><Zap size={14}/> 60% Semantic / 40% Keyword Syntactic Weighting</li>
              <li className="flex items-center gap-2"><Zap size={14}/> Context-Aware Implicit Skill Discovery</li>
            </ul>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 hover:border-[#00f0ff]/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00f0ff]/5 blur-[80px] rounded-full group-hover:bg-[#00f0ff]/10 transition-colors pointer-events-none" />
            <ShieldCheck className="text-[#00f0ff] w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Zero-Bias Identity Injection</h3>
            <p className="text-gray-400 text-lg mb-6">
               Implicit bias ruins sourcing. When active, our endpoint routing physically intercepts HTTP serialization payloads, performing targeted deep-regex scrub passes over unstructured text. Real names, email threads, numbers, and pronouns are systematically shattered and replaced with `[REDACTED_SECURE_COMMS]` prior to Redux state ingestion.
            </p>
            <ul className="space-y-3 text-sm font-mono text-[#00f0ff]/80">
              <li className="flex items-center gap-2"><Zap size={14}/> API-Level NLP Masking Layer</li>
              <li className="flex items-center gap-2"><Zap size={14}/> Dynamic Neural Dossier Unmasking</li>
              <li className="flex items-center gap-2"><Zap size={14}/> 100% Blind Substrate Evaluation</li>
            </ul>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 hover:border-emerald-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
            <Database className="text-emerald-400 w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Scalable Postgres Orchestration</h3>
            <p className="text-gray-400 text-lg mb-6">
               Backed by NeonDB, we utilize highly-concurrent Alembic migrations to construct immutable tracking states. Candidate Nodes (Fast Track, Technical Assess) instantly commit via FastAPI PATCH endpoints, guaranteeing recruiters never lose analytical throughput due to stale frontend caches.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }} 
            className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 hover:border-amber-500/30 transition-all relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
            <Network className="text-amber-400 w-12 h-12 mb-6" />
            <h3 className="text-3xl font-space font-bold text-white mb-4">Multi-Modal Extraction Mesh</h3>
            <p className="text-gray-400 text-lg mb-6">
               Fling nested PDFs, deeply disjointed DOCX hierarchies, and plaintext across our endpoints. The extraction orchestrator dynamically adapts, utilizing `pdfplumber` context mapping to rip out JSON structures while completely disregarding manual human formatting rules.
            </p>
          </motion.div>

        </div>

        {/* Closing Architecture Note */}
        <div className="mt-20 text-center border-t border-[#1e1e2d] pt-16">
           <h4 className="text-2xl font-space font-bold text-white mb-4">Deployed on ASGI Infrastructure</h4>
           <div className="flex flex-wrap justify-center gap-4">
              {['FastAPI', 'React', 'Framer Motion', 'Pydantic V2', 'SQLAlchemy 2.0', 'Uvicorn', 'Tailwind', 'Vector Maths'].map((tech) => (
                 <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-gray-400">
                    {tech}
                 </span>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
