import { useState, useEffect } from 'react';
import { Fingerprint, Scale, Activity, RefreshCw } from 'lucide-react';
import EthicalToggle from '../components/EthicalToggle';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function EthicalSettings() {
  const [identityMasking, setIdentityMasking] = useState(true);
  const [zeroKnowledge, setZeroKnowledge] = useState(true);
  const [biasSuppression, setBiasSuppression] = useState(true);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const handleToggleChange = async (key, val, stateSetter) => {
    // Optimistic UI updates
    stateSetter(val);
    
    const payload = {
        identity_masking: key === 'identityMasking' ? val : identityMasking,
        zero_knowledge: key === 'zeroKnowledge' ? val : zeroKnowledge,
        bias_suppression: key === 'biasSuppression' ? val : biasSuppression
    };
    try {
        await axios.put("http://localhost:8000/api/settings/preferences", payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch(e) {
        console.error("Failed to commit Toggle Setting", e);
    }
  }

  useEffect(() => {
    async function fetchData() {
       try {
           const headers = { Authorization: `Bearer ${token}` };
           const [prefRes, logsRes] = await Promise.all([
               axios.get("http://localhost:8000/api/settings/preferences", { headers }),
               axios.get("http://localhost:8000/api/settings/logs?limit=50", { headers })
           ]);
           setIdentityMasking(prefRes.data.identity_masking);
           setZeroKnowledge(prefRes.data.zero_knowledge);
           setBiasSuppression(prefRes.data.bias_suppression);
           setLogs(logsRes.data);
           setLoading(false);
       } catch (err) {
           console.error("Failed fetching settings", err);
           setLoading(false);
       }
    }
    if (token) fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <RefreshCw className="animate-spin text-[#00f0ff] w-10 h-10 mb-4" />
          <p className="text-gray-400 tracking-widest font-space text-lg">ACCESSING AUDIT LOGS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-[#0a0a0f] p-10 font-inter w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-10"
      >
        <header>
          <h1 className="text-4xl font-space font-bold text-white tracking-tight">Ethical Console</h1>
          <p className="text-gray-400 mt-2 text-lg">Manage AI reasoning limits, privacy controls, and ingestion transparency.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Privacy & Anonymization */}
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-cyan-900/30 rounded-xl text-[#00f0ff]">
                <Fingerprint size={24} />
              </div>
              <h2 className="text-2xl font-space font-bold text-white">Privacy & Anonymization</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800">
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Identity Masking <span className="text-xs bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded-full">ACTIVE</span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">Hides names, genders, and pictures during initial similarity matches.</p>
                </div>
                <EthicalToggle enabled={identityMasking} setEnabled={(val) => handleToggleChange('identityMasking', val, setIdentityMasking)} />
              </div>

              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800">
                <div>
                  <h3 className="text-white font-semibold">Zero-Knowledge Proofs</h3>
                  <p className="text-sm text-gray-400 mt-1">Candidates match without storing raw resume data permanently.</p>
                </div>
                <EthicalToggle enabled={zeroKnowledge} setEnabled={(val) => handleToggleChange('zeroKnowledge', val, setZeroKnowledge)} />
              </div>
            </div>
          </div>

          {/* Inference & Bias Limits */}
          <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-900/30 rounded-xl text-purple-400">
                <Scale size={24} />
              </div>
              <h2 className="text-2xl font-space font-bold text-white">Bias Suppression Engine</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-gray-800">
                <div>
                  <h3 className="text-white font-semibold">Semantic Neutrality Filter</h3>
                  <p className="text-sm text-gray-400 mt-1">Normalizes university names and geographic locations.</p>
                </div>
                <EthicalToggle enabled={biasSuppression} setEnabled={(val) => handleToggleChange('biasSuppression', val, setBiasSuppression)} />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Stringency Level</span>
                  <span className="text-purple-400">Maximum Overrides</span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Ingestion Logs */}
        <div className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-900/30 rounded-xl text-emerald-400">
                <Activity size={24} />
              </div>
              <h2 className="text-2xl font-space font-bold text-white">Real-Time Ingestion Logs</h2>
            </div>
            <button className="text-sm font-semibold text-emerald-400 border border-emerald-400/30 px-4 py-2 rounded-lg hover:bg-emerald-400/10 cursor-pointer transition-colors">
              Export Audit Trail
            </button>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0a0a0f] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Timestamp (UTC)</th>
                  <th className="px-6 py-4 font-medium">Tracked Action Event</th>
                  <th className="px-6 py-4 font-medium">Foreign Reference Entity</th>
                  <th className="px-6 py-4 font-medium">Process Status Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-[#14141e]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No ingestion logs or privacy audits tracked yet. Securely process candidate vectors to populate the immutable log.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-gray-400 font-mono">{log.timestamp}</td>
                      <td className="px-6 py-4 text-white">{log.event}</td>
                      <td className="px-6 py-4 text-gray-400">{log.entity}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs tracking-wider font-bold ${
                          log.status === 'CLEAN_PASS' || log.status === 'SYNCED' ? 'text-emerald-400 bg-emerald-400/10' : 
                          log.status === 'REDACTED' ? 'text-amber-400 bg-amber-400/10' : 
                          'text-[#00f0ff] bg-[#00f0ff]/10'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
