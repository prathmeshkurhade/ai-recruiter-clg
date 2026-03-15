import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Plus, Briefcase, ChevronRight, Clock } from "lucide-react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/jobs")
      .then((res) => {
        setJobs(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-slate-50 py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage your job postings and screen candidates.</p>
          </div>
          <Link 
            to="/jobs/new" 
            className="bg-primeBlue hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primeBlue"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-primeBlue rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs posted yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Create your first job description to start accepting and automatically matching candidate resumes using our AI model.
            </p>
            <Link 
              to="/jobs/new" 
              className="bg-primeBlue hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold inline-flex items-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <Link 
                key={job.id} 
                to={`/jobs/${job.id}`}
                className="group block bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 hover:border-primeBlue hover:shadow-lg transition-all duration-200 relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 h-full w-2 bg-primeBlue transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primeBlue transition-colors mb-2">
                      {job.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2 pr-8">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {job.required_skills && job.required_skills.length > 0 && job.required_skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-primeBlue text-xs font-semibold rounded-full border border-blue-100">
                          {skill}
                        </span>
                      ))}
                      {(!job.required_skills || job.required_skills.length === 0) && (
                        <span className="text-sm text-slate-400 italic">No skills specified</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-primeBlue font-semibold shrink-0">
                    <span className="hidden md:block">View Candidates</span>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-primeBlue group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
