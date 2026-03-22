import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const { token } = useAuth();
  
  // Try to load initial state from sessionStorage for instant zero-latency loads
  const [jobs, setJobs] = useState(() => {
    const cached = sessionStorage.getItem("cached_jobs");
    return cached ? JSON.parse(cached) : [];
  });
  
  const [statsData, setStatsData] = useState(() => {
    const cachedStats = sessionStorage.getItem("cached_stats");
    return cachedStats ? JSON.parse(cachedStats) : {
      activeJobs: 0,
      candidatesProcessed: 0,
      matchesFound: 0,
      efficiency: "+0%"
    };
  });

  const [loading, setLoading] = useState(!sessionStorage.getItem("cached_jobs"));

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const jobsRes = await axios.get("http://localhost:8000/api/jobs/", { headers });
      const fetchedJobs = jobsRes.data;
      
      let totalCandidates = 0;
      let totalMatches = 0;
      
      const enrichedJobs = await Promise.all(fetchedJobs.map(async (job) => {
        let candidatesCount = 0;
        let matchesCount = 0;
        
        try {
          const resumesRes = await axios.get(`http://localhost:8000/api/resumes/${job.id}`, { headers });
          candidatesCount = resumesRes.data.length;
        } catch (e) {
          console.error(`Error fetching resumes for job ${job.id}`, e);
        }
        
        try {
          const matchesRes = await axios.get(`http://localhost:8000/api/matching/${job.id}/results`, { headers });
          matchesCount = matchesRes.data.length;
        } catch (e) {
          console.error(`Error fetching matching for job ${job.id}`, e);
        }
        
        totalCandidates += candidatesCount;
        totalMatches += matchesCount;
        
        let statusLabel = "PARSING";
        let statusColor = "text-purple-400 bg-purple-400/10";
        
        if (candidatesCount > 0 && matchesCount === 0) {
          statusLabel = "MATCHING";
          statusColor = "text-amber-400 bg-amber-400/10";
        } else if (candidatesCount > 0 && matchesCount > 0) {
          statusLabel = "ACTIVE";
          statusColor = "text-emerald-400 bg-emerald-400/10";
        }
        
        return {
          ...job,
          candidatesProcessed: candidatesCount,
          statusLabel,
          statusColor
        };
      }));
      
      let efficiencyStr = "+0%";
      if (totalCandidates > 0) {
        const eff = (totalMatches / totalCandidates) * 100;
        efficiencyStr = `+${eff.toFixed(1)}%`;
      }
      
      const newStats = {
        activeJobs: fetchedJobs.length,
        candidatesProcessed: totalCandidates,
        matchesFound: totalMatches,
        efficiency: efficiencyStr
      };

      setJobs(enrichedJobs);
      setStatsData(newStats);
      
      // Update the browser sessionStorage cache
      sessionStorage.setItem("cached_jobs", JSON.stringify(enrichedJobs));
      sessionStorage.setItem("cached_stats", JSON.stringify(newStats));
      
    } catch (err) {
      console.error("JobsContext multi-fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const deleteJob = async (jobId) => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:8000/api/jobs/${jobId}`, { headers });
      
      const updatedJobs = jobs.filter(j => j.id !== jobId);
      setJobs(updatedJobs);
      sessionStorage.setItem("cached_jobs", JSON.stringify(updatedJobs));
      
      setStatsData(prev => {
        const newStats = {
          ...prev,
          activeJobs: updatedJobs.length
        };
        sessionStorage.setItem("cached_stats", JSON.stringify(newStats));
        return newStats;
      });
      
    } catch (err) {
      console.error("Error deleting job:", err);
      throw err;
    }
  };

  // Run the fetch seamlessly in background when tab mounts or token switches
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Purge cache if token disappears (logged out)
  useEffect(() => {
    if (!token) {
      sessionStorage.removeItem("cached_jobs");
      sessionStorage.removeItem("cached_stats");
      setJobs([]);
      setStatsData({
        activeJobs: 0,
        candidatesProcessed: 0,
        matchesFound: 0,
        efficiency: "+0%"
      });
    }
  }, [token]);

  return (
    <JobsContext.Provider value={{ jobs, statsData, loading, refetch: fetchDashboardData, deleteJob }}>
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);
