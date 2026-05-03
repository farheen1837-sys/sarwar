import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User } from "../App";
import { LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference"
    >
      <Link to="/" className="text-2xl font-display font-bold tracking-tighter text-white">
        FLAMEWORK<span className="text-brand">.</span>
      </Link>

      <div className="flex items-center gap-8">
        <motion.div whileHover={{ y: -2, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Link to="/" className="text-sm uppercase tracking-widest font-medium hover:text-brand transition-colors block py-2">
            Work
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Link to="/" className="text-sm uppercase tracking-widest font-medium hover:text-brand transition-colors block py-2">
            Services
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -2, scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
          <Link to="/" className="text-sm uppercase tracking-widest font-medium hover:text-brand transition-colors block py-2">
            Studio
          </Link>
        </motion.div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-white/20 group-hover:border-brand transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-brand rounded-full border-2 border-black flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <span className="text-xs uppercase tracking-tighter font-mono hidden md:block group-hover:text-brand transition-colors">{user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="px-6 py-2 border border-white/20 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all"
          >
            Join
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
