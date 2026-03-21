import { motion } from 'framer-motion';

export default function EthicalToggle({ enabled, setEnabled }) {
  return (
    <div 
      className={`relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${enabled ? 'bg-[#00f0ff]' : 'bg-gray-700'}`}
      onClick={() => setEnabled(!enabled)}
    >
      <motion.div
        className="w-6 h-6 bg-white rounded-full shadow-lg"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        initial={false}
        animate={{
          x: enabled ? 32 : 0,
        }}
      />
    </div>
  );
}
