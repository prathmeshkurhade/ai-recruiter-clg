import { motion } from "framer-motion";
import atharvImg from "../assets/Atharv_Lalage.jpeg";
import prathmeshImg from "../assets/Prathmesh_Kurhade.jpeg";
import harshalImg from "../assets/Harshal_Kale.jpeg";
import { Code, BrainCircuit, PenTool, Github } from "lucide-react";

export default function AboutUs() {
  const team = [
    {
      name: "Atharv Lalage",
      role: "Web Developer",
      image: atharvImg,
      icon: Code,
      color: "from-[#00f0ff] to-blue-600",
      textColor: "text-[#00f0ff]"
    },
    {
      name: "Prathmesh Kurhade",
      role: "AI-ML Developer",
      image: prathmeshImg,
      icon: BrainCircuit,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-400"
    },
    {
      name: "Harshal Kale",
      role: "Design & Documentation",
      image: harshalImg,
      icon: PenTool,
      color: "from-emerald-400 to-teal-600",
      textColor: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#0a0a0f] text-gray-200 font-inter overflow-hidden relative">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#00f0ff]/5 blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-space font-extrabold text-white tracking-tight mb-6"
          >
            Meet the Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-purple-500">Architects</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            We are the foundational engineering team behind the HireForge AI framework. Dedicated to eradicating resume black holes and bringing transparent, neural-driven talent mapping to the modern hiring ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((member, index) => {
            const Icon = member.icon;
            return (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative"
              >
                <div className="bg-[#14141e] border border-[#1e1e2d] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 hover:border-gray-700 hover:-translate-y-2">
                  
                  {/* Avatar Profile Ring */}
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    <div className="absolute inset-0 rounded-full border border-gray-800 bg-[#0a0a0f] p-2">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700 border-[6px] border-[#14141e]"
                      />
                    </div>
                    {/* Role Icon floating badge */}
                    <div className={`absolute -bottom-2 -right-2 w-14 h-14 bg-[#1a1a24] border border-[#2a2a35] rounded-full flex items-center justify-center ${member.textColor} shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20`}>
                      <Icon size={24} />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-space font-bold text-white mb-3">{member.name}</h3>
                    <div className={`inline-block px-5 py-2 rounded-full bg-black/40 border border-gray-800 text-xs font-semibold tracking-widest uppercase ${member.textColor}`}>
                      {member.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Contribute Section */}
        <div className="mt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#14141e] border border-[#1e1e2d] rounded-3xl p-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-[#00f0ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <Github className="w-12 h-12 text-white mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl font-space font-bold text-white mb-4 relative z-10">Want to Contribute?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
              HireForge AI is an open-source initiative. Join us in building the ethical, AI-driven future of hiring. We welcome contributions, bug reports, and feedback!
            </p>
            <a 
              href="https://github.com/prathmeshkurhade/ai-recruiter-clg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-[#00f0ff] transition-colors duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </motion.div>
        </div>

      </div>
    </div>
  );
}