import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Briefcase, Activity, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SidebarLayout({ children }) {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", path: "/jobs/new", icon: Briefcase },
    { name: "Analytics", path: "/dashboard", icon: Activity },
    { name: "Ethical Settings", path: "/settings", icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-gray-200 font-inter overflow-hidden">
      <aside className="w-64 bg-[#14141e] border-r border-[#1e1e2d] flex flex-col">
        <div className="px-6 pb-6 pt-6">
          <Link to="/">
            <h1 className="text-2xl font-space font-bold text-white flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <Shield className="text-[#00f0ff]" />
              AI<span className="text-[#00f0ff]">Recruiter</span>
            </h1>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active ? "bg-[#00f0ff]/10 text-[#00f0ff] font-semibold" : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-[#1e1e2d] space-y-2">
          {user && (
            <Link to="/profile" className="block px-4 py-3 mb-2 flex items-center gap-3 bg-black/20 rounded-xl border border-gray-800/50 hover:bg-black/40 hover:border-gray-700 transition-all shadow-lg shadow-black/30 cursor-pointer group">
                <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-tr from-[#00f0ff] to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] border border-[#00f0ff]/30 group-hover:scale-105 transition-transform">
                  {user.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-white font-semibold text-sm leading-tight truncate group-hover:text-[#00f0ff] transition-colors">{user.full_name}</span>
                  <span className="text-gray-500 text-xs leading-none mt-1 truncate">{user.email}</span>
                </div>
            </Link>
          )}
          <button onClick={logout} className="flex gap-3 px-4 py-3 text-gray-400 hover:text-red-400 w-full transition-colors rounded-xl hover:bg-red-400/10 cursor-pointer">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
