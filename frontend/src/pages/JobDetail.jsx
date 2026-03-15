import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, UploadCloud, Sparkles, CheckCircle2, XCircle, FileText, Medal } from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data));
    api.get(`/matching/${id}/results`).then((res) => setResults(res.data)).catch(() => {});
  }, [id]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    await api.post(`/resumes/${id}/upload`, formData);
    setUploading(false);
  };

  const handleMatch = async () => {
    setMatching(true);
    const res = await api.post(`/matching/${id}/run`);
    setResults(res.data);
    setMatching(false);
  };

  if (!job) return (
    <div className="flex-1 flex justify-center items-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primeBlue"></div>
    </div>
  );

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header & Back Button */}
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primeBlue transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">{job.title}</h1>
                <p className="text-slate-600 leading-relaxed mb-6">{job.description}</p>
                <div className="flex flex-wrap gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">Experience</span>
                    <span className="font-medium text-slate-800 bg-slate-100 px-3 py-1 rounded-md">{job.experience_level || "Not specified"}</span>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-2">Required Skills</span>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills?.map((skill, idx) => (
                         <span key={idx} className="bg-blue-50 text-primeBlue px-3 py-1 rounded-full font-semibold border border-blue-100 text-xs">
                           {skill}
                         </span>
                      )) || <span className="text-slate-500 italic">None</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Actions & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Upload & Run Matching */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primeBlue" />
                Upload Resumes
              </h3>
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primeBlue hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-700">Select PDFs or DOCXs</span>
                <span className="text-xs text-slate-500 mt-1">Drag & drop or click</span>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              {uploading && (
                <div className="mt-4 p-3 bg-blue-50 text-primeBlue text-sm font-medium rounded-lg text-center animate-pulse">
                  Uploading files...
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Evaluate Candidates</h3>
              <p className="text-sm text-slate-500 mb-4">Run the AI models to score uploaded resumes.</p>
              <button 
                onClick={handleMatch}
                disabled={matching || uploading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-md"
              >
                {matching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>Run AI Matching</>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Ranked Candidates */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Medal className="w-6 h-6 text-yellow-500" />
                  Ranked Candidates
                </h2>
                <span className="text-sm font-medium px-3 py-1 bg-slate-200 text-slate-700 rounded-lg">
                  {results.length} Candidates
                </span>
              </div>

              {results.length === 0 ? (
                <div className="p-12 text-center flex-1 flex flex-col justify-center items-center">
                  <FileText className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-slate-500 text-lg">No results yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Upload resumes and run matching to see rankings.</p>
                </div>
              ) : (
                <div className="overflow-x-auto p-0 m-0">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-bold text-center">Rank</th>
                        <th className="px-6 py-4 font-bold">Candidate</th>
                        <th className="px-6 py-4 font-bold">Score</th>
                        <th className="px-6 py-4 font-bold w-1/3">Matched Skills</th>
                        <th className="px-6 py-4 font-bold w-1/3">Missing Skills</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((r, i) => (
                        <tr key={r.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4 text-center">
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              i === 0 ? 'bg-yellow-100 text-yellow-700' :
                              i === 1 ? 'bg-slate-200 text-slate-700' :
                              i === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              #{i + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                            {r.candidate_name || `Resume #${r.resume_id}`}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-base ${r.similarity_score > 0.7 ? 'text-green-600' : r.similarity_score > 0.4 ? 'text-amber-500' : 'text-slate-600'}`}>
                                {(r.similarity_score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {r.skill_matches?.matched?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {r.skill_matches.matched.map((skill, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : <span className="text-slate-400 italic">None</span>}
                          </td>
                          <td className="px-6 py-4">
                            {r.skill_matches?.missing?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {r.skill_matches.missing.map((skill, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : <span className="text-slate-400 italic">None</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
