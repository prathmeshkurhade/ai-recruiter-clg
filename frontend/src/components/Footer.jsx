import React from 'react';
import { Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-4 max-w-xs">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <div className="bg-primeBlue text-white p-1.5 rounded-md">
              <Award className="w-5 h-5" />
            </div>
            AI Recruiter
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Join the AI Revolution! Transform your hiring process and build robust teams faster.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full md:w-auto">
          <div>
            <h4 className="font-bold text-slate-900 mb-4">RESOURCES</h4>
            <ul className="space-y-2 text-primeBlue text-sm">
              <li><a href="#" className="hover:underline">Newsletters</a></li>
              <li><a href="#" className="hover:underline">Blogs</a></li>
              <li><a href="#" className="hover:underline">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">ABOUT US</h4>
            <ul className="space-y-2 text-primeBlue text-sm">
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Culture</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">CONNECT WITH US</h4>
            <ul className="space-y-2 text-primeBlue text-sm">
              <li><a href="#" className="hover:underline">LinkedIn</a></li>
              <li><a href="#" className="hover:underline">Twitter</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">POLICY</h4>
            <ul className="space-y-2 text-primeBlue text-sm">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
        <p>© {new Date().getFullYear()} AI Recruiter Pvt Ltd. All Rights Reserved.</p>
        <a href="#" className="hover:text-primeBlue hover:underline">Terms of use</a>
      </div>
    </footer>
  );
}