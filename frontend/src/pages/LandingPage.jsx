import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Search, Award, FileText, ArrowRight, BarChart2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-lightBlue to-blue-100 pt-20 pb-32 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 z-10 w-full">
            <h2 className="text-slate-600 font-medium tracking-wide uppercase text-sm md:text-base">
              AI-Powered JD/Resume Matching & Ranking
            </h2>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Confident Screening <br/>
              <span className="text-primeBlue">at Speed</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Transform your screening process with our flagship AI-driven JD/resume matching 
              and rank ordering tool. Using Gen AI to read resumes and job descriptions contextually, 
              we deliver an overall relevancy score for each candidate, enabling faster, more confident hiring.
            </p>
            <div className="pt-4 flex gap-4">
              <Link to="/login" className="bg-primeBlue text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2">
                Try it Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="flex-1 relative hidden md:block">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-20 transform -translate-y-12"></div>
            {/* Using a placeholder SVG illustrating a recruiter/dashboard */}
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
              alt="Recruiter" 
              className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-primeBlue mb-16 text-center uppercase tracking-wider">Key Features</h2>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="relative w-72 h-72">
                  <div className="absolute left-0 top-0 w-48 h-48 rounded-full border-2 border-slate-200 bg-blue-50/50 flex items-center justify-center opacity-80 backdrop-blur-md">
                    <span className="text-slate-500 font-medium">Job <br/>Description</span>
                  </div>
                  <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full border-2 border-slate-200 bg-blue-100/50 flex items-center justify-center opacity-80 backdrop-blur-md">
                    <span className="text-slate-500 font-medium">Resume</span>
                  </div>
                  <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-primeBlue bg-primeBlue/10 flex flex-col items-center justify-center z-10 shadow-lg backdrop-blur-md">
                    <span className="text-primeBlue font-bold text-sm text-center">Skills,<br/>Competencies,<br/>& Experience</span>
                  </div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-primeBlue text-lg font-bold italic">
                    Ideal Candidate ↓
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900">1. Contextual JD and Resume Matching by Gen AI</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Our AI-powered resume reader evaluates both job descriptions and resumes with human-like understanding, matching skills, competencies, and experience contextually. The result is a ranked list of applications based on relevancy, giving recruiters a clear view of top matches without manual sorting.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 flex justify-center relative">
                <div className="bg-gradient-to-t from-blue-50 to-white rounded-t-full border-b border-blue-200 w-80 h-64 relative flex items-end justify-center pb-8">
                  <div className="flex items-end gap-4">
                    <div className="w-12 bg-blue-300 h-24 rounded-t-md relative flex items-end justify-center pb-2 font-bold text-white shadow-inner">3</div>
                    <div className="w-16 bg-primeBlue h-40 rounded-t-md relative flex items-end justify-center pb-2 font-bold text-white shadow-2xl transform hover:-translate-y-2 transition-transform cursor-pointer">
                      1<Award className="absolute -top-6 text-yellow-400 w-8 h-8" />
                    </div>
                    <div className="w-12 bg-blue-400 h-32 rounded-t-md relative flex items-end justify-center pb-2 font-bold text-white shadow-inner">2</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900">2. AI Relevancy Scoring & Intuitive Ranking</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Each application receives a comprehensive AI relevancy score. This flexibility allows you to combine AI insights with your requirements to make screening precise and aligned with hiring goals. See a breakdown of what exactly matches, and what's missing.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="bg-lightBlue border border-blue-200 rounded-xl p-6 shadow-md w-full max-w-sm flex items-center gap-4">
                  <Search className="text-primeBlue w-8 h-8" />
                  <div className="flex-1">
                    <div className="bg-white rounded-md border border-slate-200 p-3 text-slate-500 font-mono text-sm flex items-center">
                      Advanced filtering & Search...
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900">3. Advanced Parsing for Precision Screening</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Instantly pull data from PDF and DOCX files. Our model understands complex layouts and accurately extracts skills, contact details, and core context from free-text descriptions, zeroing in on the most qualified candidates automatically.
                </p>
              </div>
            </div>
            
             {/* Feature 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="bg-primeBlue rounded-xl p-8 text-white shadow-xl rotate-3 transform transition-transform hover:rotate-0">
                    <FileText className="w-16 h-16 opacity-80" />
                  </div>
                  <div className="bg-slate-800 rounded-xl p-8 text-white shadow-xl -rotate-6 absolute top-4 left-4 -z-10">
                     <FileText className="w-16 h-16 opacity-20" />
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-900">4. Streamlined Bulk Screening</h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Screen dozens of CVs instantly. Our system processes candidate pools in bulk, returning highly-readable comparisons and scores. This bulk decision-making capability enhances screening speed without compromising accuracy.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-24 px-8 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-primeBlue uppercase tracking-wider">Summary</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            With our advanced JD/resume matching and rank ordering tool, recruiters can screen faster and with greater confidence. Combining contextual AI relevancy scoring, smart parsing, and bulk review capabilities, our platform empowers recruiters to manage high volumes with accuracy and precision, making hiring smarter and more effective.
          </p>
          <div className="pt-8">
            <Link to="/login" className="bg-primeBlue text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg inline-flex items-center gap-2">
              Start Screening Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}