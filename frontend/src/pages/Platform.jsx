import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronDown, Search, ArrowRight, CheckCircle2, 
  Users, BarChart3, HeartHandshake, Link as LinkIcon, Globe2, 
  MessageSquare, FileText, PieChart, ShieldCheck
} from 'lucide-react';

export default function Platform() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    { question: 'How can an AI Recruiter help my company hire faster?', answer: 'An AI-powered recruitment platform automates tasks like resume parsing, skill matching, and candidate ranking, speeding up your time-to-hire significantly.' },
    { question: 'Will using an AI Screener improve the quality of my hires?', answer: 'Yes. By using advanced semantic matching and standardized assessment criteria, our AI ensures you focus on the most qualified candidates, reducing bias and improving hire quality.' },
    { question: 'Is an AI system only for large enterprises or can small companies benefit too?', answer: 'Small companies benefit greatly from an AI Screener. It helps streamline operations, ensuring even small HR teams can match the hiring efficiency of larger enterprise organizations without excess overhead.' },
    { question: 'How does semantic matching work?', answer: 'Our AI collects and sorts parsed resumes. When you provide a job description, it generates transformer-based semantic embeddings to provide you with the best matches instead of relying on rigid keyword filters.' },
    { question: 'What is an AI Applicant Screener?', answer: 'An AI Applicant Screener is an intelligent system that uses NLP and Machine Learning to electronically handle parsing, matching, and ranking of candidates, acting as a smart assistant for recruitment efforts.' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-white overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full bg-[#0a1128] text-white pt-24 pb-32">
        {/* Background Gradients & Grid Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -right-20 top-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex flex-col gap-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
              An <span className="text-blue-500 italic">AI Screener</span> driven by<br className="hidden md:block"/> Automation,<br className="hidden md:block"/> Intelligence & Empathy
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-xl">
              From sourcing to ranking, our AI-first platform transforms the hiring process, saving time, reducing bias, and surfacing exceptional candidates every time.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/dashboard" className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                SEE IT IN ACTION
              </Link>
              <button className="px-8 py-3.5 border border-white/30 hover:border-white text-white font-semibold rounded-md transition-colors hover:bg-white/5">
                TALK TO SALES
              </button>
            </div>
            
            {/* Trusted By Logos Mockup */}
            <div className="mt-12 flex flex-wrap items-center gap-8 opacity-70">
              <div className="text-xl font-bold tracking-widest text-slate-300">clarion</div>
              <div className="text-xl font-bold text-slate-300">bitwise</div>
              <div className="text-xl font-bold text-slate-300">CoinDCX</div>
              <div className="text-xl font-bold tracking-widest flex items-center gap-2 text-slate-300">
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white"></div><div className="w-1.5 h-1.5 bg-white"></div>
                  <div className="w-1.5 h-1.5 bg-white"></div><div className="w-1.5 h-1.5 bg-white"></div>
                </div>
                microlise
              </div>
              <div className="text-xl font-bold text-slate-300 italic">SWIGGY</div>
            </div>
          </div>

          {/* Dashboard Mockup (Right Side) */}
          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-slate-200/90 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-2xl border-4 border-slate-700/50 flex flex-col gap-4 text-slate-800"
            >
              <div className="flex justify-between items-center bg-white rounded-lg p-3 shadow-sm">
                <div className="font-bold text-lg">Dashboard</div>
                <div className="bg-slate-100 flex items-center px-3 py-1.5 rounded-md text-sm text-slate-500">
                  <Search size={16} className="mr-2" /> Search... <span className="ml-4 opacity-50">⌘/</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Accepted Offers</div>
                  <div className="text-4xl font-bold text-black mt-2">25</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Positions</div>
                  <div className="text-4xl font-bold text-black mt-2">83</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="text-xs font-semibold text-slate-500 uppercase relative z-10">Joiners</div>
                  <div className="text-4xl font-bold text-black mt-2 relative z-10">65</div>
                  <div className="absolute right-0 top-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="col-span-2 bg-white p-5 rounded-xl shadow-sm">
                  <div className="text-sm font-semibold mb-3">Location Match Score</div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-12 overflow-hidden flex justify-center border-b-2 border-slate-100">
                      <div className="w-24 h-24 rounded-full border-[12px] border-blue-500 border-t-yellow-400 border-r-green-400 absolute top-0"></div>
                    </div>
                    <div className="text-4xl font-bold">88.9%</div>
                  </div>
                </div>
                <div className="col-span-1 bg-white pt-5 px-5 rounded-xl shadow-sm overflow-hidden flex flex-col">
                   <div className="text-sm font-semibold mb-3">Skill Graph</div>
                   <div className="flex-grow bg-slate-50 mx-auto w-full max-w-[120px] rounded-t-full border border-b-0 border-blue-200 flex items-center justify-center relative">
                     <div className="absolute inset-2 border border-blue-300 rounded-t-full"></div>
                     <div className="absolute inset-4 border border-blue-400 rounded-t-full"></div>
                     <div className="w-full h-full bg-blue-500/10 rounded-t-full clip-path-polygon"></div>
                   </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16">
            Manage your <span className="text-blue-600 italic">hiring</span>.<br /> Effortlessly
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-6xl mx-auto text-left">
            {/* Feature Cards */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="text-blue-600 text-sm font-bold tracking-wider mb-2">SMART SOURCING & SCREENING</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 max-w-sm">Find Top Talent Faster with AI-Recruiting Agents</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                From job requisitions to multi-platform publishing in just one click, our AI Agents streamline your hiring process. They identify top candidates, rank them by skills, and remove unconscious bias, giving you unmatched clarity and speed in recruitment.
              </p>
              <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center text-slate-300">
                 [ Sourcing Dashboard Mockup ]
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="text-blue-600 text-sm font-bold tracking-wider mb-2">CANDIDATE ENGAGEMENT</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Keep Candidates Engaged and Ghosting at Bay</h3>
              <p className="text-slate-500 leading-relaxed mb-12">
                Build trust with a mobile-friendly portal, 24/7 AI chatbot support, and real-time updates that elevate the candidate experience from application to offer.
              </p>
              <div className="absolute bottom-6 right-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <MessageSquare size={32} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
              <div className="text-blue-600 text-sm font-bold tracking-wider mb-2">INTERVIEW LOBBY</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 max-w-sm">Automate Your Interview Process Across Time Zones</h3>
              <p className="text-slate-500 leading-relaxed mb-12">
                Handle high-volume hiring like a pro. Our scheduler seamlessly manages interviews, leaving you free to focus on building a world-class team.
              </p>
              <div className="absolute bottom-6 right-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <Globe2 size={32} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="text-blue-600 text-sm font-bold tracking-wider mb-2">REQUISITION MANAGEMENT</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Effortless requisition creation, approval, and publishing-all in one place.</h3>
                <p className="text-slate-500 leading-relaxed mb-6">
                  Every great hire starts with a clear, efficient requisition process. Our Job Description Manager brings semantic structure, speed, and intelligence to every hiring request—so you never miss a beat.
                </p>
              </div>
              <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                 [ Approvals Flow Chart Mockup ]
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Seven Steps Section */}
      <section className="py-24 bg-blue-50/50">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Hire <span className="text-blue-600 italic">Top-Talent</span> In<br /> 7 Simple Steps.
          </h2>
          <p className="text-slate-500 text-lg mb-16">
            Empathy drives our innovation—with AI that combats bias, automated workflows to simplify tasks, and tools designed to match your commitment.
          </p>

          <div className="relative text-left max-w-2xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-8 top-10 bottom-10 w-0.5 bg-blue-200"></div>

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 1
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <FileText size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Input (Upload JD & Resumes)</h3>
                   <p className="text-slate-500 text-sm">Recruiters upload a job description detailing the requirements, and candidate resumes are securely collected in PDF or DOCX formats.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 2
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <Search size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Parsing</h3>
                   <p className="text-slate-500 text-sm">Convert complex resume files into clean, structured text utilizing advanced internal tools like pdfplumber and python-docx.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 3
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <ShieldCheck size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Preprocessing</h3>
                   <p className="text-slate-500 text-sm">Perform text tokenization, normalization, stopword removal, and deep NLP text cleaning for optimal pipeline consumption.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 4
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-500 text-white p-4 rounded-xl hidden sm:block">
                   <Globe2 size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Embedding Generation</h3>
                   <p className="text-slate-500 text-sm">Generate transformer-based semantic embeddings (numeric representations) from the normalized text leveraging MiniLM or OpenAI tools.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 5 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 5
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <LinkIcon size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Matching</h3>
                   <p className="text-slate-500 text-sm">We compute the cosine similarity between the Job Description embedding and each candidate resume embedding to measure true semantic alignment.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 6 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative flex items-start gap-8 mb-8 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-200 text-blue-500 font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                 6
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <BarChart3 size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Ranking</h3>
                   <p className="text-slate-500 text-sm">Sort incoming candidates strictly by similarity score, offering recruiters an explainable skill-match breakdown showing what matched and what was missing.</p>
                 </div>
               </div>
            </motion.div>

            {/* Step 7 */}
            <motion.div 
              initial={{ opacity: 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative flex items-start gap-8 mb-4 group pl-2"
            >
               <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 border-2 border-blue-500 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                 7
               </div>
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-center flex-1 transition-transform hover:-translate-y-1 hover:shadow-md">
                 <div className="bg-blue-100 text-blue-500 p-4 rounded-xl hidden sm:block">
                   <Users size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Output</h3>
                   <p className="text-slate-500 text-sm">Display the final ranked lists through the recruiter dashboard web interface, equipping you with transparent scores and deep match details.</p>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Integrations Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative subtle background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Integrate with <span className="text-blue-600 italic">Everything</span>.
          </h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto mb-16">
            Bring together your hiring ecosystem. Integrate all your tools, eliminate silos, and supercharge your workflows for faster, smarter decisions.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
            {/* Integration Card 1 */}
            <div className="bg-[#f0f4ff] rounded-2xl p-8 transition-transform hover:-translate-y-2 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Communications</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                Seamlessly connect with candidates and teams without switching tabs. Use pre-built templates, automate follow-ups, and track every message in one place.
              </p>
              <div className="flex gap-4 items-center">
                {/* Mock Icons for Gmail, Outlook, Whatsapp, Slack */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-red-500 font-bold text-xl">M</div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-500 font-bold text-xl">O</div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500 font-bold"><MessageSquare size={20} /></div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-500 font-bold">#</div>
              </div>
            </div>

            {/* Integration Card 2 */}
            <div className="bg-[#f0f4ff] rounded-2xl p-8 transition-transform hover:-translate-y-2 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Job Boards</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                Post jobs across top job boards in a single click. Track performance, manage applications in one place, and never miss out on the right talent.
              </p>
              <div className="flex gap-4 items-center">
                 {/* Mock Icons for Job Boards */}
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-blue-700 font-bold text-xl">in</div>
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-blue-500 font-bold text-xl flex-col leading-none" style={{fontSize: '10px'}}><span>indeed</span></div>
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-sky-500 font-bold text-xl">i</div>
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-green-600 font-bold text-xl">G</div>
              </div>
            </div>

            {/* Integration Card 3 */}
            <div className="bg-[#f0f4ff] rounded-2xl p-8 transition-transform hover:-translate-y-2 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">HRMS</h3>
              <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                Sync candidate matching scores with your existing HRMS tools. Automate workflows, reduce manual data entry, and keep all systems in perfect harmony.
              </p>
              <div className="flex gap-4 items-center">
                 {/* Mock Icons for HRMS */}
                 <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-purple-600 font-bold text-xl">k</div>
                 <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-blue-600 font-bold text-xl">d</div>
                 <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm text-slate-700 font-bold text-xl">h</div>
                 <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center shadow-sm text-white font-bold text-xl">HI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-200 pb-4">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
                >
                  <div className="flex items-center gap-3">
                    <Search className="text-blue-600 font-bold" size={24} />
                    <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-blue-600' : ''}`}
                    size={24}
                  />
                </button>
                
                {openFaq === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-10 pr-4 pb-4 text-slate-600 leading-relaxed"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
