import { Link } from "react-router-dom";
import { Users, FileText, CheckCircle, TrendingUp, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useJobs } from "../context/JobsContext";

export default function Dashboard() {
  const { jobs, statsData, loading, deleteJob } = useJobs();

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJob(jobId);
      } catch (err) {
        console.error("Failed to delete job", err);
        alert("Failed to delete job.");
      }
    }
  };

  const stats = [
    { label: "Active Jobs", value: statsData.activeJobs, icon: FileText, color: "text-[#00f0ff]", bg: "bg-[#00f0ff]/10" },
    { label: "Candidates Processed", value: statsData.candidatesProcessed, icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Matches Found", value: statsData.matchesFound, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Pipeline Efficiency", value: statsData.efficiency, icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10" },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      <header className="mb-10 flex justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-space font-bold text-white tracking-tight">Main Dashboard</h1>
          <p className="text-gray-400 mt-2 text-lg">Your Agentic Recruitment overview.</p>
        </div>
        <Link to="/jobs/new" className="bg-[#00f0ff] text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          Create New Job
        </Link>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={idx} 
            className="bg-[#14141e] border border-[#1e1e2d] p-6 rounded-2xl shadow-xl hover:border-[#00f0ff]/30 transition-colors"
          >
            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
              <s.icon className={s.color} size={24} />
            </div>
            <p className="text-gray-400 text-sm font-semibold mb-1">{s.label}</p>
            <p className="text-3xl font-space font-bold text-white">{loading ? "-" : s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Table */}
      <div className="bg-[#14141e] border border-[#1e1e2d] rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-[#1e1e2d]">
          <h2 className="text-xl font-space font-bold text-white">Active Pipelines</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-inter text-sm">
            <thead className="bg-[#0a0a0f] text-gray-400 border-b border-[#1e1e2d]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Job Title</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Department</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Candidates</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-[#14141e]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <RefreshCw className="animate-spin mb-3 text-[#00f0ff]" size={28} />
                      Syncing with Backend Core...
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No active pipelines found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-semibold flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${
                        job.statusLabel === 'ACTIVE' ? 'bg-emerald-500 text-emerald-500' :
                        job.statusLabel === 'MATCHING' ? 'bg-amber-500 text-amber-500' :
                        'bg-purple-500 text-purple-500'
                      }`}></div>
                      {job.title}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{job.department || "General"}</td>
                    <td className="px-6 py-4 text-gray-400">{job.candidatesProcessed} Processed</td>
                    <td className="px-6 py-4">
                      <span className={`${job.statusColor} px-2 py-1 rounded text-xs tracking-wider`}>{job.statusLabel}</span>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <Link to={`/jobs/${job.id}`} className="text-[#00f0ff] hover:text-white transition-colors underline underline-offset-4 decoration-[#00f0ff]/30">Spatial Map</Link>
                      <button 
                        onClick={() => handleDelete(job.id)} 
                        className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 p-2 rounded-lg ml-auto" 
                        title="Delete Job"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
