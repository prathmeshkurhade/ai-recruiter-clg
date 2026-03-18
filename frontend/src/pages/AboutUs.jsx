import React from 'react';
import { Users, Target, Rocket } from 'lucide-react';

import imgAtharv from '../assets/Atharv_Lalage.jpeg';
import imgPrathmesh from '../assets/Prathmesh_Kurhade.jpeg';
import imgHarshal from '../assets/Harshal_Kale.jpeg';

const teamMembers = [
  {
    name: "Atharv Lalage",
    role: "Web Developer",
    image: imgAtharv,
    bio: "Architecting the frontend and backend systems for seamless user experiences."
  },
  {
    name: "Prathmesh Kurhade",
    role: "ML Developer",
    image: imgPrathmesh,
    bio: "Designing and fine-tuning the AI/NLP models powering the core resume screening."
  },
  {
    name: "Harshal Kale",
    role: "Documentation and Designing",
    image: imgHarshal,
    bio: "Crafting beautiful UI designs and comprehensive project documentation."
  }
];

export default function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Revolutionizing Hiring with AI
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600">
          At AI Recruiter, our mission is to eliminate bias and save time by automating the parsing and screening of resumes, connecting the right talent with the right opportunities.
        </p>
      </div>

      {/* Core Values */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-24">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-100 text-primeBlue rounded-xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Precision</h3>
          <p className="text-slate-600">Semantic matching ensures you find candidates based on skills and context, not just keywords.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-100 text-primeBlue rounded-xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Speed</h3>
          <p className="text-slate-600">Cut down pre-screening time by up to 80% so recruiters can focus on building relationships.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div className="w-14 h-14 bg-blue-100 text-primeBlue rounded-xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Fairness</h3>
          <p className="text-slate-600">Our machine learning models prioritize qualifications and merit over demographics.</p>
        </div>
      </div>

      {/* Team / Careers Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet the Team</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            We are a group of passionate engineers, product designers, and TA experts driven to change the recruitment landscape.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all text-center">
              <div className="pt-8 pb-6 px-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-slate-50 mb-4 shadow-sm"
                />
                <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                <p className="text-primeBlue font-medium mb-4">{member.role}</p>
                <p className="text-slate-600 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contribute Call to Action */}
      <div className="max-w-4xl mx-auto mt-24 bg-primeBlue rounded-3xl p-10 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Want to Contribute?</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">
          We are building this open-source project to revolutionize the hiring process. Check out our codebase and help us build the future of AI recruiting!
        </p>
        <a 
          href="https://github.com/prathmeshkurhade/ai-recruiter-clg" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-white text-primeBlue px-8 py-3 rounded-full font-bold shadow-md hover:bg-slate-50 transition"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
}