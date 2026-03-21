import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Building2, Shield, Activity } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter flex flex-col items-center justify-center text-gray-400">
        <Activity className="animate-spin w-8 h-8 text-[#00f0ff] mb-4" />
        <p className="font-space tracking-widest text-sm text-[#00f0ff]">DECRYPTING IDENTITY PAYLOAD...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        <header>
          <h1 className="text-4xl font-space font-bold text-white tracking-tight flex items-center gap-3">
            Recruiter Profile
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Manage your identity mappings and organization authority.</p>
        </header>

        <div className="bg-[#14141e] border border-[#1e1e2d] rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
          {/* Cyberpunk Glow Matrix */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00f0ff] rounded-full blur-[130px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600 rounded-full blur-[130px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-700"></div>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10 text-center md:text-left">
            {/* Holographic Avatar Widget */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#00f0ff] rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="w-36 h-36 shrink-0 rounded-full bg-gradient-to-br from-[#14141e] to-[#0a0a0f] flex items-center justify-center text-white font-bold text-5xl border border-[#1e1e2d] shadow-2xl relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#00f0ff] to-purple-600 flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
            </div>

            {/* Core Identification Matrix */}
            <div className="flex-1 space-y-8 w-full">
              <div className="space-y-2">
                <h2 className="text-4xl font-space font-extrabold text-white">{user.full_name}</h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold tracking-widest uppercase border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <Shield size={14} />
                  Authenticated Operator
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-600 transition-colors">
                  <div className="p-3.5 bg-cyan-900/30 text-[#00f0ff] rounded-xl">
                    <Mail size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-gray-500 text-[10px] font-space font-bold uppercase tracking-widest mb-1">Encrypted Email</p>
                    <p className="text-white text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>

                <div className="bg-black/40 border border-gray-800 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-600 transition-colors">
                  <div className="p-3.5 bg-purple-900/30 text-purple-400 rounded-xl">
                    <Building2 size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-gray-500 text-[10px] font-space font-bold uppercase tracking-widest mb-1">Authorized Organization</p>
                    <p className="text-white text-sm font-medium truncate">{user.company || 'Independent Contractor'}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
