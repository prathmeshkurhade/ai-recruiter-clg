import { ShieldAlert, Users, Layers } from "lucide-react";

export default function Solutions() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0f] text-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-space font-bold text-white mb-6">Enterprise Solutions</h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-16">Tailored agentic recruitment ecosystems designed for scale, compliance, and velocity.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8">
            <Users className="text-[#00f0ff] w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">High-Volume Hiring</h3>
            <p className="text-gray-400">Process over 100k resumes daily per instance without any throughput choking, backed by distributed Gen-UI monitoring.</p>
          </div>
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8">
            <ShieldAlert className="text-purple-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">DEI & Compliance</h3>
            <p className="text-gray-400">Built-in Semantic Neutrality filters map straight to your local compliance boundaries, guaranteeing explainable limits on AI matches.</p>
          </div>
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8">
            <Layers className="text-emerald-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-space font-bold text-white mb-4">Custom Internal Systems</h3>
            <p className="text-gray-400">Connect the HireForge AI Matrix directly into existing HRIS flows (Workday, Greenhouse) utilizing our GraphQL endpoint mesh.</p>
          </div>
        </div>
      </div>
    </div>
  );
}