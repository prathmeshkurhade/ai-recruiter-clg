import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2d] bg-[#0a0a0f] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="text-[#00f0ff] w-6 h-6" />
            <span className="text-xl font-space font-bold text-white tracking-tight">
              HireForge <span className="text-[#00f0ff]">AI</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-sm">
            The next-generation hiring intelligence platform. Ethical AI-powered parsing, semantic skill ranking, and automated candidate workflows.
          </p>
        </div>
        <div>
          <h4 className="text-white font-space font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Ethical AI</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-space font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-[#00f0ff] transition-colors">About</Link></li>
            <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#00f0ff] transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-[#1e1e2d] text-sm text-gray-500 flex justify-between items-center">
        <p>© 2026 HireForge AI OS. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}