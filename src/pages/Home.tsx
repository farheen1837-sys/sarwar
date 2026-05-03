import { motion } from "framer-motion";
import { User } from "../App";
import { GoogleGenAI } from "@google/genai";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { cn } from "../lib/utils";

interface HomeProps {
  user: User | null;
}

export default function Home({ user }: HomeProps) {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center px-6 md:px-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, y: 100 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
           className="relative z-10"
        >
          <span className="text-brand font-mono text-sm uppercase tracking-[0.4em] mb-6 block">
            Digital Excellence / 2026
          </span>
          <h1 className="text-[12vw] md:text-[10vw] font-display font-black leading-[0.85] tracking-tight uppercase rejouice-text">
            Ignite<br />
            Your<br />
            <span className="text-brand italic font-light lowercase font-sans">Vision.</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-12 right-20 text-xs font-mono uppercase tracking-widest text-white/40"
        >
          Scroll to Explore / 2026
        </motion.div>
      </section>

      {/* AI Section */}
      <section className="min-h-screen py-40 px-6 md:px-20 bg-white text-black rounded-t-[40px] md:rounded-t-[80px]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-brand font-mono text-sm uppercase tracking-widest mb-6 block"
            >
              Intelligence / Studio
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tighter leading-none mb-10">
              The Flame of<br /> Intelligence.
            </h2>
            <p className="text-lg md:text-xl text-black/60 max-w-md leading-relaxed">
              We combine cutting-edge AI models with high-end motion design to create digital products that don't just work—they inspire.
            </p>
          </div>

          <div className="w-full">
            <AIFeature />
          </div>
        </div>
      </section>

      {/* Footer-like section */}
      <section className="bg-white text-black py-20 px-6 border-t border-black/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="text-[15vw] font-display font-black tracking-tighter leading-[0.75] uppercase text-black/5">
                Flame.
            </div>
            <div className="flex flex-col items-end gap-4">
                <p className="text-sm font-medium uppercase tracking-widest text-black/40">Ready to start?</p>
                <motion.button 
                  whileInView={{ 
                    scale: [1, 1.05, 1],
                    boxShadow: ["0 0 0px rgba(255,77,0,0)", "0 0 30px rgba(255,77,0,0.2)", "0 0 0px rgba(255,77,0,0)"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="px-10 py-5 bg-black text-white rounded-full text-lg font-bold hover:bg-brand transition-all active:scale-95 relative z-10"
                >
                    Get in touch
                </motion.button>
            </div>
        </div>
      </section>
    </main>
  );
}

function AIFeature() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (!aiRef.current && process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  const handleGenerate = async () => {
    if (!prompt || !aiRef.current) return;
    
    setLoading(true);
    const newHistory = [...history, { role: 'user' as const, content: prompt }];
    setHistory(newHistory);
    
    try {
      const result = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are 'The Spark', an AI assistant for Flamework, a premium design studio. Your tone is sophisticated, brief, and inspiring. Use creative metaphors related to fire, light, and heat."
        }
      });
      
      const text = result.text || "No response received";
      setHistory([...newHistory, { role: 'ai', content: text }]);
      setPrompt("");
    } catch (error) {
      console.error("AI Error:", error);
      setHistory([...newHistory, { role: 'ai', content: "The flame flickered... Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark p-8 md:p-12 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl uppercase tracking-tighter">The Spark</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Gemini Powered Assistant</p>
          </div>
        </div>

        <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
          {history.length === 0 && (
            <p className="text-white/40 italic font-light">Ask the spark to ignite an idea...</p>
          )}
          {history.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-4 rounded-2xl max-w-[85%]",
                msg.role === 'user' 
                  ? "bg-white/5 ml-auto border border-white/10" 
                  : "bg-brand/20 border border-brand/20"
              )}
            >
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-2 p-4 bg-brand/10 border border-brand/10 rounded-2xl w-fit">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand rounded-full" />
            </div>
          )}
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Type your spark..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand/50 transition-colors pr-14"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="absolute right-2 top-2 bottom-2 w-10 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
