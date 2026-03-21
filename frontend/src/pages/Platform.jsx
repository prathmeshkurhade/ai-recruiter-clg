import { Server, Cpu, Database, Network } from "lucide-react";

export default function Platform() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0f] text-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-space font-bold text-white mb-6">AIRecruiter Platform</h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-16">The core engine powering AIRecruiter. Built on advanced NLP models and scalable vector databases.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 hover:border-[#00f0ff]/50 transition-colors cursor-pointer">
            <Server className="text-[#00f0ff] w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Vector Database</h3>
            <p className="text-gray-400">Stores millions of generated resume embeddings for sub-millisecond semantic similarity matching operations.</p>
          </div>
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 hover:border-[#00f0ff]/50 transition-colors cursor-pointer">
            <Cpu className="text-purple-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">LLM Parser</h3>
            <p className="text-gray-400">Extracts complex contextual relationships from deeply nested PDF hierarchies without regular expressions.</p>
          </div>
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 hover:border-[#00f0ff]/50 transition-colors cursor-pointer">
            <Database className="text-emerald-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Elastic Storage</h3>
            <p className="text-gray-400">Autoscaling zero-knowledge proof data architecture, ensuring candidates PII is never durably written to raw disk unencrypted.</p>
          </div>
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 hover:border-[#00f0ff]/50 transition-colors cursor-pointer">
            <Network className="text-amber-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Agentic Swarms</h3>
            <p className="text-gray-400">Multiple specialized orchestrator agents handling different modalities, from image-based certs to raw text extraction simultaneously.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
