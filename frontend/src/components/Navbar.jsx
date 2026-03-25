import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-[#1e1e2d]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="text-[#00f0ff] w-8 h-8" />
          <span className="text-2xl font-space font-bold text-white tracking-tight">
            HireForge <span className="text-[#00f0ff]">AI</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/platform" className="text-gray-300 hover:text-[#00f0ff] transition-colors">Platform</Link>
          <Link to="/solutions" className="text-gray-300 hover:text-[#00f0ff] transition-colors">Solutions</Link>
          <Link to="/about" className="text-gray-300 hover:text-[#00f0ff] transition-colors">About Us</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
          <Link to="/login" className="bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#00f0ff]/20 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.1)]">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}