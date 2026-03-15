import React, { useState } from 'react';
import { Minus, Plus, ArrowRight, Check, ChevronUp } from 'lucide-react';

export default function Solutions() {
  const [activeTab, setActiveTab] = useState('IT SERVICES');

  const tabs = [
    'IT SERVICES',
    'FINANCE',
    'SAAS',
    'HEALTHCARE',
    'AUTOMOTIVE',
    'EDUCATION',
    'REAL ESTATE',
  ];

  return (
    <div className="flex-1 bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="bg-slate-50 pt-24 pb-20 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            <span className="text-primeBlue">Solutions</span> that Fit Every Industry<br className="hidden md:block"/> and Every Hiring Stage.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Purpose-Built Tools for Your Business, from Sourcing to Onboarding.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-lg font-bold transition-colors shadow-lg hover:shadow-blue-500/30">
              SEE IT IN ACTION
            </button>
            <button className="bg-transparent border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-8 py-3.5 rounded-lg font-bold transition-colors">
              TALK TO SALES
            </button>
          </div>
        </div>
        {/* Floating Decorative Elements would go here */}
      </section>

      {/* Marquee/Logos */}
      <section className="border-t border-b border-slate-100 bg-white py-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-12 sm:gap-16 grayscale opacity-70">
          {['CoinDCX', 'MEDLINE', 'SWIGGY', 'JKTECH', 'AngelOne', 'Clarion', 'bitwise'].map((logo, i) => (
            <div key={i} className="text-xl md:text-2xl font-black text-slate-400 tracking-tighter">
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* Industry Tabs Section */}
      <section className="pt-24 pb-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Built for every Industry,<br /> Perfected for <span className="text-blue-600">yours</span>.
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Tailored hiring solutions that meet your industry's demands, from compliance to top-tier talent acquisition.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center border-b border-slate-200 mb-8 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold tracking-wider transition-colors rounded-t-lg ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Card */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px] flex items-center">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 right-0 md:left-1/3 bg-slate-800 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
                 alt="IT Professionals" 
                 className="w-full h-full object-cover opacity-50 md:opacity-100"
               />
            </div>
            {/* Content Overlap */}
            <div className="relative z-10 w-full md:w-[60%] p-8 md:p-12 md:-ml-0">
              <div className="bg-white p-10 md:p-12 rounded-2xl shadow-xl">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                  Build Your IT Workforce<br /> Without Bottlenecks
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Orchestrate bulk tech recruitment, streamline vendor management, and leverage deep automation backed by technology, real-time analytics and compliance.
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors">
                  EXPLORE SOLUTIONS
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Stages Header */}
      <section className="py-24 bg-white text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
          Smarter Sourcing.<br />
          Fairer Screening.<br />
          Effortless Onboarding.
        </h2>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
          From your very first candidate search to discovering the best match, AI Recruiter's AI-first platform empowers you at every stage
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
          {['Sourcing', 'Screening', 'Interviewing', 'Onboarding'].map((step, idx, arr) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-900 font-bold px-6 py-3 rounded-lg">
                <div className="bg-green-500 rounded-sm p-0.5">
                  <Check className="w-3 h-3 text-white" strokeWidth={4} />
                </div>
                {step}
              </div>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-5 h-5 text-blue-200 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature Block 1: Sourcing (Left Text, Right Image) */}
      <FeatureBlock 
        title="Sourcing"
        description="Find talent where it matters. Our AI-first sourcing tools help you cast a wider net, tap into hidden talent, and build a pipeline that's always ready."
        items={[
          { title: "Unified Requisition Management", content: "Start strong. Create, approve, and manage job requisitions with built-in DEI checks and automated workflows-so every opening is set up for success.", open: true },
          { title: "Multi-Channel Publishing & Referrals", content: "Post everywhere instantly." },
          { title: "AI-Powered Talent Pools", content: "Rediscover past applicants effortlessly." }
        ]}
        buttonText="EXPLORE SOURCING"
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
        imageSide="right"
      />

      {/* Feature Block 2: Screening (Left Image, Right Text) */}
      <FeatureBlock 
        title="Screening"
        description="Spend time on the right candidates. Our screening tools use AI to match, rank, and shortlist, so you can move from resume overload to razor-sharp selection."
        items={[
          { title: "Lightning-Fast Resume Parsing", content: "Extracts dozens of data points instantly." },
          { title: "Contextual JD/Resume Matching", content: "Deep learning compares semantic skills.", open: true },
          { title: "Bias-Free Shortlisting", content: "Hide demographics to focus purely on merit." }
        ]}
        buttonText="EXPLORE SCREENING"
        image="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
        imageSide="left"
      />

      {/* Feature Block 3: Interviewing (Left Text, Right Image) */}
      <FeatureBlock 
        title="Interviewing"
        description="Keep interviews moving and teams aligned. Automates scheduling, streamlines feedback, and creates a candidate experience that stands out."
        items={[
          { title: "Automated Interview Scheduling", content: "Syncs calendars and suggests times automatically.", open: true },
          { title: "Structured Feedback & Collaboration", content: "Scorecards and centralized notes." },
          { title: "Candidate-Centric Experience", content: "Keep them informed at every step." }
        ]}
        buttonText="EXPLORE INTERVIEWING"
        image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop"
        imageSide="right"
      />

      {/* Feature Block 4: Onboarding (Left Image, Right Text) */}
      <FeatureBlock 
        title="Onboarding"
        description="Make every new hire feel welcome and ready. Our onboarding tools automate paperwork, verify IDs, and integrate with your HRMS-so your talent hits the ground running."
        items={[
          { title: "Seamless Offer Management", content: "Generate offers with auto-populating fields.", open: true },
          { title: "Digital Document Collection & ID Verification", content: "Secure and fast document handling." },
          { title: "Workflow Automation", content: "Triggers IT provisioning and welcoming emails." }
        ]}
        buttonText="EXPLORE ONBOARDING"
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1932&auto=format&fit=crop"
        imageSide="left"
      />

      {/* Final CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 bg-gradient-to-bl from-blue-600/30 to-transparent w-full h-full"></div>
          
          <div className="p-16 md:p-24 relative z-10 flex flex-col justify-center max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 leading-tight tracking-tight">
              Take a Quick, Interactive<br /> Product Tour today!
            </h2>
            <div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20 text-lg">
                SCHEDULE A DEMO
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Subtle Decorative abstract blob right side */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full"></div>
        </div>
      </section>

    </div>
  );
}

function FeatureBlock({ title, description, items, buttonText, image, imageSide }) {
  return (
    <section className="py-16 md:py-24 bg-white px-4">
      <div className={`max-w-6xl mx-auto flex flex-col gap-16 items-center ${imageSide === 'left' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
        
        {/* Text & Accordions */}
        <div className="flex-1 space-y-8 w-full">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">{title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">{description}</p>
          </div>

          <div className="space-y-1">
            {items.map((item, idx) => (
              <div key={idx} className={`border border-slate-200 ${item.open ? 'bg-indigo-950 text-white' : 'bg-indigo-950 text-white'} overflow-hidden transition-all shrink-0`}>
                <div className={`flex items-center gap-4 p-5 cursor-pointer ${item.open ? 'border-b border-indigo-900/50' : ''}`}>
                  {item.open ? <Minus className="w-5 h-5 text-blue-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
                  <h4 className={`font-bold ${item.open ? 'text-blue-500' : 'text-blue-500'}`}>{item.title}</h4>
                </div>
                {item.open && (
                  <div className="p-5 pl-14 pt-2 text-slate-200 text-sm leading-relaxed bg-white text-slate-700">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center gap-2 transition-colors mt-4">
                {buttonText}
                <ArrowRight className="w-5 h-5" />
             </button>
          </div>

          <div className="pt-8 text-center text-slate-300">
             <ChevronUp className="w-8 h-8 opacity-50 mx-auto" />
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 w-full relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-3xl transform group-hover:scale-[1.02] transition-transform duration-500"></div>
          <img 
            src={image} 
            alt={title} 
            className="w-full h-auto rounded-3xl object-cover shadow-2xl aspect-[4/3] transform transition-transform duration-500 group-hover:shadow-blue-900/20"
          />
        </div>

      </div>
    </section>
  );
}