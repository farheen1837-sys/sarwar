import { motion } from "framer-motion";
import { User } from "../App";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Github, Globe } from "lucide-react";

interface LoginProps {
  user: User | null;
}

export default function Login({ user }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [showConfigHint, setShowConfigHint] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/auth/google/url");
      const data = await resp.json();
      
      if (data.error) {
        setShowConfigHint(true);
        throw new Error(data.details || data.error);
      }

      const { url } = data;
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        url,
        "google_login",
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,toolbar=no,menubar=no`
      );

      if (!popup) {
        alert("Pop-up blocked! Please allow pop-ups for this site to login with Google.");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser: User = {
      name: "Flame Pioneer",
      email: "pioneer@flamework.io",
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=flame`
    };
    
    window.postMessage({ 
      type: 'OAUTH_AUTH_SUCCESS', 
      user: demoUser 
    }, '*');
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-dark overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-brand/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-md bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-12 md:p-16 rounded-[48px] text-center relative z-10 shadow-2xl"
      >
        <motion.div 
           initial={{ scale: 0.8 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1, ease: "easeOut" }}
           className="w-16 h-16 bg-brand rounded-3xl mx-auto mb-10 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-lg shadow-brand/20"
        >
          <Sparkles className="text-white" size={32} />
        </motion.div>

        <h2 className="text-5xl font-display font-black tracking-tight mb-4 text-white uppercase rejouice-text">
          FLAMEWORK<span className="text-brand">.</span>
        </h2>
        <p className="text-white/40 text-sm mb-12 max-w-[22ch] mx-auto leading-relaxed uppercase tracking-widest font-medium">
          Ignite your digital vision with AI intelligence.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 bg-white text-black font-bold py-5 rounded-2xl hover:bg-brand hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 group shadow-xl"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:invert transition-all" alt="Gmail" />
            {loading ? "Authenticating..." : "Sign in with Gmail"}
          </button>

          <button 
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/60 font-medium py-4 rounded-2xl hover:bg-white/10 hover:text-white transition-all hover:-translate-y-1 active:scale-95"
          >
            <span className="text-[10px] uppercase tracking-[0.2em]">Enter as Guest (Demo)</span>
          </button>
        </div>

        {showConfigHint && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] text-red-400 font-mono uppercase tracking-widest leading-relaxed"
          >
            Google OAuth not configured.<br />
            Add VITE_GOOGLE_CLIENT_ID to Secrets.
          </motion.div>
        )}

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex justify-center gap-8 mb-6">
            <Github className="text-white/20 hover:text-white/50 cursor-pointer transition-colors" size={20} />
            <Globe className="text-white/20 hover:text-white/50 cursor-pointer transition-colors" size={20} />
          </div>
          <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-mono">
            Powered by Gemini Intelligence
          </p>
        </div>
      </motion.div>

      {/* Floating Design Elements */}
      <div className="absolute top-20 right-20 text-[10px] font-mono text-white/10 uppercase tracking-[1em] rotate-90 origin-right pointer-events-none">
        Design / Motion / AI
      </div>
    </main>
  );
}

import { Sparkles } from "lucide-react";
